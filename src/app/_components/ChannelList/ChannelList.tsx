/**
 * ChannelList 컴포넌트
 *
 * 순수 CSS 호버 애니메이션이 적용된 채널 리스트를 표시합니다
 * 데이터 페칭에는 MSW + React Query를 사용합니다
 */

'use client'

import { useChannels } from '@/_hooks/useChannels'
import ChannelItem from '@/app/_components/ChannelItem/ChannelItem'
import { sortChannels } from '@/_lib/utils'
import styles from './ChannelList.module.css'

const ChannelList = () => {
  const { data, isLoading, error } = useChannels()

  if (isLoading) {
    return <div className={styles.loading}>Loading channels...</div>
  }

  if (error) {
    return <div className={styles.error}>Error loading channels: {error.message}</div>
  }

  if (!data || data.channels.length === 0) {
    return <div className={styles.empty}>No channels found</div>
  }

  const sortedChannels = sortChannels(data.channels)

  return (
    <div className={styles.channelList}>
      {sortedChannels.map(channel => (
        <ChannelItem key={channel.url} channel={channel} />
      ))}
    </div>
  )
}

export default ChannelList
