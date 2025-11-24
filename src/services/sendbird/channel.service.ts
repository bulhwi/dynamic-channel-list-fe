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
  /** 페이지네이션을 위한 query 인스턴스 (선택적) */
  query?: GroupChannelListQuery
}

export interface GetChannelsResult {
  /** 채널 목록 */
  channels: Channel[]
  /** 다음 페이지가 있는지 여부 */
  hasMore: boolean
  /** 다음 페이지를 위한 query 인스턴스 */
  query: GroupChannelListQuery
}

/**
 * Sendbird SDK를 사용하여 채널 목록을 가져옵니다.
 *
 * 페이지네이션을 지원하며, GroupChannel 객체를 Channel 타입으로 변환합니다.
 * query 인스턴스를 전달하면 다음 페이지를 가져오고, 없으면 첫 페이지를 가져옵니다.
 *
 * @param {GetChannelsOptions} options - 조회 옵션 (limit, query)
 * @returns {Promise<GetChannelsResult>} 채널 목록, hasMore, query 인스턴스
 * @throws {Error} Sendbird 인스턴스가 초기화되지 않았을 때
 *
 * @example
 * ```typescript
 * // 첫 페이지 가져오기
 * const result = await getChannels({ limit: 10 })
 * console.log(result.channels) // 첫 10개 채널
 * console.log(result.hasMore) // 더 많은 채널이 있는지
 *
 * // 다음 페이지 가져오기
 * const nextResult = await getChannels({ query: result.query })
 * console.log(nextResult.channels) // 다음 10개 채널
 * ```
 */
export async function getChannels(options: GetChannelsOptions = {}): Promise<GetChannelsResult> {
  const { limit = 20, query: existingQuery } = options

  // Sendbird 인스턴스 가져오기
  const sendbird = getSendbirdInstance()

  if (!sendbird) {
    throw new Error('Sendbird instance not initialized')
  }

  try {
    let query: GroupChannelListQuery

    // 기존 query가 있으면 재사용, 없으면 새로 생성
    if (existingQuery) {
      query = existingQuery
    } else {
      // GroupChannelListQuery 파라미터 설정
      const params: GroupChannelListQueryParams = {
        limit,
        includeEmpty: true, // 빈 채널도 포함
        // order는 기본값 사용 (chronological)
      }

      // 쿼리 생성
      query = sendbird.groupChannel.createMyGroupChannelListQuery(params)
    }

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
      query, // query 인스턴스 반환 (다음 페이지를 위해)
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

/**
 * 채널 이름을 랜덤 문자열로 업데이트합니다.
 *
 * 채널 URL로 채널을 찾아서 새로운 랜덤 이름으로 업데이트합니다.
 * 8자리 소문자 영문 랜덤 문자열을 생성하여 사용합니다.
 *
 * @param {string} channelUrl - 업데이트할 채널의 URL
 * @returns {Promise<Channel>} 업데이트된 채널 정보
 * @throws {Error} Sendbird 인스턴스가 초기화되지 않았을 때
 * @throws {Error} 채널을 찾을 수 없을 때
 * @throws {Error} 채널 업데이트가 실패했을 때
 *
 * @example
 * ```typescript
 * const updatedChannel = await updateChannel('channel-url-123')
 * console.log(updatedChannel.name) // "fjkdlsap"
 * ```
 */
export async function updateChannel(channelUrl: string): Promise<Channel> {
  // Sendbird 인스턴스 가져오기
  const sendbird = getSendbirdInstance()

  if (!sendbird) {
    throw new Error('Sendbird instance not initialized')
  }

  // 새로운 랜덤 이름 생성
  const newRandomName = generateRandomName()

  try {
    // 채널 URL로 채널 가져오기
    const groupChannel: GroupChannel = await sendbird.groupChannel.getChannel(channelUrl)

    // 채널 이름 업데이트
    const updatedChannel: GroupChannel = await groupChannel.updateChannel({
      name: newRandomName,
    })

    // GroupChannel을 Channel 타입으로 변환
    return {
      url: updatedChannel.url,
      name: updatedChannel.name,
      createdAt: updatedChannel.createdAt,
      ...(updatedChannel.customType && { customType: updatedChannel.customType }),
      ...(updatedChannel.data && { data: updatedChannel.data }),
    }
  } catch (error) {
    // 에러를 상위로 전파
    throw error
  }
}
