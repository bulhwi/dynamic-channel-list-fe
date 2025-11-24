/**
 * Sendbird 채널 서비스
 *
 * Sendbird SDK를 사용한 채널 생성, 조회 및 관리 기능을 제공합니다.
 */

import { getSendbirdInstance } from './client'
import { generateRandomName } from '@/_lib/utils'
import type { Channel } from '@/_types/channel.types'
import type {
  GroupChannel,
  GroupChannelListQuery,
  GroupChannelListQueryParams,
} from '@sendbird/chat/groupChannel'

export interface GetChannelsOptions {
  /** 한 번에 가져올 채널 수 (기본값: 20) */
  limit?: number
}

export interface GetChannelsResult {
  /** 채널 목록 */
  channels: Channel[]
  /** 다음 페이지가 있는지 여부 */
  hasMore: boolean
}

/**
 * Sendbird SDK를 사용하여 채널 목록을 가져옵니다.
 *
 * 페이지네이션을 지원하며, GroupChannel 객체를 Channel 타입으로 변환합니다.
 *
 * @param {GetChannelsOptions} options - 조회 옵션 (limit)
 * @returns {Promise<GetChannelsResult>} 채널 목록과 hasMore 플래그
 * @throws {Error} Sendbird 인스턴스가 초기화되지 않았을 때
 *
 * @example
 * ```typescript
 * const result = await getChannels({ limit: 20 })
 * console.log(result.channels) // 채널 배열
 * console.log(result.hasMore) // 더 많은 채널이 있는지 여부
 * ```
 *
 * @note 무한 스크롤을 위한 페이지네이션은 Issue #21-22에서 구현 예정
 */
export async function getChannels(options: GetChannelsOptions = {}): Promise<GetChannelsResult> {
  const { limit = 20 } = options

  // Sendbird 인스턴스 가져오기
  const sendbird = getSendbirdInstance()

  if (!sendbird) {
    throw new Error('Sendbird instance not initialized')
  }

  try {
    // GroupChannelListQuery 파라미터 설정
    const params: GroupChannelListQueryParams = {
      limit,
      includeEmpty: true, // 빈 채널도 포함
      // order는 기본값 사용 (chronological)
    }

    // 쿼리 생성
    const query: GroupChannelListQuery = sendbird.groupChannel.createMyGroupChannelListQuery(params)

    // 채널 목록 조회
    const groupChannels: GroupChannel[] = await query.next()

    // GroupChannel을 Channel 타입으로 변환
    const channels: Channel[] = groupChannels.map(gc => ({
      url: gc.url,
      name: gc.name,
      createdAt: gc.createdAt,
      ...(gc.customType && { customType: gc.customType }),
      ...(gc.data && { data: gc.data }),
    }))

    // 결과 반환
    return {
      channels,
      hasMore: query.hasNext,
    }
  } catch (error) {
    // 에러를 상위로 전파
    throw error
  }
}

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
