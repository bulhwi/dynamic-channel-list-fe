/**
 * ChannelItem Component
 *
 * Displays a single channel in the channel list with hover animations.
 * Supports visual feedback for hovered state and adjacent items.
 */

import clsx from 'clsx'
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
const ChannelItem = ({ channel, isHovered = false, isAdjacent = false }: ChannelItemProps) => {
  // Format timestamp for display
  const formattedDate = new Date(channel.createdAt).toLocaleString()

  return (
    <div
      className={clsx(styles['channel-item'], {
        [styles.hovered]: isHovered,
        [styles.adjacent]: isAdjacent,
      })}
    >
      <div className={styles.channelInfo}>
        <h3 className={styles.channelName}>{channel.name}</h3>
        <p className={styles.channelUrl}>{channel.url}</p>
        <time className={styles.channelDate} dateTime={formattedDate}>
          {formattedDate}
        </time>
        {channel.customType && <span className={styles.customType}>{channel.customType}</span>}
      </div>
    </div>
  )
}

export default ChannelItem
