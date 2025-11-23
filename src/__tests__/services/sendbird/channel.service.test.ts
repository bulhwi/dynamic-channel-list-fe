/**
 * Unit Tests for Sendbird Channel Service
 *
 * TDD 접근: 서비스 구현 전 테스트 작성
 */

import '@testing-library/jest-dom'
import { createChannel } from '@/services/sendbird/channel.service'
import { getSendbirdInstance } from '@/services/sendbird/client'
import { generateRandomName } from '@/lib/utils'

// Mock dependencies
jest.mock('@/services/sendbird/client')
jest.mock('@/lib/utils')

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
})
