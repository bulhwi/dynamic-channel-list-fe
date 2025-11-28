/**
 * Integration Tests for ChannelList Component
 *
 * 무한 스크롤 전체 플로우 통합 테스트
 * - 실제 useChannelList, useInfiniteScroll 훅 사용
 * - Intersection Observer 모킹
 * - Sendbird SDK 모킹
 */

import { render, screen, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import ChannelList from '@/app/_components/ChannelList/ChannelList'
import type { Channel } from '@/_types/channel.types'
import { getChannels } from '@/services/sendbird/channel/getChannels'
import { updateChannel } from '@/services/sendbird/channel/updateChannel'

// Mock Sendbird service
jest.mock('@/services/sendbird/channel/getChannels')
jest.mock('@/services/sendbird/channel/updateChannel')

const mockGetChannels = getChannels as jest.MockedFunction<typeof getChannels>
const mockUpdateChannel = updateChannel as jest.MockedFunction<typeof updateChannel>

// Mock Intersection Observer
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}

  observe(target: Element): void {
    // Store the target for later triggering
    ;(this as any).target = target
  }

  unobserve(): void {
    // No-op
  }

  disconnect(): void {
    // No-op
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  // Helper method to trigger intersection
  triggerIntersection(isIntersecting: boolean): void {
    const target = (this as any).target
    if (!target) return

    const entry: Partial<IntersectionObserverEntry> = {
      isIntersecting,
      target,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now(),
    }

    this.callback([entry as IntersectionObserverEntry], this)
  }
}

// Store observer instance for triggering
let observerInstance: MockIntersectionObserver | null = null

// Setup Intersection Observer mock
beforeAll(() => {
  global.IntersectionObserver = jest.fn((callback, options) => {
    observerInstance = new MockIntersectionObserver(callback, options)
    return observerInstance
  }) as any
})

// 테스트용 QueryClient 생성
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

// Mock 채널 데이터 생성 헬퍼
function createMockChannels(start: number, count: number): Channel[] {
  return Array.from({ length: count }, (_, i) => ({
    url: `channel-${start + i}`,
    name: `Channel ${start + i}`, // 고유한 번호 사용
    createdAt: 1000 + i,
  }))
}

// Mock query 객체 생성
function createMockQuery(hasNext: boolean) {
  return {
    hasNext,
  } as any
}

describe('ChannelList Integration Tests - Infinite Scroll', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    observerInstance = null
  })

  // Test 1: 초기 10개 채널 로드
  it('should load initial 10 channels', async () => {
    const mockChannels = createMockChannels(1, 10)
    const mockQuery = createMockQuery(true)

    mockGetChannels.mockResolvedValueOnce({
      channels: mockChannels,
      hasMore: true,
      query: mockQuery,
    })

    const testQueryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={testQueryClient}>
        <ChannelList />
      </QueryClientProvider>
    )

    // 초기 로딩 상태
    expect(screen.getByText(/loading channels/i)).toBeInTheDocument()

    // 채널 로드 완료 대기
    await waitFor(() => {
      expect(screen.queryByText(/loading channels/i)).not.toBeInTheDocument()
    })

    // 10개 채널 확인
    await waitFor(() => {
      mockChannels.forEach(channel => {
        expect(screen.getByText(channel.name)).toBeInTheDocument()
      })
    })

    // getChannels가 한 번만 호출되었는지 확인
    expect(mockGetChannels).toHaveBeenCalledTimes(1)
    expect(mockGetChannels).toHaveBeenCalledWith({
      limit: 10,
      query: undefined,
    })
  })

  // Test 2: 스크롤이 하단에 도달하면 다음 페이지를 로드해야 함
  it('should load next page when scrolling to bottom', async () => {
    const page1Channels = createMockChannels(1, 10)
    const page2Channels = createMockChannels(11, 10)
    const mockQuery1 = createMockQuery(true)
    const mockQuery2 = createMockQuery(false)

    mockGetChannels
      .mockResolvedValueOnce({
        channels: page1Channels,
        hasMore: true,
        query: mockQuery1,
      })
      .mockResolvedValueOnce({
        channels: page2Channels,
        hasMore: false,
        query: mockQuery2,
      })

    const testQueryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={testQueryClient}>
        <ChannelList />
      </QueryClientProvider>
    )

    // 첫 페이지 로드 대기
    await waitFor(() => {
      expect(screen.getByText(page1Channels[0].name)).toBeInTheDocument()
    })

    // 초기 10개 채널만 있는지 확인
    expect(screen.queryByText(page2Channels[0].name)).not.toBeInTheDocument()

    // Intersection Observer 트리거 (스크롤 시뮬레이션)
    await waitFor(() => {
      expect(observerInstance).not.toBeNull()
    })

    // Scroll to bottom - act로 래핑
    await act(async () => {
      observerInstance!.triggerIntersection(true)
      // 상태 업데이트를 위한 짧은 대기
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    // 두 번째 페이지 로드 대기
    await waitFor(
      () => {
        expect(screen.getByText(page2Channels[0].name)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // 총 20개 채널 확인
    await waitFor(() => {
      page1Channels.forEach(channel => {
        expect(screen.getByText(channel.name)).toBeInTheDocument()
      })
      page2Channels.forEach(channel => {
        expect(screen.getByText(channel.name)).toBeInTheDocument()
      })
    })

    // getChannels가 두 번 호출되었는지 확인
    expect(mockGetChannels).toHaveBeenCalledTimes(2)
    expect(mockGetChannels).toHaveBeenNthCalledWith(1, {
      limit: 10,
      query: undefined,
    })
    expect(mockGetChannels).toHaveBeenNthCalledWith(2, {
      limit: 10,
      query: mockQuery1,
    })
  })

  // Test 3: 중복 채널이 없어야 함
  it('should not render duplicate channels', async () => {
    const page1Channels = createMockChannels(1, 10)
    const page2Channels = createMockChannels(11, 10)
    const mockQuery1 = createMockQuery(true)
    const mockQuery2 = createMockQuery(false)

    mockGetChannels
      .mockResolvedValueOnce({
        channels: page1Channels,
        hasMore: true,
        query: mockQuery1,
      })
      .mockResolvedValueOnce({
        channels: page2Channels,
        hasMore: false,
        query: mockQuery2,
      })

    const testQueryClient = createTestQueryClient()

    const { container } = render(
      <QueryClientProvider client={testQueryClient}>
        <ChannelList />
      </QueryClientProvider>
    )

    // 첫 페이지 로드 대기
    await waitFor(() => {
      expect(screen.getByText(page1Channels[0].name)).toBeInTheDocument()
    })

    // Scroll to bottom - act로 래핑
    await waitFor(() => {
      expect(observerInstance).not.toBeNull()
    })

    await act(async () => {
      observerInstance!.triggerIntersection(true)
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    // 두 번째 페이지 로드 대기
    await waitFor(
      () => {
        expect(screen.getByText(page2Channels[0].name)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // 채널 아이템 개수 확인 (정확히 20개)
    await waitFor(() => {
      const channelItems = container.querySelectorAll('[data-channel-url]')
      expect(channelItems).toHaveLength(20)

      // 각 채널 URL이 고유한지 확인
      const channelUrls = Array.from(channelItems).map(
        item => item.getAttribute('data-channel-url') || ''
      )
      const uniqueUrls = new Set(channelUrls)
      expect(uniqueUrls.size).toBe(20) // 중복 없음
    })
  })

  // Test 4: 로딩 인디케이터 표시/숨김
  it('should show and hide loading indicator during pagination', async () => {
    const page1Channels = createMockChannels(1, 10)
    const page2Channels = createMockChannels(11, 10)
    const mockQuery1 = createMockQuery(true)
    const mockQuery2 = createMockQuery(false)

    // 두 번째 페이지 로딩을 지연시키기 위한 Promise
    let resolvePage2: (value: any) => void
    const page2Promise = new Promise(resolve => {
      resolvePage2 = resolve
    })

    mockGetChannels.mockResolvedValueOnce({
      channels: page1Channels,
      hasMore: true,
      query: mockQuery1,
    })

    mockGetChannels.mockReturnValueOnce(page2Promise as any)

    const testQueryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={testQueryClient}>
        <ChannelList />
      </QueryClientProvider>
    )

    // 첫 페이지 로드 대기
    await waitFor(() => {
      expect(screen.getByText(page1Channels[0].name)).toBeInTheDocument()
    })

    // 로딩 인디케이터가 없는지 확인
    expect(screen.queryByText(/loading more channels/i)).not.toBeInTheDocument()

    // Scroll to bottom
    await waitFor(() => {
      expect(observerInstance).not.toBeNull()
    })
    observerInstance!.triggerIntersection(true)

    // 로딩 인디케이터가 나타나는지 확인
    await waitFor(() => {
      expect(screen.getByText(/loading more channels/i)).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    // 두 번째 페이지 로드 완료
    resolvePage2!({
      channels: page2Channels,
      hasMore: false,
      query: mockQuery2,
    })

    // 로딩 인디케이터가 사라지는지 확인
    await waitFor(() => {
      expect(screen.queryByText(/loading more channels/i)).not.toBeInTheDocument()
    })

    // 두 번째 페이지 채널 확인
    await waitFor(() => {
      expect(screen.getByText(page2Channels[0].name)).toBeInTheDocument()
    })
  })

  // Test 5: 리스트 끝 처리 (더 이상 페이지 없음)
  it('should not create observer when hasNextPage is false', async () => {
    const page1Channels = createMockChannels(1, 10)
    const mockQuery1 = createMockQuery(false) // hasMore: false

    mockGetChannels.mockResolvedValueOnce({
      channels: page1Channels,
      hasMore: false,
      query: mockQuery1,
    })

    const testQueryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={testQueryClient}>
        <ChannelList />
      </QueryClientProvider>
    )

    // 첫 페이지 로드 대기
    await waitFor(() => {
      expect(screen.getByText(page1Channels[0].name)).toBeInTheDocument()
    })

    // sentinel 요소는 렌더링되지만 observer는 생성되지 않음 (hasMore: false)
    const sentinel = screen.getByTestId('sentinel')
    expect(sentinel).toBeInTheDocument()

    // 로딩 인디케이터가 나타나지 않는지 확인
    expect(screen.queryByText(/loading more channels/i)).not.toBeInTheDocument()

    // getChannels가 한 번만 호출되었는지 확인 (추가 호출 없음)
    expect(mockGetChannels).toHaveBeenCalledTimes(1)
  })

  // Test 6: 여러 번 스크롤 트리거
  it('should load multiple pages with multiple scroll triggers', async () => {
    const page1Channels = createMockChannels(1, 10)
    const page2Channels = createMockChannels(11, 10)
    const page3Channels = createMockChannels(21, 10)
    const mockQuery1 = createMockQuery(true)
    const mockQuery2 = createMockQuery(true)
    const mockQuery3 = createMockQuery(false)

    mockGetChannels
      .mockResolvedValueOnce({
        channels: page1Channels,
        hasMore: true,
        query: mockQuery1,
      })
      .mockResolvedValueOnce({
        channels: page2Channels,
        hasMore: true,
        query: mockQuery2,
      })
      .mockResolvedValueOnce({
        channels: page3Channels,
        hasMore: false,
        query: mockQuery3,
      })

    const testQueryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={testQueryClient}>
        <ChannelList />
      </QueryClientProvider>
    )

    // Page 1 로드
    await waitFor(() => {
      expect(screen.getByText(page1Channels[0].name)).toBeInTheDocument()
    })

    // Scroll #1 -> Page 2 로드
    await waitFor(() => {
      expect(observerInstance).not.toBeNull()
    })

    await act(async () => {
      observerInstance!.triggerIntersection(true)
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await waitFor(
      () => {
        expect(screen.getByText(page2Channels[0].name)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Scroll #2 -> Page 3 로드
    await act(async () => {
      observerInstance!.triggerIntersection(true)
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    await waitFor(
      () => {
        expect(screen.getByText(page3Channels[0].name)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // 총 30개 채널 확인
    await waitFor(() => {
      const allChannels = [...page1Channels, ...page2Channels, ...page3Channels]
      allChannels.forEach(channel => {
        expect(screen.getByText(channel.name)).toBeInTheDocument()
      })
    })

    // getChannels가 3번 호출되었는지 확인
    expect(mockGetChannels).toHaveBeenCalledTimes(3)
  })

  // Test 7: 에러 처리 - 초기 로드 에러
  it('should handle initial load error gracefully', async () => {
    mockGetChannels.mockRejectedValueOnce(new Error('Network error'))

    const testQueryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={testQueryClient}>
        <ChannelList />
      </QueryClientProvider>
    )

    // ErrorMessage 컴포넌트가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      // 사용자 친화적 메시지 확인 (toAppError에 의해 변환됨)
      expect(screen.getByText(/채널 목록을 불러오지 못했습니다/i)).toBeInTheDocument()
    })

    // 재시도 버튼 확인
    expect(screen.getByText(/다시 시도/i)).toBeInTheDocument()

    // getChannels가 호출되었는지 확인
    expect(mockGetChannels).toHaveBeenCalledTimes(1)
  })
})

describe('ChannelList Integration Tests - Channel Update Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    observerInstance = null
  })

  // Test: 채널 클릭 → 업데이트 → mutation 호출 확인
  it('should call updateChannel mutation when channel is clicked', async () => {
    const initialChannels: Channel[] = [
      { url: 'channel-apple', name: 'apple', createdAt: 1000 },
      { url: 'channel-banana', name: 'banana', createdAt: 2000 },
    ]

    mockGetChannels.mockResolvedValue({
      channels: initialChannels,
      hasMore: false,
      query: {} as any,
    })

    mockUpdateChannel.mockResolvedValue({
      url: 'channel-apple',
      name: 'apricot',
      createdAt: 1000,
    })

    const testQueryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={testQueryClient}>
        <ChannelList />
      </QueryClientProvider>
    )

    // 초기 채널 목록 확인
    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
      expect(screen.getByText('banana')).toBeInTheDocument()
    })

    // apple 채널 클릭
    act(() => {
      screen.getByText('apple').click()
    })

    // 로딩 인디케이터 확인
    await waitFor(() => {
      expect(screen.getByText('Updating...')).toBeInTheDocument()
    })

    // updateChannel이 호출되었는지 확인
    await waitFor(() => {
      expect(mockUpdateChannel).toHaveBeenCalledTimes(1)
      expect(mockUpdateChannel).toHaveBeenCalledWith('channel-apple', expect.any(Object))
    })

    // 로딩 인디케이터가 사라졌는지 확인
    await waitFor(() => {
      expect(screen.queryByText('Updating...')).not.toBeInTheDocument()
    })
  })
})
