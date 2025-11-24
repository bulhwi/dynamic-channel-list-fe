/**
 * ChannelActions 클라이언트 컴포넌트
 *
 * 채널 생성 버튼과 관련 로직 처리
 * page.tsx의 interactive 부분을 분리
 */

'use client'

import CreateChannelButton from '@/app/_components/CreateChannelButton/CreateChannelButton'
import { useCreateChannel } from '@/_hooks/useCreateChannel'

export default function ChannelActions() {
  const { mutate, isPending, error, reset } = useCreateChannel()

  const handleCreateChannel = () => {
    mutate()
  }

  const handleRetry = () => {
    reset() // 에러 상태 리셋
    mutate() // 재시도
  }

  return (
    <CreateChannelButton
      onClick={handleCreateChannel}
      isLoading={isPending}
      error={error?.message}
      onRetry={error ? handleRetry : undefined}
    />
  )
}
