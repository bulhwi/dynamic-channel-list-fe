/**
 * ChannelItem Component
 *
 * Displays a single channel in the channel list with hover animations.
 * Supports visual feedback for hovered state and adjacent items.
 */

import type { Channel } from '@/types/channel.types'
import styles from './ChannelItem.module.css'

export interface ChannelItemProps {
  /** Channel data to display */
  channel: Channel
  /** Whether this item is currently hovered */
  isHovered?: boolean
  /** Whether this item is adjacent to the hovered item */
  isAdjacent?: boolean
}

/**
 * ChannelItem component for displaying channel information with animations.
 *
 * @param {ChannelItemProps} props - Component props
 * @returns {JSX.Element} Rendered channel item
 *
 * @example
 * ```tsx
 * <ChannelItem
 *   channel={channelData}
 *   isHovered={hoveredIndex === currentIndex}
 *   isAdjacent={Math.abs(hoveredIndex - currentIndex) === 1}
 * />
 * ```
 */
export default function ChannelItem({
  channel,
  isHovered = false,
  isAdjacent = false,
}: ChannelItemProps) {
  // Build CSS class names based on state
  const classNames = [
    styles['channel-item'],
    isHovered && styles.hovered,
    isAdjacent && styles.adjacent,
  ]
    .filter(Boolean)
    .join(' ')

  // Format timestamp for display
  const formattedDate = new Date(channel.createdAt).toLocaleString()

  return (
    <div className={classNames}>
      <div className={styles.channelInfo}>
        <h3 className={styles.channelName}>{channel.name}</h3>
        <p className={styles.channelUrl}>{channel.url}</p>
        <time className={styles.channelDate} dateTime={new Date(channel.createdAt).toISOString()}>
          {formattedDate}
        </time>
        {channel.customType && <span className={styles.customType}>{channel.customType}</span>}
      </div>
    </div>
  )
}
