/**
 * ChannelList 컴포넌트
 *
 * 무한 스크롤이 적용된 채널 리스트를 표시합니다
 * React Query useInfiniteQuery + Intersection Observer 사용
 */

'use client'

import { useChannelList } from '@/_hooks/useChannelList'
import { useInfiniteScroll } from '@/_hooks/useInfiniteScroll'
import ChannelItem from '@/app/_components/ChannelItem/ChannelItem'
import LoadingSpinner from '@/app/_components/LoadingSpinner/LoadingSpinner'
import { sortChannels } from '@/_lib/utils'
import styles from './ChannelList.module.css'

const ChannelList = () => {
  const { channels, isLoading, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannelList({ limit: 10 })

  const { containerRef, sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    isLoading: isFetchingNextPage,
    hasMore: hasNextPage,
  })

  if (isLoading) {
    return <div className={styles.loading}>Loading channels...</div>
  }

  if (error) {
    return <div className={styles.error}>Error loading channels: {error.message}</div>
  }

  if (channels.length === 0) {
    return <div className={styles.empty}>No channels found</div>
  }

  const sortedChannels = sortChannels(channels)

  return (
    <div ref={containerRef} className={styles.channelList}>
      {sortedChannels.map(channel => (
        <ChannelItem key={channel.url} channel={channel} />
      ))}

      {/* Sentinel element for infinite scroll */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* Pagination loading indicator */}
      {isFetchingNextPage && (
        <div className={styles.loadingMore}>
          <LoadingSpinner size="small" />
          <span>Loading more channels...</span>
        </div>
      )}
    </div>
  )
}

export default ChannelList
