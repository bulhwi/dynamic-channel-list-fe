/**
 * Channels API Service
 *
 * Fetch API functions for channel operations
 */

import type { Channel } from '@/types/channel.types'

export interface ChannelsResponse {
  channels: Channel[]
  hasMore: boolean
}

/**
 * Fetch all channels
 */
export async function fetchChannels(): Promise<ChannelsResponse> {
  const response = await fetch('/api/channels')

  if (!response.ok) {
    throw new Error('Failed to fetch channels')
  }

  return response.json()
}

/**
 * Create a new channel
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
 * Update a channel
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
