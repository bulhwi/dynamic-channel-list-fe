/**
 * Unit Tests for useUpdateChannel Hook
 *
 * TDD 접근: Hook 구현 전 테스트 작성
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { useUpdateChannel } from '@/_hooks/useUpdateChannel'
import { updateChannel } from '@/services/sendbird/channel/updateChannel'

// Mock channel service
jest.mock('@/services/sendbird/channel/updateChannel')

const mockUpdateChannel = updateChannel as jest.MockedFunction<typeof updateChannel>

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

describe('useUpdateChannel', () => {
  const mockChannelUrl = 'test-channel-url'
  const mockUpdatedChannel = {
    url: mockChannelUrl,
    name: 'newname',
    createdAt: Date.now(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // hook이 mutation 객체를 반환해야 함
  it('should return mutation object', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

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
    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBe(null)
  })

  // mutate 호출 시 채널 업데이트 서비스를 호출해야 함
  it('should call updateChannel service when mutate is called', async () => {
    mockUpdateChannel.mockResolvedValue(mockUpdatedChannel)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    result.current.mutate(mockChannelUrl)

    await waitFor(() => {
      expect(mockUpdateChannel).toHaveBeenCalledTimes(1)
      // React Query는 mutation 함수에 추가 컨텍스트를 전달함
      expect(mockUpdateChannel).toHaveBeenCalledWith(mockChannelUrl, expect.any(Object))
    })
  })

  // 성공 시 isSuccess가 true가 되어야 함
  it('should set isSuccess to true on successful update', async () => {
    mockUpdateChannel.mockResolvedValue(mockUpdatedChannel)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    result.current.mutate(mockChannelUrl)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  // 실패 시 isError가 true가 되어야 함
  it('should set isError to true on failure', async () => {
    const error = new Error('Channel update failed')
    mockUpdateChannel.mockRejectedValue(error)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    result.current.mutate(mockChannelUrl)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBe(error)
    })
  })

  // mutateAsync는 Promise를 반환해야 함
  it('should return Promise when mutateAsync is called', async () => {
    mockUpdateChannel.mockResolvedValue(mockUpdatedChannel)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    const promise = result.current.mutateAsync(mockChannelUrl)

    expect(promise).toBeInstanceOf(Promise)

    const channel = await promise
    expect(channel).toEqual(mockUpdatedChannel)
  })

  // 성공 시 channels 쿼리를 무효화해야 함
  it('should invalidate channels query on success', async () => {
    mockUpdateChannel.mockResolvedValue(mockUpdatedChannel)

    const testQueryClient = createTestQueryClient()
    const invalidateQueriesSpy = jest.spyOn(testQueryClient, 'invalidateQueries')

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    result.current.mutate(mockChannelUrl)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['channels'] })
  })

  // mutation 시작 시 channels 쿼리를 취소해야 함 (낙관적 업데이트)
  it('should cancel channels query on mutation start', async () => {
    mockUpdateChannel.mockResolvedValue(mockUpdatedChannel)

    const testQueryClient = createTestQueryClient()
    const cancelQueriesSpy = jest.spyOn(testQueryClient, 'cancelQueries')

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    result.current.mutate(mockChannelUrl)

    await waitFor(() => {
      expect(cancelQueriesSpy).toHaveBeenCalledWith({ queryKey: ['channels'] })
    })
  })

  // 에러 발생 시 이전 상태로 롤백해야 함
  it('should rollback to previous state on error', async () => {
    const error = new Error('Update failed')
    mockUpdateChannel.mockRejectedValue(error)

    const testQueryClient = createTestQueryClient()

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    result.current.mutate(mockChannelUrl)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // 에러 핸들링이 작동하는지 확인
    expect(result.current.error).toBe(error)
  })

  // 여러 채널을 순차적으로 업데이트할 수 있어야 함
  it('should handle multiple sequential updates', async () => {
    const channel1 = { ...mockUpdatedChannel, url: 'channel-1', name: 'name1' }
    const channel2 = { ...mockUpdatedChannel, url: 'channel-2', name: 'name2' }

    mockUpdateChannel.mockResolvedValueOnce(channel1)
    mockUpdateChannel.mockResolvedValueOnce(channel2)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useUpdateChannel(), { wrapper })

    result.current.mutate('channel-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    result.current.mutate('channel-2')

    await waitFor(() => {
      expect(mockUpdateChannel).toHaveBeenCalledTimes(2)
    })

    // React Query는 mutation 함수에 추가 컨텍스트를 전달함
    expect(mockUpdateChannel).toHaveBeenNthCalledWith(1, 'channel-1', expect.any(Object))
    expect(mockUpdateChannel).toHaveBeenNthCalledWith(2, 'channel-2', expect.any(Object))
  })
})
