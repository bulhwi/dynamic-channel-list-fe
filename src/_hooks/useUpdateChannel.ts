/**
 * useUpdateChannel Hook
 *
 * React Query mutation을 사용하여 채널 업데이트를 처리하는 커스텀 훅입니다.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateChannel } from '@/services/sendbird/channel/updateChannel'

/**
 * 채널 업데이트 mutation hook
 *
 * Sendbird SDK를 사용하여 채널 이름을 랜덤 문자열로 업데이트하고,
 * 성공 시 채널 목록을 자동으로 갱신합니다.
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
    onSuccess: () => {
      // 성공 시 채널 목록 쿼리 무효화하여 최신 데이터로 갱신
      // prefix matching으로 모든 limit 변형 무효화
      // refetchType: 'active' - 현재 마운트된 쿼리만 refetch
      queryClient.invalidateQueries({
        queryKey: ['channels', 'list'],
        refetchType: 'active',
      })
    },
  })
}
