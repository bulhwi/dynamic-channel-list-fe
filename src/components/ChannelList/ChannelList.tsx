/**
 * ChannelList Component
 *
 * Displays a list of channels with hover animations
 * Uses MSW + React Query for data fetching and Context API for state management
 */

'use client'

import { useChannels } from '@/hooks/useChannels'
import { ChannelListProvider, useChannelListContext } from '@/contexts/ChannelListContext'
import ChannelItem from '@/components/ChannelItem/ChannelItem'
import { sortChannels } from '@/lib/utils'
import styles from './ChannelList.module.css'

const ChannelListContent = () => {
  const { data, isLoading, error } = useChannels()
  const { hoveredIndex, setHoveredIndex } = useChannelListContext()

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
      {sortedChannels.map((channel, index) => (
        <div
          key={channel.url}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <ChannelItem
            channel={channel}
            isHovered={hoveredIndex === index}
            isAdjacent={Math.abs((hoveredIndex ?? -2) - index) === 1}
          />
        </div>
      ))}
    </div>
  )
}

const ChannelList = () => {
  return (
    <ChannelListProvider>
      <ChannelListContent />
    </ChannelListProvider>
  )
}

export default ChannelList
