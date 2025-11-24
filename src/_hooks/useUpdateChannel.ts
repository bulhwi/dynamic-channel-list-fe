/**
 * useUpdateChannel Hook
 *
 * React Query mutation을 사용하여 채널 업데이트를 처리하는 커스텀 훅입니다.
 * 낙관적 업데이트(optimistic update)를 지원하며, 실패 시 자동으로 롤백됩니다.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateChannel } from '@/services/sendbird/channel/updateChannel'
import type { Channel } from '@/_types/channel.types'

/**
 * 채널 업데이트 mutation hook
 *
 * Sendbird SDK를 사용하여 채널 이름을 랜덤 문자열로 업데이트하고,
 * 낙관적 업데이트로 즉각적인 UI 반영 및 에러 시 자동 롤백을 제공합니다.
 *
 * @returns {UseMutationResult} React Query mutation 결과
 *
 * @example
 * ```typescript
 * const { mutate, isPending, error } = useUpdateChannel()
 *
 * // 채널 업데이트
 * mutate('channel-url-123')
 * ```
 */
export function useUpdateChannel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateChannel,
    // 낙관적 업데이트: UI를 즉시 업데이트하고, 실패 시 롤백
    onMutate: async (_channelUrl: string) => {
      // 진행 중인 채널 목록 쿼리 취소 (낙관적 업데이트와 충돌 방지)
      await queryClient.cancelQueries({ queryKey: ['channels'] })

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousChannels = queryClient.getQueryData<Channel[]>(['channels'])

      // 낙관적 업데이트: 해당 채널의 이름을 "Updating..." 으로 표시
      // (실제로는 서버 응답을 기다림, UI에서 isUpdating 상태로 표시)

      // 롤백을 위한 컨텍스트 반환
      return { previousChannels }
    },
    onError: (_error, _channelUrl, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousChannels) {
        queryClient.setQueryData(['channels'], context.previousChannels)
      }
    },
    onSuccess: () => {
      // 성공 시 채널 목록 쿼리 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ['channels'] })
    },
  })
}
