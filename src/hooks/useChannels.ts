/**
 * useChannels Hook
 *
 * React Query hook for fetching channels
 */

import { useQuery } from '@tanstack/react-query'
import { fetchChannels } from '@/services/api/channels'

export function useChannels() {
  return useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannels,
  })
}
