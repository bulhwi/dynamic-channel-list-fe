/**
 * useInfiniteScroll Hook
 *
 * Intersection Observer를 사용하여 무한 스크롤을 구현하는 커스텀 훅입니다.
 * sentinel 요소가 뷰포트에 보이면 onLoadMore 콜백을 호출합니다.
 */

import { useEffect, useRef } from 'react'

export interface UseInfiniteScrollOptions {
  /** 더 많은 데이터를 로드할 때 호출될 콜백 */
  onLoadMore: () => void
  /** 로딩 중 여부 */
  isLoading?: boolean
  /** 더 많은 데이터가 있는지 여부 */
  hasMore?: boolean
  /** Intersection Observer rootMargin (기본값: '100px') */
  rootMargin?: string
  /** Intersection Observer threshold (기본값: 1.0) */
  threshold?: number
}

export interface UseInfiniteScrollReturn {
  /** 스크롤 컨테이너에 연결할 ref */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** sentinel 요소에 연결할 ref */
  sentinelRef: React.RefObject<HTMLDivElement | null>
}

/**
 * 무한 스크롤을 구현하는 훅
 *
 * @param {UseInfiniteScrollOptions} options - 훅 옵션
 * @returns {UseInfiniteScrollReturn} containerRef와 sentinelRef
 *
 * @example
 * ```tsx
 * const { containerRef, sentinelRef } = useInfiniteScroll({
 *   onLoadMore: fetchNextPage,
 *   isLoading,
 *   hasMore: hasNextPage,
 * })
 *
 * return (
 *   <div ref={containerRef}>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={sentinelRef} />
 *   </div>
 * )
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  isLoading = false,
  hasMore = true,
  rootMargin = '100px',
  threshold = 1.0,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const container = containerRef.current

    // sentinel 또는 container가 없으면 early return
    if (!sentinel || !container) {
      return
    }

    // 로딩 중이거나 더 이상 데이터가 없으면 observer 생성하지 않음
    if (isLoading || !hasMore) {
      return
    }

    // Intersection Observer 생성
    const observer = new IntersectionObserver(
      entries => {
        // sentinel이 뷰포트에 보이면 onLoadMore 호출
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          onLoadMore()
        }
      },
      {
        root: container,
        rootMargin,
        threshold,
      }
    )

    // sentinel 관찰 시작
    observer.observe(sentinel)

    // cleanup: observer 해제
    return () => {
      observer.disconnect()
    }
  }, [onLoadMore, isLoading, hasMore, rootMargin, threshold])

  return {
    containerRef,
    sentinelRef,
  }
}
