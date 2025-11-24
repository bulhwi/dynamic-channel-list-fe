/**
 * 채널 API 서비스
 *
 * Sendbird SDK를 사용한 채널 작업을 위한 API 함수들
 */

import type { Channel } from '@/_types/channel.types'
import { getChannels as getChannelsFromSDK } from '@/services/sendbird/channel.service'

export interface ChannelsResponse {
  channels: Channel[]
  hasMore: boolean
}

/**
 * Sendbird SDK를 사용하여 채널 목록을 가져옵니다.
 *
 * @returns {Promise<ChannelsResponse>} 채널 목록과 hasMore 플래그
 * @throws {Error} Sendbird SDK에서 에러 발생 시
 */
export async function fetchChannels(): Promise<ChannelsResponse> {
  try {
    // Sendbird SDK에서 채널 가져오기
    const result = await getChannelsFromSDK({ limit: 20 })

    return {
      channels: result.channels,
      hasMore: result.hasMore,
    }
  } catch (error) {
    // 에러 메시지 개선
    const message = error instanceof Error ? error.message : 'Failed to fetch channels'
    throw new Error(message)
  }
}

/**
 * 새 채널 생성
 */
export async function createChannel(name: string): Promise<Channel> {
  const response = await fetch('/api/channels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    throw new Error('Failed to create channel')
  }

  return response.json()
}

/**
 * 채널 업데이트
 */
export async function updateChannel(id: string, data: Partial<Channel>): Promise<Channel> {
  const response = await fetch(`/api/channels/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update channel')
  }

  return response.json()
}
