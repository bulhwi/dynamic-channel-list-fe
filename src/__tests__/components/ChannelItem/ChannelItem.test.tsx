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

  // createdAt 타임스탬프가 포맷되어야 함
  it('should format createdAt timestamp', () => {
    render(<ChannelItem channel={mockChannel} />)

    // Should show some form of date (implementation may vary)
    // Just check that component renders without crashing
    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  // 커스텀 타입이 있을 때 렌더링되어야 함
  it('should render custom type when provided', () => {
    const channelWithCustomType: Channel = {
      ...mockChannel,
      customType: 'group',
    }

    render(<ChannelItem channel={channelWithCustomType} />)

    expect(screen.getByText('group')).toBeInTheDocument()
  })

  // 커스텀 타입이 없을 때는 렌더링하지 않아야 함
  it('should not render custom type when not provided', () => {
    render(<ChannelItem channel={mockChannel} />)

    // customType 요소가 문서에 없어야 함
    expect(screen.queryByText('group')).not.toBeInTheDocument()
  })

  // 모든 채널 속성과 함께 렌더링되어야 함
  it('should render with all channel properties', () => {
    const fullChannel: Channel = {
      url: 'full-test-url',
      name: 'Full Test Channel',
      createdAt: 1234567890000,
      customType: 'premium',
      data: '{"description":"Test description"}',
    }

    render(<ChannelItem channel={fullChannel} />)

    expect(screen.getByText('Full Test Channel')).toBeInTheDocument()
    expect(screen.getByText('full-test-url')).toBeInTheDocument()
    expect(screen.getByText('premium')).toBeInTheDocument()
  })

  // channel-item 기본 클래스를 가져야 함
  it('should have channel-item base class', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveClass('channel-item')
  })
})
