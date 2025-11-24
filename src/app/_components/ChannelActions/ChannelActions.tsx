/**
 * ChannelActions 클라이언트 컴포넌트
 *
 * 채널 생성 버튼과 관련 로직 처리
 * page.tsx의 interactive 부분을 분리
 *
 * useCallback으로 최적화: 함수 참조 안정화로 불필요한 리렌더 방지
 */

'use client'

import { useCallback } from 'react'
import CreateChannelButton from '@/app/_components/CreateChannelButton/CreateChannelButton'
import { useCreateChannel } from '@/_hooks/useCreateChannel'

export default function ChannelActions() {
  const { mutate, isPending, error, reset } = useCreateChannel()

  // useCallback으로 메모이제이션: 함수 참조가 안정되어 CreateChannelButton 리렌더 방지
  const handleCreateChannel = useCallback(() => {
    mutate()
  }, [mutate])

  const handleRetry = useCallback(() => {
    reset() // 에러 상태 리셋
    mutate() // 재시도
  }, [reset, mutate])

  return (
    <CreateChannelButton
      onClick={handleCreateChannel}
      isLoading={isPending}
      error={error?.message}
      onRetry={error ? handleRetry : undefined}
    />
  )
}
