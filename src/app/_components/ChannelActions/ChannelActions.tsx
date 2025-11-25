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
import { toAppError, isCriticalError } from '@/_lib/errorUtils'
import { ErrorType } from '@/_types/error.types'

export default function ChannelActions() {
  const { mutate, isPending, error, reset } = useCreateChannel()

  // 에러 처리: 심각도에 따라 다르게 처리
  // useEffect가 아닌 render phase에서 체크하여 ErrorBoundary로 전달
  if (error) {
    const appError = toAppError(error, ErrorType.CHANNEL_CREATE_FAILED)

    // 심각한 에러는 ErrorBoundary로 전달 (throw)
    if (isCriticalError(appError)) {
      throw appError
    }
  }

  // useCallback으로 메모이제이션: 함수 참조가 안정되어 CreateChannelButton 리렌더 방지
  const handleCreateChannel = useCallback(() => {
    mutate()
  }, [mutate])

  const handleRetry = useCallback(() => {
    reset() // 에러 상태 리셋
    mutate() // 재시도
  }, [reset, mutate])

  // 복구 가능한 에러만 CreateChannelButton으로 전달
  const errorMessage = error
    ? toAppError(error, ErrorType.CHANNEL_CREATE_FAILED).userMessage
    : undefined

  return (
    <CreateChannelButton
      onClick={handleCreateChannel}
      isLoading={isPending}
      error={errorMessage}
      onRetry={error ? handleRetry : undefined}
    />
  )
}
