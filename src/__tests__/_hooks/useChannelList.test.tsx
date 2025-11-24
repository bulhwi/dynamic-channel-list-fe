/**
 * Unit Tests for useChannelList Hook
 *
 * React Query useInfiniteQuery를 사용한 무한 스크롤 채널 목록 훅 테스트
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { useChannelList } from '@/_hooks/useChannelList'
import { getChannels } from '@/services/sendbird/channel/getChannels'
import type { Channel } from '@/_types/channel.types'

// Mock channel service
jest.mock('@/services/sendbird/channel/getChannels')

const mockGetChannels = getChannels as jest.MockedFunction<typeof getChannels>

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

// Mock 채널 데이터 생성 헬퍼
function createMockChannels(start: number, count: number): Channel[] {
  return Array.from({ length: count }, (_, i) => ({
    url: `channel-${start + i}`,
    name: `Channel ${start + i}`,
    createdAt: Date.now() + i,
  }))
}

// Mock query 객체 생성
function createMockQuery(hasNext: boolean) {
  return {
    hasNext,
    // 다른 필드들은 테스트에서 사용하지 않으므로 생략
  } as any
}

describe('useChannelList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // 초기 채널 목록을 성공적으로 로드해야 함
  it('should load initial channels successfully', async () => {
    const mockChannels = createMockChannels(1, 10)
    const mockQuery = createMockQuery(true)

    mockGetChannels.mockResolvedValueOnce({
      channels: mockChannels,
      hasMore: true,
      query: mockQuery,
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useChannelList({ limit: 10 }), { wrapper })

    // 초기 로딩 상태 확인
    expect(result.current.isLoading).toBe(true)
    expect(result.current.channels).toEqual([])

    // 데이터 로드 대기
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // 채널 목록 확인
    expect(result.current.channels).toEqual(mockChannels)
    expect(result.current.hasNextPage).toBe(true)
    expect(mockGetChannels).toHaveBeenCalledWith({
      limit: 10,
      query: undefined,
    })
  })

  // 다음 페이지를 성공적으로 로드해야 함
  it('should load next page successfully', async () => {
    const mockChannelsPage1 = createMockChannels(1, 10)
    const mockChannelsPage2 = createMockChannels(11, 10)
    const mockQuery1 = createMockQuery(true)
    const mockQuery2 = createMockQuery(false)

    mockGetChannels
      .mockResolvedValueOnce({
        channels: mockChannelsPage1,
        hasMore: true,
        query: mockQuery1,
      })
      .mockResolvedValueOnce({
        channels: mockChannelsPage2,
        hasMore: false,
        query: mockQuery2,
      })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useChannelList({ limit: 10 }), { wrapper })

    // 첫 페이지 로드 대기
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.channels).toHaveLength(10)
    expect(result.current.hasNextPage).toBe(true)

    // 다음 페이지 로드
    result.current.fetchNextPage()

    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false)
    })

    // 두 페이지의 채널이 모두 포함되어야 함
    expect(result.current.channels).toHaveLength(20)
    expect(result.current.channels).toEqual([...mockChannelsPage1, ...mockChannelsPage2])
    expect(result.current.hasNextPage).toBe(false)

    // query 인스턴스가 전달되었는지 확인
    expect(mockGetChannels).toHaveBeenNthCalledWith(2, {
      limit: 10,
      query: mockQuery1,
    })
  })

  // 에러를 올바르게 처리해야 함
  it('should handle errors correctly', async () => {
    const error = new Error('Failed to fetch channels')
    mockGetChannels.mockRejectedValueOnce(error)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useChannelList({ limit: 10 }), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toEqual(error)
    expect(result.current.channels).toEqual([])
  })

  // hasMore가 false일 때 hasNextPage가 false여야 함
  it('should set hasNextPage to false when no more data', async () => {
    const mockChannels = createMockChannels(1, 5)
    const mockQuery = createMockQuery(false)

    mockGetChannels.mockResolvedValueOnce({
      channels: mockChannels,
      hasMore: false,
      query: mockQuery,
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useChannelList({ limit: 10 }), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.channels).toHaveLength(5)
    expect(result.current.hasNextPage).toBe(false)
  })

  // 빈 결과를 올바르게 처리해야 함
  it('should handle empty results correctly', async () => {
    const mockQuery = createMockQuery(false)

    mockGetChannels.mockResolvedValueOnce({
      channels: [],
      hasMore: false,
      query: mockQuery,
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useChannelList({ limit: 10 }), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.channels).toEqual([])
    expect(result.current.hasNextPage).toBe(false)
  })

  // fetchNextPage는 hasNextPage가 false일 때 호출되지 않아야 함
  it('should not fetch next page when hasNextPage is false', async () => {
    const mockChannels = createMockChannels(1, 10)
    const mockQuery = createMockQuery(false)

    mockGetChannels.mockResolvedValueOnce({
      channels: mockChannels,
      hasMore: false,
      query: mockQuery,
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useChannelList({ limit: 10 }), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // fetchNextPage 호출
    result.current.fetchNextPage()

    // 추가 호출이 없어야 함
    expect(mockGetChannels).toHaveBeenCalledTimes(1)
  })

  // 커스텀 limit을 사용해야 함
  it('should use custom limit', async () => {
    const mockChannels = createMockChannels(1, 5)
    const mockQuery = createMockQuery(false)

    mockGetChannels.mockResolvedValueOnce({
      channels: mockChannels,
      hasMore: false,
      query: mockQuery,
    })

    const wrapper = createWrapper()
    renderHook(() => useChannelList({ limit: 5 }), { wrapper })

    await waitFor(() => {
      expect(mockGetChannels).toHaveBeenCalledWith({
        limit: 5,
        query: undefined,
      })
    })
  })
})
