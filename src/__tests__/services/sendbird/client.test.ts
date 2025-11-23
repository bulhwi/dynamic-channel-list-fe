/**
 * Unit Tests for Sendbird Client Service
 *
 * TDD approach: Write tests with SDK mocking first, then implement
 */

import '@testing-library/jest-dom'

// Mock Sendbird SDK before importing the service
jest.mock('@sendbird/chat', () => {
  const mockSendbirdInstance = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    currentUser: null,
  }

  return {
    SendbirdChat: {
      init: jest.fn(() => mockSendbirdInstance),
    },
  }
})

jest.mock('@sendbird/chat/groupChannel', () => ({
  GroupChannelModule: jest.fn(),
}))

import { SendbirdChat } from '@sendbird/chat'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'
import {
  initializeSendbird,
  connectUser,
  getSendbirdInstance,
  disconnectUser,
  _resetSendbirdInstance,
} from '@/services/sendbird/client'

describe('Sendbird Client Service', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment variables
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SENDBIRD_APP_ID = 'test-app-id'

    // Reset Sendbird instance (for clean tests)
    _resetSendbirdInstance()

    // Clear all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('initializeSendbird', () => {
    it('should initialize Sendbird with correct configuration', () => {
      const instance = initializeSendbird()

      expect(SendbirdChat.init).toHaveBeenCalledWith({
        appId: 'test-app-id',
        localCacheEnabled: false,
        modules: [expect.any(GroupChannelModule)],
      })

      expect(instance).toBeDefined()
    })

    it('should throw error when SENDBIRD_APP_ID is missing', () => {
      delete process.env.NEXT_PUBLIC_SENDBIRD_APP_ID

      expect(() => {
        initializeSendbird()
      }).toThrow('NEXT_PUBLIC_SENDBIRD_APP_ID environment variable is required')
    })

    it('should return same instance on multiple calls (singleton)', () => {
      const instance1 = initializeSendbird()
      const instance2 = initializeSendbird()

      expect(instance1).toBe(instance2)
      // init should only be called once
      expect(SendbirdChat.init).toHaveBeenCalledTimes(1)
    })
  })

  describe('connectUser', () => {
    it('should connect user successfully', async () => {
      const mockInstance = initializeSendbird()
      const mockUser = { userId: 'test-user', nickname: 'Test User' }
      ;(mockInstance.connect as jest.Mock).mockResolvedValue(mockUser)

      const user = await connectUser('test-user', 'access-token')

      expect(mockInstance.connect).toHaveBeenCalledWith('test-user', 'access-token')
      expect(user).toEqual(mockUser)
    })

    it('should throw error when userId is missing', async () => {
      initializeSendbird()

      await expect(connectUser('', 'access-token')).rejects.toThrow('userId is required')
    })

    it('should throw error when Sendbird is not initialized', async () => {
      // Don't call initializeSendbird() - instance should be null from beforeEach
      await expect(connectUser('test-user')).rejects.toThrow('Sendbird is not initialized')
    })

    it('should handle connection error', async () => {
      const mockInstance = initializeSendbird()
      const connectionError = new Error('Connection failed')
      ;(mockInstance.connect as jest.Mock).mockRejectedValue(connectionError)

      await expect(connectUser('test-user', 'token')).rejects.toThrow('Connection failed')
    })
  })

  describe('getSendbirdInstance', () => {
    it('should return initialized instance', () => {
      const instance = initializeSendbird()
      const retrieved = getSendbirdInstance()

      expect(retrieved).toBe(instance)
    })

    it('should return null when not initialized', () => {
      const retrieved = getSendbirdInstance()

      expect(retrieved).toBeNull()
    })
  })

  describe('disconnectUser', () => {
    it('should disconnect user successfully', async () => {
      const mockInstance = initializeSendbird()
      ;(mockInstance.disconnect as jest.Mock).mockResolvedValue(undefined)

      await disconnectUser()

      expect(mockInstance.disconnect).toHaveBeenCalled()
    })

    it('should throw error when Sendbird is not initialized', async () => {
      await expect(disconnectUser()).rejects.toThrow('Sendbird is not initialized')
    })
  })
})
