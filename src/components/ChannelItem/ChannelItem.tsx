/**
 * ChannelItem 컴포넌트
 *
 * 순수 CSS 호버 애니메이션과 함께 채널 리스트에서 단일 채널을 표시합니다.
 */

import type { Channel } from '@/types/channel.types'
import styles from './ChannelItem.module.css'

export interface ChannelItemProps {
  /** 표시할 채널 데이터 */
  channel: Channel
}

/**
 * 순수 CSS 애니메이션과 함께 채널 정보를 표시하는 ChannelItem 컴포넌트입니다.
 *
 * @param {ChannelItemProps} props - 컴포넌트 props
 *
 * @example
 * ```tsx
 * <ChannelItem channel={channelData} />
 * ```
 */
const ChannelItem = ({ channel }: ChannelItemProps) => {
  // 표시를 위한 타임스탬프 포맷팅
  const formattedDate = new Date(channel.createdAt).toLocaleString()

  return (
    <div className={styles['channel-item']}>
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
