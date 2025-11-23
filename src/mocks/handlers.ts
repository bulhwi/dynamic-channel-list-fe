/**
 * MSW 요청 핸들러
 *
 * 개발 및 테스트를 위한 Mock API 엔드포인트
 */

import { http, HttpResponse } from 'msw'
import { generateRandomName, sortChannels } from '@/lib/utils'
import type { Channel } from '@/types/channel.types'

/**
 * 랜덤 이름으로 모의 채널 생성
 */
const generateMockChannels = (count: number = 10): Channel[] => {
  return Array.from({ length: count }, (_, index) => ({
    url: `channel-${index + 1}`,
    name: generateRandomName(),
    createdAt: Date.now() - Math.random() * 10000000, // 과거 타임스탬프 랜덤 생성
  }))
}

// 초기 모의 채널 생성 및 정렬
let mockChannels = sortChannels(generateMockChannels(10))

/**
 * MSW 요청 핸들러
 */
export const handlers = [
  // GET /api/channels - 채널 리스트 가져오기
  http.get('/api/channels', () => {
    return HttpResponse.json({
      channels: mockChannels,
      hasMore: false,
    })
  }),

  // POST /api/channels - 새 채널 생성 (Step 2용)
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

  // PATCH /api/channels/:id - 채널 업데이트 (Step 4용)
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
 * 모의 채널 재설정 (테스트용)
 */
export const resetMockChannels = () => {
  mockChannels = sortChannels(generateMockChannels(10))
}
