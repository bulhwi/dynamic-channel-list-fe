/**
 * useChannelList Hook
 *
 * React Query의 useInfiniteQuery를 사용한 무한 스크롤 채널 목록 훅
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { getChannels } from '@/services/sendbird/channel/getChannels'
import type { Channel } from '@/_types/channel.types'
import type { GroupChannelListQuery } from '@sendbird/chat/groupChannel'

export interface UseChannelListOptions {
  /** 한 페이지당 채널 수 (기본값: 10) */
  limit?: number
}

export interface UseChannelListReturn {
  /** 모든 페이지의 채널을 평탄화한 배열 */
  channels: Channel[]
  /** 로딩 중 여부 (초기 로딩) */
  isLoading: boolean
  /** 에러 발생 여부 */
  isError: boolean
  /** 에러 객체 */
  error: Error | null
  /** 다음 페이지가 있는지 여부 */
  hasNextPage: boolean
  /** 다음 페이지를 가져오는 중인지 여부 */
  isFetchingNextPage: boolean
  /** 다음 페이지를 가져오는 함수 */
  fetchNextPage: () => void
}

/**
 * 무한 스크롤을 지원하는 채널 목록 훅
 *
 * @param {UseChannelListOptions} options - 훅 옵션
 * @returns {UseChannelListReturn} 채널 목록과 페이지네이션 함수들
 *
 * @example
 * ```tsx
 * const {
 *   channels,
 *   isLoading,
 *   hasNextPage,
 *   isFetchingNextPage,
 *   fetchNextPage
 * } = useChannelList({ limit: 10 })
 *
 * // useInfiniteScroll과 함께 사용
 * const { containerRef, sentinelRef } = useInfiniteScroll({
 *   onLoadMore: fetchNextPage,
 *   isLoading: isFetchingNextPage,
 *   hasMore: hasNextPage,
 * })
 * ```
 */
export function useChannelList(options: UseChannelListOptions = {}): UseChannelListReturn {
  const { limit = 10 } = options

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: fetchNextPageFn,
  } = useInfiniteQuery({
    queryKey: ['channels', 'list', limit],
    queryFn: async ({ pageParam }: { pageParam?: GroupChannelListQuery }) => {
      // pageParam이 있으면 다음 페이지, 없으면 첫 페이지
      return getChannels({
        limit,
        query: pageParam,
      })
    },
    getNextPageParam: lastPage => {
      // hasMore가 true면 query 인스턴스 반환, false면 undefined
      return lastPage.hasMore ? lastPage.query : undefined
    },
    initialPageParam: undefined as GroupChannelListQuery | undefined,
  })

  // 모든 페이지의 채널을 평탄화
  const channels = data?.pages.flatMap(page => page.channels) ?? []

  const fetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPageFn()
    }
  }

  return {
    channels,
    isLoading,
    isError,
    error: error as Error | null,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  }
}
