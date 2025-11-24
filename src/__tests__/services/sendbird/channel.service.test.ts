/**
 * Unit Tests for Sendbird Channel Service
 *
 * TDD 접근: 서비스 구현 전 테스트 작성
 */

import '@testing-library/jest-dom'
import { createChannel, updateChannel } from '@/services/sendbird/channel.service'
import { getSendbirdInstance } from '@/services/sendbird/client'
import { generateRandomName } from '@/_lib/utils'

// Mock dependencies
jest.mock('@/services/sendbird/client')
jest.mock('@/_lib/utils')

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
})
