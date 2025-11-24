/**
 * 채널 API 서비스
 *
 * 채널 작업을 위한 Fetch API 함수들
 */

import type { Channel } from '@/_types/channel.types'

export interface ChannelsResponse {
  channels: Channel[]
  hasMore: boolean
}

/**
 * 모든 채널 가져오기
 */
export async function fetchChannels(): Promise<ChannelsResponse> {
  const response = await fetch('/api/channels')

  if (!response.ok) {
    throw new Error('Failed to fetch channels')
  }

  return response.json()
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
