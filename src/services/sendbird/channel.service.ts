/**
 * Sendbird 채널 서비스
 *
 * Sendbird SDK를 사용한 채널 생성 및 관리 기능을 제공합니다.
 */

import { getSendbirdInstance } from './client'
import { generateRandomName } from '@/_lib/utils'
import type { Channel } from '@/_types/channel.types'
import type { GroupChannel } from '@sendbird/chat/groupChannel'

/**
 * 랜덤 이름으로 새 채널을 생성합니다.
 *
 * 8자리 소문자 영문 랜덤 문자열을 이름으로 사용하여
 * Sendbird 그룹 채널을 생성합니다.
 *
 * @returns {Promise<Channel>} 생성된 채널 정보
 * @throws {Error} Sendbird 인스턴스가 초기화되지 않았을 때
 * @throws {Error} 채널 생성이 실패했을 때
 *
 * @example
 * ```typescript
 * const channel = await createChannel()
 * console.log(channel.name) // "xkqpmwjd"
 * ```
 */
export async function createChannel(): Promise<Channel> {
  // Sendbird 인스턴스 가져오기
  const sendbird = getSendbirdInstance()

  if (!sendbird) {
    throw new Error('Sendbird instance not initialized')
  }

  // 랜덤 이름 생성
  const randomName = generateRandomName()

  try {
    // Sendbird SDK로 채널 생성
    const groupChannel: GroupChannel = await sendbird.groupChannel.createChannel({
      name: randomName,
    })

    // GroupChannel을 Channel 타입으로 변환
    return {
      url: groupChannel.url,
      name: groupChannel.name,
      createdAt: groupChannel.createdAt,
      ...(groupChannel.customType && { customType: groupChannel.customType }),
    }
  } catch (error) {
    // 에러를 상위로 전파
    throw error
  }
}
