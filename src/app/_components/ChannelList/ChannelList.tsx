/**
 * ChannelList 컴포넌트
 *
 * 무한 스크롤이 적용된 채널 리스트를 표시합니다
 * React Query useInfiniteQuery + Intersection Observer 사용
 * 클릭 시 채널 이름을 랜덤 문자열로 업데이트합니다
 * auto-animate로 재배치 애니메이션 제공
 */

'use client'

import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useChannelList } from '@/_hooks/useChannelList'
import { useUpdateChannel } from '@/_hooks/useUpdateChannel'
import { useInfiniteScroll } from '@/_hooks/useInfiniteScroll'
import ChannelItem from '@/app/_components/ChannelItem/ChannelItem'
import LoadingSpinner from '@/app/_components/LoadingSpinner/LoadingSpinner'
import { sortChannels } from '@/_lib/utils'
import type { Channel } from '@/_types/channel.types'
import styles from './ChannelList.module.css'

const ChannelList = () => {
  const { channels, isLoading, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannelList({ limit: 10 })

  const { mutate: updateChannel, isPending: isUpdating } = useUpdateChannel()
  const [updatingChannelUrl, setUpdatingChannelUrl] = useState<string | null>(null)

  // auto-animate for smooth re-positioning
  const [animateRef] = useAutoAnimate<HTMLDivElement>({
    duration: 400, // 400ms animation duration
    easing: 'ease-in-out',
  })

  const { containerRef, sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    isLoading: isFetchingNextPage,
    hasMore: hasNextPage,
  })

  // Callback ref to set both animateRef and containerRef
  const setRefs = (element: HTMLDivElement | null) => {
    // Set auto-animate ref (it's always a callback function from useAutoAnimate)
    if (typeof animateRef === 'function') {
      animateRef(element)
    }
    // Set container ref for IntersectionObserver
    containerRef.current = element
  }

  const handleChannelClick = (channel: Channel) => {
    setUpdatingChannelUrl(channel.url)
    updateChannel(channel.url, {
      onSettled: () => {
        // mutation 완료 후 (성공/실패 모두) 업데이트 상태 해제
        setUpdatingChannelUrl(null)
      },
    })
  }

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
    <div ref={setRefs} className={styles.channelList}>
      {sortedChannels.map(channel => (
        <ChannelItem
          key={channel.url}
          channel={channel}
          onClick={handleChannelClick}
          isUpdating={isUpdating && updatingChannelUrl === channel.url}
        />
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
