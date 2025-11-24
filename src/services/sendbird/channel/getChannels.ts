/**
 * Sendbird 채널 목록 조회 서비스
 *
 * Sendbird SDK를 사용하여 채널 목록을 가져옵니다.
 * 페이지네이션을 지원하며, GroupChannel 객체를 Channel 타입으로 변환합니다.
 */

import { getSendbirdInstance } from '../client'
import { toAppError, logError } from '@/_lib/errorUtils'
import { AppError, ErrorType } from '@/_types/error.types'
import type { Channel } from '@/_types/channel.types'
import type {
  GroupChannel,
  GroupChannelListQuery,
  GroupChannelListQueryParams,
} from '@sendbird/chat/groupChannel'
import { GroupChannelListOrder } from '@sendbird/chat/groupChannel'

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
    throw new AppError(
      ErrorType.SENDBIRD_INIT_FAILED,
      '서비스 연결에 실패했습니다. 페이지를 새로고침해주세요.',
      'Sendbird instance not initialized'
    )
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
        order: GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL, // 알파벳순 정렬 (과제 요구사항)
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
    // AppError로 변환하여 일관된 에러 처리
    const appError = toAppError(error, ErrorType.CHANNEL_FETCH_FAILED)
    logError(appError, 'getChannels')
    throw appError
  }
}
