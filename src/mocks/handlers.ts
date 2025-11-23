/**
 * MSW Request Handlers
 *
 * Mock API endpoints for development and testing
 */

import { http, HttpResponse } from 'msw'
import { generateRandomName, sortChannels } from '@/lib/utils'
import type { Channel } from '@/types/channel.types'

/**
 * Generate mock channels with random names
 */
const generateMockChannels = (count: number = 10): Channel[] => {
  return Array.from({ length: count }, (_, index) => ({
    url: `channel-${index + 1}`,
    name: generateRandomName(),
    createdAt: Date.now() - Math.random() * 10000000, // Random past timestamps
  }))
}

// Generate and sort initial mock channels
let mockChannels = sortChannels(generateMockChannels(10))

/**
 * MSW Request Handlers
 */
export const handlers = [
  // GET /api/channels - Fetch channel list
  http.get('/api/channels', () => {
    return HttpResponse.json({
      channels: mockChannels,
      hasMore: false,
    })
  }),

  // POST /api/channels - Create new channel (for Step 2)
  http.post('/api/channels', async ({ request }) => {
    const body = (await request.json()) as { name: string }
    const newChannel: Channel = {
      url: `channel-${Date.now()}`,
      name: body.name || generateRandomName(),
      createdAt: Date.now(),
    }

    mockChannels = sortChannels([...mockChannels, newChannel])

    return HttpResponse.json(newChannel, { status: 201 })
  }),

  // PATCH /api/channels/:id - Update channel (for Step 4)
  http.patch('/api/channels/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<Channel>

    const channelIndex = mockChannels.findIndex(c => c.url === id)
    if (channelIndex === -1) {
      return HttpResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    const updatedChannel = {
      ...mockChannels[channelIndex],
      ...body,
    } as Channel

    mockChannels[channelIndex] = updatedChannel
    mockChannels = sortChannels(mockChannels)

    return HttpResponse.json(updatedChannel)
  }),
]

/**
 * Reset mock channels (for testing)
 */
export const resetMockChannels = () => {
  mockChannels = sortChannels(generateMockChannels(10))
}
