/**
 * Unit Tests for useCreateChannel Hook
 *
 * TDD 접근: Hook 구현 전 테스트 작성
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { useCreateChannel } from '@/_hooks/useCreateChannel'
import { createChannel } from '@/services/sendbird/channel/createChannel'

// Mock channel service
jest.mock('@/services/sendbird/channel/createChannel')

const mockCreateChannel = createChannel as jest.MockedFunction<typeof createChannel>

// 테스트용 QueryClient 생성 헬퍼
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

// 테스트용 래퍼 컴포넌트
function createWrapper() {
  const testQueryClient = createTestQueryClient()
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  }
}

describe('useCreateChannel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // hook이 mutation 객체를 반환해야 함
  it('should return mutation object', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateChannel(), { wrapper })

    expect(result.current).toHaveProperty('mutate')
    expect(result.current).toHaveProperty('mutateAsync')
    expect(result.current).toHaveProperty('isPending')
    expect(result.current).toHaveProperty('isError')
    expect(result.current).toHaveProperty('isSuccess')
    expect(result.current).toHaveProperty('error')
  })

  // 초기 상태가 idle이어야 함
  it('should have idle state initially', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateChannel(), { wrapper })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBe(null)
  })

  // mutate 호출 시 채널 생성 서비스를 호출해야 함
  it('should call createChannel service when mutate is called', async () => {
    const mockChannel = {
      url: 'new-channel',
      name: 'testchan',
      createdAt: Date.now(),
    }
    mockCreateChannel.mockResolvedValue(mockChannel)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateChannel(), { wrapper })

    result.current.mutate()

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalledTimes(1)
    })
  })

  // 성공 시 isSuccess가 true가 되어야 함
  it('should set isSuccess to true on successful creation', async () => {
    const mockChannel = {
      url: 'new-channel',
      name: 'testchan',
      createdAt: Date.now(),
    }
    mockCreateChannel.mockResolvedValue(mockChannel)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateChannel(), { wrapper })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  // 실패 시 isError가 true가 되어야 함
  it('should set isError to true on failure', async () => {
    const error = new Error('Channel creation failed')
    mockCreateChannel.mockRejectedValue(error)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateChannel(), { wrapper })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBe(error)
    })
  })

  // mutateAsync는 Promise를 반환해야 함
  it('should return Promise when mutateAsync is called', async () => {
    const mockChannel = {
      url: 'new-channel',
      name: 'testchan',
      createdAt: Date.now(),
    }
    mockCreateChannel.mockResolvedValue(mockChannel)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useCreateChannel(), { wrapper })

    const promise = result.current.mutateAsync()

    expect(promise).toBeInstanceOf(Promise)

    const channel = await promise
    expect(channel).toEqual(mockChannel)
  })

  // 성공 시 channels 쿼리를 무효화해야 함
  it('should invalidate channels query on success', async () => {
    const mockChannel = {
      url: 'new-channel',
      name: 'testchan',
      createdAt: Date.now(),
    }
    mockCreateChannel.mockResolvedValue(mockChannel)

    const testQueryClient = createTestQueryClient()
    const invalidateQueriesSpy = jest.spyOn(testQueryClient, 'invalidateQueries')

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useCreateChannel(), { wrapper })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['channels', 'list'],
      refetchType: 'active',
    })
  })
})
