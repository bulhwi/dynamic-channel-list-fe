/**
 * Sendbird 클라이언트 서비스
 *
 * Sendbird SDK 인스턴스에 대한 싱글톤 접근을 제공합니다.
 * 초기화, 연결 및 연결 해제 로직을 포함합니다.
 */

import SendbirdChat from '@sendbird/chat'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'
import type { SendbirdChatWith, User } from '@sendbird/chat'

// 싱글톤 인스턴스
let sendbirdInstance: SendbirdChatWith<[GroupChannelModule]> | null = null

/**
 * 필수 설정으로 Sendbird SDK를 초기화합니다.
 *
 * 싱글톤 패턴을 사용하여 하나의 인스턴스만 존재하도록 보장합니다.
 * **중요**: 과제 요구사항에 따라 localCacheEnabled는 false로 설정됩니다.
 *
 * @returns {SendbirdChatWith<[GroupChannelModule]>} 초기화된 Sendbird 인스턴스
 * @throws {Error} NEXT_PUBLIC_SENDBIRD_APP_ID 환경 변수가 없을 때
 *
 * @example
 * ```typescript
 * const sendbird = initializeSendbird()
 * ```
 */
export function initializeSendbird(): SendbirdChatWith<[GroupChannelModule]> {
  // 이미 초기화된 경우 기존 인스턴스 반환
  if (sendbirdInstance) {
    return sendbirdInstance
  }

  // 환경 변수 검증
  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID

  if (!appId) {
    throw new Error('NEXT_PUBLIC_SENDBIRD_APP_ID environment variable is required')
  }

  // 필수 설정으로 Sendbird 초기화
  sendbirdInstance = SendbirdChat.init({
    appId,
    localCacheEnabled: false, // 과제 요구사항
    modules: [new GroupChannelModule()],
  })

  return sendbirdInstance
}

/**
 * 사용자를 Sendbird에 연결합니다.
 *
 * 연결 전에 initializeSendbird()를 먼저 호출해야 합니다.
 *
 * @param {string} userId - 고유한 사용자 식별자
 * @param {string} [accessToken] - 인증된 사용자를 위한 선택적 액세스 토큰
 * @returns {Promise<User>} 연결된 사용자 객체
 * @throws {Error} Sendbird가 초기화되지 않았거나 userId가 없을 때
 *
 * @example
 * ```typescript
 * const user = await connectUser('user-123', 'optional-token')
 * console.log('Connected:', user.userId)
 * ```
 */
export async function connectUser(userId: string, accessToken?: string): Promise<User> {
  // userId 검증
  if (!userId || userId.trim() === '') {
    throw new Error('userId is required')
  }

  // Sendbird 초기화 확인
  const instance = getSendbirdInstance()
  if (!instance) {
    throw new Error('Sendbird is not initialized. Call initializeSendbird() first.')
  }

  try {
    // 토큰 유무에 따라 사용자 연결
    const user = await instance.connect(userId, accessToken)
    return user
  } catch (error) {
    // 원본 에러 메시지와 함께 다시 던지기
    throw error
  }
}

/**
 * 현재 사용자를 Sendbird에서 연결 해제합니다.
 *
 * @returns {Promise<void>}
 * @throws {Error} Sendbird가 초기화되지 않았을 때
 *
 * @example
 * ```typescript
 * await disconnectUser()
 * console.log('User disconnected')
 * ```
 */
export async function disconnectUser(): Promise<void> {
  const instance = getSendbirdInstance()
  if (!instance) {
    throw new Error('Sendbird is not initialized')
  }

  await instance.disconnect()
}

/**
 * 현재 Sendbird 인스턴스를 가져옵니다.
 *
 * @returns {SendbirdChatWith<[GroupChannelModule]> | null} Sendbird 인스턴스 또는 초기화되지 않은 경우 null
 *
 * @example
 * ```typescript
 * const sendbird = getSendbirdInstance()
 * if (sendbird) {
 *   console.log('Sendbird is ready')
 * }
 * ```
 */
export function getSendbirdInstance(): SendbirdChatWith<[GroupChannelModule]> | null {
  return sendbirdInstance
}

/**
 * Sendbird 인스턴스를 재설정합니다 (테스트 목적).
 *
 * @internal
 */
export function _resetSendbirdInstance(): void {
  sendbirdInstance = null
}
