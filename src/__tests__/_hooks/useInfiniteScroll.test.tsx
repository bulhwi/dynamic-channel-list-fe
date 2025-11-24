/**
 * Unit Tests for useInfiniteScroll Hook
 *
 * Intersection Observer를 사용한 무한 스크롤 훅 테스트
 */

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useInfiniteScroll } from '@/_hooks/useInfiniteScroll'

// 테스트용 컴포넌트
function TestComponent({
  onLoadMore,
  isLoading = false,
  hasMore = true,
  rootMargin = '100px',
  threshold = 1.0,
}: {
  onLoadMore: () => void
  isLoading?: boolean
  hasMore?: boolean
  rootMargin?: string
  threshold?: number
}) {
  const { containerRef, sentinelRef } = useInfiniteScroll({
    onLoadMore,
    isLoading,
    hasMore,
    rootMargin,
    threshold,
  })

  return (
    <div ref={containerRef} data-testid="container">
      <div data-testid="sentinel" ref={sentinelRef} />
    </div>
  )
}

describe('useInfiniteScroll', () => {
  let mockObserve: jest.Mock
  let mockDisconnect: jest.Mock
  let mockIntersectionObserver: jest.Mock
  let observerCallback: IntersectionObserverCallback

  beforeEach(() => {
    // IntersectionObserver 모킹
    mockObserve = jest.fn()
    mockDisconnect = jest.fn()

    mockIntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      observerCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      }
    })

    global.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // containerRef와 sentinelRef를 사용하여 DOM 요소를 렌더링해야 함
  it('should render container and sentinel elements', () => {
    const onLoadMore = jest.fn()
    const { getByTestId } = render(<TestComponent onLoadMore={onLoadMore} />)

    expect(getByTestId('container')).toBeInTheDocument()
    expect(getByTestId('sentinel')).toBeInTheDocument()
  })

  // sentinel이 교차할 때 onLoadMore를 호출해야 함
  it('should call onLoadMore when sentinel intersects', () => {
    const onLoadMore = jest.fn()
    const { getByTestId } = render(<TestComponent onLoadMore={onLoadMore} />)

    // Intersection Observer가 생성되고 sentinel이 관찰되는지 확인
    expect(mockIntersectionObserver).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalledWith(getByTestId('sentinel'))

    // 교차 이벤트 시뮬레이션
    observerCallback(
      [
        {
          isIntersecting: true,
          target: getByTestId('sentinel'),
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    )

    // onLoadMore가 호출되었는지 확인
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  // sentinel이 교차하지 않으면 onLoadMore를 호출하지 않아야 함
  it('should not call onLoadMore when sentinel does not intersect', () => {
    const onLoadMore = jest.fn()
    const { getByTestId } = render(<TestComponent onLoadMore={onLoadMore} />)

    // 교차하지 않는 이벤트 시뮬레이션
    observerCallback(
      [
        {
          isIntersecting: false,
          target: getByTestId('sentinel'),
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    )

    // onLoadMore가 호출되지 않았는지 확인
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  // isLoading이 true일 때 observer를 생성하지 않아야 함
  it('should not create observer when isLoading is true', () => {
    const onLoadMore = jest.fn()
    render(<TestComponent onLoadMore={onLoadMore} isLoading={true} hasMore={true} />)

    // Observer가 생성되지 않았는지 확인
    expect(mockObserve).not.toHaveBeenCalled()
  })

  // hasMore가 false일 때 observer를 생성하지 않아야 함
  it('should not create observer when hasMore is false', () => {
    const onLoadMore = jest.fn()
    render(<TestComponent onLoadMore={onLoadMore} isLoading={false} hasMore={false} />)

    // Observer가 생성되지 않았는지 확인
    expect(mockObserve).not.toHaveBeenCalled()
  })

  // 언마운트 시 observer를 disconnect해야 함
  it('should disconnect observer on unmount', () => {
    const onLoadMore = jest.fn()
    const { unmount } = render(<TestComponent onLoadMore={onLoadMore} />)

    // observer가 생성되었는지 확인
    expect(mockIntersectionObserver).toHaveBeenCalled()

    unmount()

    // disconnect가 호출되었는지 확인
    expect(mockDisconnect).toHaveBeenCalled()
  })

  // rootMargin과 threshold 옵션을 올바르게 전달해야 함
  it('should pass rootMargin and threshold options correctly', () => {
    const onLoadMore = jest.fn()
    const { getByTestId } = render(
      <TestComponent
        onLoadMore={onLoadMore}
        isLoading={false}
        hasMore={true}
        rootMargin="200px"
        threshold={0.5}
      />
    )

    // IntersectionObserver가 올바른 옵션으로 생성되었는지 확인
    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root: getByTestId('container'),
      rootMargin: '200px',
      threshold: 0.5,
    })
  })

  // 기본 rootMargin과 threshold 값을 사용해야 함
  it('should use default rootMargin and threshold values', () => {
    const onLoadMore = jest.fn()
    const { getByTestId } = render(<TestComponent onLoadMore={onLoadMore} />)

    // IntersectionObserver가 기본값으로 생성되었는지 확인
    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root: getByTestId('container'),
      rootMargin: '100px',
      threshold: 1.0,
    })
  })
})
