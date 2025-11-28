/**
 * Unit Tests for Sendbird Channel Service
 *
 * TDD 접근: 서비스 구현 전 테스트 작성
 */

import '@testing-library/jest-dom'
import { createChannel } from '@/services/sendbird/channel/createChannel'
import { updateChannel } from '@/services/sendbird/channel/updateChannel'
import { getChannels } from '@/services/sendbird/channel/getChannels'
import { getSendbirdInstance } from '@/services/sendbird/client'
import { generateRandomName } from '@/_lib/utils'

// GroupChannelListOrder enum mock
const GroupChannelListOrder = {
  CHANNEL_NAME_ALPHABETICAL: 'channel_name_alphabetical',
}

// Mock dependencies
jest.mock('@/services/sendbird/client')
jest.mock('@/_lib/utils')
jest.mock('@/_lib/errorUtils', () => ({
  toAppError: jest.fn(error => error),
  logError: jest.fn(),
}))
jest.mock('@sendbird/chat/groupChannel', () => ({
  GroupChannelListOrder: {
    CHANNEL_NAME_ALPHABETICAL: 'channel_name_alphabetical',
  },
}))

const mockGetSendbirdInstance = getSendbirdInstance as jest.MockedFunction<
  typeof getSendbirdInstance
>
const mockGenerateRandomName = generateRandomName as jest.MockedFunction<typeof generateRandomName>

describe('Sendbird Channel Service', () => {
  const mockGroupChannel = {
    url: 'test-channel-url',
    name: 'testchan',
    createdAt: 1234567890000,
    customType: '',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createChannel', () => {
    // 랜덤 이름으로 채널을 성공적으로 생성해야 함
    it('should create channel with random name', async () => {
      const mockCreateChannel = jest.fn().mockResolvedValue(mockGroupChannel)
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createChannel: mockCreateChannel,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('testchan')

      const result = await createChannel()

      expect(mockGenerateRandomName).toHaveBeenCalledTimes(1)
      expect(mockCreateChannel).toHaveBeenCalledWith({
        name: 'testchan',
      })
      expect(result).toEqual({
        url: 'test-channel-url',
        name: 'testchan',
        createdAt: 1234567890000,
      })
    })

    // Sendbird 인스턴스가 없을 때 에러를 던져야 함
    it('should throw error when Sendbird instance is not available', async () => {
      mockGetSendbirdInstance.mockReturnValue(null)

      await expect(createChannel()).rejects.toThrow('Sendbird instance not initialized')
    })

    // 채널 생성이 실패할 때 에러를 던져야 함
    it('should throw error when channel creation fails', async () => {
      const mockCreateChannel = jest.fn().mockRejectedValue(new Error('Channel creation failed'))
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createChannel: mockCreateChannel,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('testchan')

      await expect(createChannel()).rejects.toThrow('Channel creation failed')
    })

    // customType이 있는 채널을 처리해야 함
    it('should handle channels with customType', async () => {
      const mockChannelWithCustomType = {
        ...mockGroupChannel,
        customType: 'premium',
      }
      const mockCreateChannel = jest.fn().mockResolvedValue(mockChannelWithCustomType)
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createChannel: mockCreateChannel,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('testchan')

      const result = await createChannel()

      expect(result.customType).toBe('premium')
    })

    // 타임스탬프를 올바르게 변환해야 함
    it('should convert timestamp correctly', async () => {
      const mockCreateChannel = jest.fn().mockResolvedValue(mockGroupChannel)
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createChannel: mockCreateChannel,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('testchan')

      const result = await createChannel()

      expect(result.createdAt).toBe(1234567890000)
      expect(typeof result.createdAt).toBe('number')
    })

    // 매번 다른 랜덤 이름을 생성해야 함
    it('should generate different random names on multiple calls', async () => {
      const mockCreateChannel = jest.fn().mockResolvedValue(mockGroupChannel)
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createChannel: mockCreateChannel,
        },
      } as any)

      mockGenerateRandomName.mockReturnValueOnce('abcdefgh')
      await createChannel()

      mockGenerateRandomName.mockReturnValueOnce('ijklmnop')
      await createChannel()

      expect(mockCreateChannel).toHaveBeenNthCalledWith(1, { name: 'abcdefgh' })
      expect(mockCreateChannel).toHaveBeenNthCalledWith(2, { name: 'ijklmnop' })
    })
  })

  describe('updateChannel', () => {
    const mockChannelUrl = 'test-channel-url'
    const mockUpdatedChannel = {
      url: 'test-channel-url',
      name: 'newname',
      createdAt: 1234567890000,
      customType: '',
      data: '',
    }

    // 채널 이름을 성공적으로 업데이트해야 함
    it('should update channel with new random name', async () => {
      const mockUpdateChannel = jest.fn().mockResolvedValue(mockUpdatedChannel)
      const mockNext = jest.fn().mockResolvedValue([
        {
          url: 'test-channel-url',
          name: 'oldname',
          createdAt: 1234567890000,
          updateChannel: mockUpdateChannel,
        },
      ])
      const mockCreateQuery = jest.fn().mockReturnValue({
        next: mockNext,
      })
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('newname')

      const result = await updateChannel(mockChannelUrl)

      expect(mockGenerateRandomName).toHaveBeenCalledTimes(1)
      expect(mockCreateQuery).toHaveBeenCalledWith({
        limit: 1,
        includeEmpty: true,
        channelUrlsFilter: [mockChannelUrl],
      })
      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(mockUpdateChannel).toHaveBeenCalledWith({
        name: 'newname',
      })
      expect(result).toEqual({
        url: 'test-channel-url',
        name: 'newname',
        createdAt: 1234567890000,
      })
    })

    // Sendbird 인스턴스가 없을 때 에러를 던져야 함
    it('should throw error when Sendbird instance is not available', async () => {
      mockGetSendbirdInstance.mockReturnValue(null)

      await expect(updateChannel(mockChannelUrl)).rejects.toThrow(
        'Sendbird instance not initialized'
      )
    })

    // 채널을 찾을 수 없을 때 에러를 던져야 함
    it('should throw error when channel is not found', async () => {
      const mockNext = jest.fn().mockResolvedValue([]) // 빈 배열 반환 (채널 없음)
      const mockCreateQuery = jest.fn().mockReturnValue({
        next: mockNext,
      })
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('newname')

      await expect(updateChannel(mockChannelUrl)).rejects.toThrow('Channel not found')
    })

    // 채널 업데이트가 실패할 때 에러를 던져야 함
    it('should throw error when channel update fails', async () => {
      const mockUpdateChannel = jest.fn().mockRejectedValue(new Error('Update failed'))
      const mockNext = jest.fn().mockResolvedValue([
        {
          url: 'test-channel-url',
          name: 'oldname',
          createdAt: 1234567890000,
          updateChannel: mockUpdateChannel,
        },
      ])
      const mockCreateQuery = jest.fn().mockReturnValue({
        next: mockNext,
      })
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('newname')

      await expect(updateChannel(mockChannelUrl)).rejects.toThrow('Update failed')
    })

    // customType과 data가 있는 채널을 처리해야 함
    it('should handle channels with customType and data', async () => {
      const mockChannelWithData = {
        ...mockUpdatedChannel,
        customType: 'premium',
        data: '{"description":"test"}',
      }
      const mockUpdateChannel = jest.fn().mockResolvedValue(mockChannelWithData)
      const mockNext = jest.fn().mockResolvedValue([
        {
          url: 'test-channel-url',
          name: 'oldname',
          createdAt: 1234567890000,
          updateChannel: mockUpdateChannel,
        },
      ])
      const mockCreateQuery = jest.fn().mockReturnValue({
        next: mockNext,
      })
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('newname')

      const result = await updateChannel(mockChannelUrl)

      expect(result.customType).toBe('premium')
      expect(result.data).toBe('{"description":"test"}')
    })

    // 매번 다른 랜덤 이름으로 업데이트해야 함
    it('should generate different random names on multiple calls', async () => {
      const mockUpdateChannel = jest.fn().mockResolvedValue(mockUpdatedChannel)
      const mockNext = jest.fn().mockResolvedValue([
        {
          url: 'test-channel-url',
          name: 'oldname',
          createdAt: 1234567890000,
          updateChannel: mockUpdateChannel,
        },
      ])
      const mockCreateQuery = jest.fn().mockReturnValue({
        next: mockNext,
      })
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)

      mockGenerateRandomName.mockReturnValueOnce('firstnam')
      await updateChannel(mockChannelUrl)

      mockGenerateRandomName.mockReturnValueOnce('secondna')
      await updateChannel(mockChannelUrl)

      expect(mockUpdateChannel).toHaveBeenNthCalledWith(1, { name: 'firstnam' })
      expect(mockUpdateChannel).toHaveBeenNthCalledWith(2, { name: 'secondna' })
    })

    // 채널 URL이 올바르게 전달되어야 함
    it('should pass correct channel URL', async () => {
      const mockUpdateChannel = jest.fn().mockResolvedValue(mockUpdatedChannel)
      const mockNext = jest.fn().mockResolvedValue([
        {
          url: 'custom-channel-url',
          name: 'oldname',
          createdAt: 1234567890000,
          updateChannel: mockUpdateChannel,
        },
      ])
      const mockCreateQuery = jest.fn().mockReturnValue({
        next: mockNext,
      })
      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)
      mockGenerateRandomName.mockReturnValue('newname')

      await updateChannel('custom-channel-url')

      expect(mockCreateQuery).toHaveBeenCalledWith({
        limit: 1,
        includeEmpty: true,
        channelUrlsFilter: ['custom-channel-url'],
      })
    })
  })

  describe('getChannels', () => {
    const mockGroupChannels = [
      { url: 'channel-1', name: 'apple', createdAt: 1000, customType: '', data: '' },
      { url: 'channel-2', name: 'banana', createdAt: 2000, customType: '', data: '' },
      {
        url: 'channel-3',
        name: 'cherry',
        createdAt: 3000,
        customType: 'premium',
        data: '{"test":true}',
      },
    ]

    // 첫 페이지 채널 목록을 가져와야 함
    it('should fetch first page of channels', async () => {
      const mockNext = jest.fn().mockResolvedValue(mockGroupChannels)
      const mockQuery = { next: mockNext, hasNext: true }
      const mockCreateQuery = jest.fn().mockReturnValue(mockQuery)

      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)

      const result = await getChannels({ limit: 20 })

      expect(mockCreateQuery).toHaveBeenCalledWith({
        limit: 20,
        includeEmpty: true,
        order: GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL,
      })
      expect(result.channels).toHaveLength(3)
      expect(result.hasMore).toBe(true)
      expect(result.query).toBe(mockQuery)
    })

    // 기본 limit이 10이어야 함
    it('should use default limit of 10', async () => {
      const mockNext = jest.fn().mockResolvedValue([])
      const mockQuery = { next: mockNext, hasNext: false }
      const mockCreateQuery = jest.fn().mockReturnValue(mockQuery)

      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)

      await getChannels()

      expect(mockCreateQuery).toHaveBeenCalledWith(expect.objectContaining({ limit: 10 }))
    })

    // 기존 query로 다음 페이지를 가져와야 함
    it('should fetch next page with existing query', async () => {
      const mockNext = jest.fn().mockResolvedValue(mockGroupChannels)
      const existingQuery = { next: mockNext, hasNext: false }

      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: jest.fn(),
        },
      } as any)

      const result = await getChannels({ query: existingQuery as any })

      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(result.hasMore).toBe(false)
    })

    // GroupChannel을 Channel 타입으로 변환해야 함
    it('should convert GroupChannel to Channel type', async () => {
      const mockNext = jest.fn().mockResolvedValue(mockGroupChannels)
      const mockQuery = { next: mockNext, hasNext: false }
      const mockCreateQuery = jest.fn().mockReturnValue(mockQuery)

      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)

      const result = await getChannels()

      expect(result.channels[0]).toEqual({
        url: 'channel-1',
        name: 'apple',
        createdAt: 1000,
      })
      expect(result.channels[2]).toEqual({
        url: 'channel-3',
        name: 'cherry',
        createdAt: 3000,
        customType: 'premium',
        data: '{"test":true}',
      })
    })

    // Sendbird 인스턴스가 없을 때 에러를 던져야 함
    it('should throw error when Sendbird instance is not available', async () => {
      mockGetSendbirdInstance.mockReturnValue(null)

      await expect(getChannels()).rejects.toThrow()
    })

    // 채널 조회 실패 시 에러를 던져야 함
    it('should throw error when channel fetch fails', async () => {
      const mockNext = jest.fn().mockRejectedValue(new Error('Fetch failed'))
      const mockQuery = { next: mockNext, hasNext: false }
      const mockCreateQuery = jest.fn().mockReturnValue(mockQuery)

      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)

      await expect(getChannels()).rejects.toThrow('Fetch failed')
    })

    // 빈 채널 목록도 처리해야 함
    it('should handle empty channel list', async () => {
      const mockNext = jest.fn().mockResolvedValue([])
      const mockQuery = { next: mockNext, hasNext: false }
      const mockCreateQuery = jest.fn().mockReturnValue(mockQuery)

      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)

      const result = await getChannels()

      expect(result.channels).toHaveLength(0)
      expect(result.hasMore).toBe(false)
    })

    // 알파벳순 정렬 옵션이 적용되어야 함
    it('should use alphabetical order', async () => {
      const mockNext = jest.fn().mockResolvedValue([])
      const mockQuery = { next: mockNext, hasNext: false }
      const mockCreateQuery = jest.fn().mockReturnValue(mockQuery)

      mockGetSendbirdInstance.mockReturnValue({
        groupChannel: {
          createMyGroupChannelListQuery: mockCreateQuery,
        },
      } as any)

      await getChannels()

      expect(mockCreateQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          order: GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL,
        })
      )
    })
  })
})
