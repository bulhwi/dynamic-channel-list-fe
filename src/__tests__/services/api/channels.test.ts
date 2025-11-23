/**
 * Unit Tests for Channels API Service
 *
 * 내부 API 호출 로직을 테스트합니다.
 */

import '@testing-library/jest-dom'
import { fetchChannels, createChannel, updateChannel } from '@/services/api/channels'
import type { Channel } from '@/types/channel.types'

// Fetch API mock
global.fetch = jest.fn()

describe('Channels API Service', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchChannels', () => {
    // 채널 목록을 성공적으로 가져와야 함
    it('should fetch channels successfully', async () => {
      const mockResponse = {
        channels: [
          {
            url: 'test-channel-1',
            name: 'Test Channel 1',
            createdAt: 1234567890,
            customType: 'group',
          },
          {
            url: 'test-channel-2',
            name: 'Test Channel 2',
            createdAt: 1234567891,
          },
        ],
        hasMore: false,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchChannels()

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith('/api/channels')
    })

    // API 요청이 실패할 때 에러를 던져야 함
    it('should throw error when API request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(fetchChannels()).rejects.toThrow('Failed to fetch channels')
    })

    // 빈 채널 목록을 처리해야 함
    it('should handle empty channel list', async () => {
      const mockResponse = {
        channels: [],
        hasMore: false,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchChannels()

      expect(result).toEqual(mockResponse)
    })
  })

  describe('createChannel', () => {
    // 새 채널을 성공적으로 생성해야 함
    it('should create channel successfully', async () => {
      const mockChannel: Channel = {
        url: 'new-channel',
        name: 'New Channel',
        createdAt: Date.now(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockChannel,
      } as Response)

      const result = await createChannel('New Channel')

      expect(result).toEqual(mockChannel)
      expect(mockFetch).toHaveBeenCalledWith('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'New Channel' }),
      })
    })

    // 채널 생성 실패 시 에러를 던져야 함
    it('should throw error when create fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response)

      await expect(createChannel('Test')).rejects.toThrow('Failed to create channel')
    })
  })

  describe('updateChannel', () => {
    // 채널을 성공적으로 업데이트해야 함
    it('should update channel successfully', async () => {
      const mockChannel: Channel = {
        url: 'test-channel',
        name: 'Updated Channel',
        createdAt: Date.now(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockChannel,
      } as Response)

      const result = await updateChannel('test-channel', { name: 'Updated Channel' })

      expect(result).toEqual(mockChannel)
      expect(mockFetch).toHaveBeenCalledWith('/api/channels/test-channel', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Updated Channel' }),
      })
    })

    // 채널 업데이트 실패 시 에러를 던져야 함
    it('should throw error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(updateChannel('test', { name: 'Test' })).rejects.toThrow(
        'Failed to update channel'
      )
    })

    // 부분 업데이트를 처리해야 함
    it('should handle partial updates', async () => {
      const mockChannel: Channel = {
        url: 'test-channel',
        name: 'Test',
        createdAt: Date.now(),
        customType: 'premium',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockChannel,
      } as Response)

      const result = await updateChannel('test-channel', { customType: 'premium' })

      expect(result).toEqual(mockChannel)
      expect(mockFetch).toHaveBeenCalledWith('/api/channels/test-channel', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customType: 'premium' }),
      })
    })
  })
})
