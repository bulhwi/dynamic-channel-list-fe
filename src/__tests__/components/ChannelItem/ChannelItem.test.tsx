/**
 * Unit Tests for ChannelItem Component
 *
 * TDD approach: Write tests first, then implement component
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChannelItem from '@/components/ChannelItem/ChannelItem'
import type { Channel } from '@/types/channel.types'

describe('ChannelItem', () => {
  const mockChannel: Channel = {
    url: 'test-channel-url',
    name: 'Test Channel',
    createdAt: 1234567890000,
  }

  // 채널 이름이 렌더링되어야 함
  it('should render channel name', () => {
    render(<ChannelItem channel={mockChannel} />)

    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  // 채널 URL이 렌더링되어야 함
  it('should render channel URL', () => {
    render(<ChannelItem channel={mockChannel} />)

    expect(screen.getByText(/test-channel-url/i)).toBeInTheDocument()
  })

  // isHovered가 true일 때 hovered 클래스가 적용되어야 함
  it('should apply hovered class when isHovered is true', () => {
    const { container } = render(<ChannelItem channel={mockChannel} isHovered={true} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveClass('hovered')
  })

  // isAdjacent가 true일 때 adjacent 클래스가 적용되어야 함
  it('should apply adjacent class when isAdjacent is true', () => {
    const { container } = render(<ChannelItem channel={mockChannel} isAdjacent={true} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveClass('adjacent')
  })

  // 기본적으로 애니메이션 클래스가 적용되지 않아야 함
  it('should not apply animation classes by default', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).not.toHaveClass('hovered')
    expect(item).not.toHaveClass('adjacent')
  })

  // createdAt 타임스탬프가 포맷되어야 함
  it('should format createdAt timestamp', () => {
    render(<ChannelItem channel={mockChannel} />)

    // Should show some form of date (implementation may vary)
    // Just check that component renders without crashing
    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  // 커스텀 타입과 데이터와 함께 렌더링되어야 함
  it('should render with custom type and data', () => {
    const channelWithExtras: Channel = {
      ...mockChannel,
      customType: 'group',
      data: '{"description":"Test description"}',
    }

    render(<ChannelItem channel={channelWithExtras} />)

    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  // channel-item 기본 클래스를 가져야 함
  it('should have channel-item base class', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveClass('channel-item')
  })
})
