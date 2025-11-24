/**
 * Sendbird 채널 업데이트 서비스
 *
 * 채널 이름을 랜덤 문자열로 업데이트합니다.
 */

import { getSendbirdInstance } from '../client'
import { generateRandomName } from '@/_lib/utils'
import { toAppError, logError } from '@/_lib/errorUtils'
import { AppError, ErrorType } from '@/_types/error.types'
import type { Channel } from '@/_types/channel.types'
import type { GroupChannel } from '@sendbird/chat/groupChannel'

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
    throw new AppError(
      ErrorType.SENDBIRD_INIT_FAILED,
      '서비스 연결에 실패했습니다. 페이지를 새로고침해주세요.',
      'Sendbird instance not initialized'
    )
  }

  // 새로운 랜덤 이름 생성
  const newRandomName = generateRandomName()

  try {
    // getChannel() 대신 channelUrlsFilter를 사용한 쿼리로 채널 조회
    // (과제 요구사항: getChannel()은 허용되지 않은 함수)
    const query = sendbird.groupChannel.createMyGroupChannelListQuery({
      limit: 1, // 하나의 채널만 조회
      includeEmpty: true,
      channelUrlsFilter: [channelUrl], // 특정 채널만 필터링
    })

    const channels: GroupChannel[] = await query.next()
    const groupChannel = channels[0]

    if (!groupChannel) {
      throw new AppError(
        ErrorType.CHANNEL_NOT_FOUND,
        '채널을 찾을 수 없습니다.',
        `Channel not found: ${channelUrl}`
      )
    }

    // 채널 이름 업데이트 (허용된 함수: channel.updateChannel)
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
    // 이미 AppError인 경우 그대로 throw (channel not found 등)
    if (error instanceof AppError) {
      logError(error, 'updateChannel')
      throw error
    }

    // 기타 에러는 AppError로 변환
    const appError = toAppError(error, ErrorType.CHANNEL_UPDATE_FAILED)
    logError(appError, 'updateChannel')
    throw appError
  }
}
