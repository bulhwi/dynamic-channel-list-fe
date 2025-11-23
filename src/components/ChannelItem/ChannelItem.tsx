/**
 * ChannelItem 컴포넌트
 *
 * 호버 애니메이션과 함께 채널 리스트에서 단일 채널을 표시합니다.
 * 호버 상태 및 인접 항목에 대한 시각적 피드백을 지원합니다.
 */

import clsx from 'clsx'
import type { Channel } from '@/types/channel.types'
import styles from './ChannelItem.module.css'

export interface ChannelItemProps {
  /** 표시할 채널 데이터 */
  channel: Channel
  /** 이 항목이 현재 호버되었는지 여부 */
  isHovered?: boolean
  /** 이 항목이 호버된 항목에 인접해 있는지 여부 */
  isAdjacent?: boolean
}

/**
 * 애니메이션과 함께 채널 정보를 표시하는 ChannelItem 컴포넌트입니다.
 *
 * @param {ChannelItemProps} props - 컴포넌트 props
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
  // 표시를 위한 타임스탬프 포맷팅
  const formattedDate = new Date(channel.createdAt).toLocaleString()

  return (
    <div
      className={clsx(
        styles['channel-item'],
        isHovered && styles.hovered,
        isAdjacent && styles.adjacent
      )}
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
