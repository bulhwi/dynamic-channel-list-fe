/**
 * ChannelItem 컴포넌트
 *
 * 순수 CSS 호버 애니메이션과 함께 채널 리스트에서 단일 채널을 표시합니다.
 * React.memo로 최적화되어 불필요한 재렌더링을 방지합니다.
 */

import { memo } from 'react'
import type { Channel } from '@/_types/channel.types'
import * as S from './ChannelItem.style'

export interface ChannelItemProps {
  /** 표시할 채널 데이터 */
  channel: Channel
  /** 클릭 이벤트 핸들러 (옵션) */
  onClick?: (channel: Channel) => void
  /** 업데이트 중 상태 (옵션) */
  isUpdating?: boolean
}

/**
 * 순수 CSS 애니메이션과 함께 채널 정보를 표시하는 ChannelItem 컴포넌트입니다.
 * React.memo를 사용하여 props가 변경되지 않으면 재렌더링을 건너뜁니다.
 *
 * @param {ChannelItemProps} props - 컴포넌트 props
 *
 * @example
 * ```tsx
 * <ChannelItem
 *   channel={channelData}
 *   onClick={handleClick}
 *   isUpdating={false}
 * />
 * ```
 */
const ChannelItem = memo(({ channel, onClick, isUpdating = false }: ChannelItemProps) => {
  // 표시를 위한 타임스탬프 포맷팅
  const formattedDate = new Date(channel.createdAt).toLocaleString()

  const handleClick = () => {
    // 로딩 중이거나 onClick 핸들러가 없으면 무시
    if (isUpdating || !onClick) return
    onClick(channel)
  }

  return (
    <S.StyledChannelItem
      $clickable={!!onClick}
      $isUpdating={isUpdating}
      data-channel-url={channel.url}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !isUpdating ? 0 : undefined}
      aria-disabled={isUpdating}
    >
      <S.ChannelInfo>
        <S.ChannelName>{channel.name}</S.ChannelName>
        <S.ChannelDate dateTime={formattedDate}>{formattedDate}</S.ChannelDate>
        {channel.customType && <S.CustomType>{channel.customType}</S.CustomType>}
      </S.ChannelInfo>
      {isUpdating && <S.LoadingIndicator>Updating...</S.LoadingIndicator>}
    </S.StyledChannelItem>
  )
})

ChannelItem.displayName = 'ChannelItem'

export default ChannelItem
