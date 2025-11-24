/**
 * useCreateChannel Hook
 *
 * React Query mutation을 사용하여 채널 생성을 처리하는 커스텀 훅입니다.
 * 채널 생성 후 자동으로 캐시를 무효화하여 목록을 갱신합니다.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createChannel } from '@/services/sendbird/channel.service'

/**
 * 채널 생성 mutation hook
 *
 * Sendbird SDK를 사용하여 랜덤 이름의 채널을 생성하고,
 * 성공 시 channels 쿼리를 무효화하여 목록을 자동으로 갱신합니다.
 *
 * @returns {UseMutationResult} React Query mutation 결과
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, error } = useCreateChannel()
 *
 * // 채널 생성
 * mutate()
 * ```
 */
export function useCreateChannel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChannel,
    onSuccess: () => {
      // 채널 목록 쿼리 무효화하여 자동 재조회
      queryClient.invalidateQueries({ queryKey: ['channels'] })
    },
  })
}
