/**
 * ChannelList 컴포넌트
 *
 * 무한 스크롤이 적용된 채널 리스트를 표시합니다
 * React Query useInfiniteQuery + Intersection Observer 사용
 * 클릭 시 채널 이름을 랜덤 문자열로 업데이트합니다
 * auto-animate로 재배치 애니메이션 제공
 */

'use client'

import { useState, useCallback } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useChannelList } from '@/_hooks/useChannelList'
import { useUpdateChannel } from '@/_hooks/useUpdateChannel'
import { useInfiniteScroll } from '@/_hooks/useInfiniteScroll'
import ChannelItem from '@/app/_components/ChannelItem/ChannelItem'
import LoadingSpinner from '@/app/_components/LoadingSpinner/LoadingSpinner'
import ErrorMessage from '@/app/_components/ErrorMessage/ErrorMessage'
import { toAppError, isCriticalError } from '@/_lib/errorUtils'
import { ErrorType } from '@/_types/error.types'
import { CHANNEL_CONFIG, ANIMATION_CONFIG } from '@/_constants/config'
import type { Channel } from '@/_types/channel.types'
import * as S from './ChannelList.style'

const ChannelList = () => {
  const { channels, isLoading, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannelList({ limit: CHANNEL_CONFIG.DEFAULT_PAGE_SIZE })

  const { mutate: updateChannel, isPending: isUpdating } = useUpdateChannel()
  const [updatingChannelUrl, setUpdatingChannelUrl] = useState<string | null>(null)

  // 부드러운 재배치를 위한 auto-animate
  const [animateRef] = useAutoAnimate<HTMLDivElement>({
    duration: ANIMATION_CONFIG.DURATION_MS,
    easing: ANIMATION_CONFIG.EASING,
  })

  const { containerRef, sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    isLoading: isFetchingNextPage,
    hasMore: hasNextPage,
  })

  // animateRef와 containerRef를 모두 설정하는 콜백 ref
  // useCallback으로 메모이제이션하여 무한 렌더링 방지
  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      // auto-animate ref 설정 (useAutoAnimate에서 항상 콜백 함수로 반환됨)
      if (typeof animateRef === 'function') {
        animateRef(element)
      }
      // IntersectionObserver를 위한 container ref 설정
      containerRef.current = element
    },
    [animateRef, containerRef]
  )

  const handleChannelClick = (channel: Channel) => {
    setUpdatingChannelUrl(channel.url)
    updateChannel(channel.url, {
      onSettled: () => {
        // mutation 완료 후 (성공/실패 모두) 업데이트 상태 해제
        setUpdatingChannelUrl(null)
      },
    })
  }

  // 에러 처리: 심각도에 따라 다르게 처리
  // render phase에서 체크하여 ErrorBoundary로 전달
  if (error) {
    const appError = toAppError(error, ErrorType.CHANNEL_FETCH_FAILED)

    // 심각한 에러는 ErrorBoundary로 전달 (throw)
    if (isCriticalError(appError)) {
      throw appError
    }

    // 복구 가능한 에러는 ErrorMessage 표시
    return (
      <S.ErrorContainer>
        <ErrorMessage message={appError.userMessage} onRetry={() => window.location.reload()} />
      </S.ErrorContainer>
    )
  }

  if (isLoading) {
    return <S.Loading>Loading channels...</S.Loading>
  }

  if (channels.length === 0) {
    return <S.Empty>No channels found</S.Empty>
  }

  return (
    <S.StyledChannelList ref={setRefs}>
      {channels.map(channel => (
        <ChannelItem
          key={channel.url}
          channel={channel}
          onClick={handleChannelClick}
          isUpdating={isUpdating && updatingChannelUrl === channel.url}
        />
      ))}

      {/* 무한 스크롤을 위한 센티널 요소 */}
      <S.Sentinel ref={sentinelRef} data-testid="sentinel" />

      {/* 페이지네이션 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <S.LoadingMore>
          <LoadingSpinner size="small" />
          <span>Loading more channels...</span>
        </S.LoadingMore>
      )}
    </S.StyledChannelList>
  )
}

export default ChannelList
