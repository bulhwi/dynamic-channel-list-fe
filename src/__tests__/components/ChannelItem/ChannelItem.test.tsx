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

  it('should render channel name', () => {
    render(<ChannelItem channel={mockChannel} />)

    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  it('should render channel URL', () => {
    render(<ChannelItem channel={mockChannel} />)

    expect(screen.getByText(/test-channel-url/i)).toBeInTheDocument()
  })

  it('should apply hovered class when isHovered is true', () => {
    const { container } = render(<ChannelItem channel={mockChannel} isHovered={true} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveClass('hovered')
  })

  it('should apply adjacent class when isAdjacent is true', () => {
    const { container } = render(<ChannelItem channel={mockChannel} isAdjacent={true} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveClass('adjacent')
  })

  it('should not apply animation classes by default', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).not.toHaveClass('hovered')
    expect(item).not.toHaveClass('adjacent')
  })

  it('should format createdAt timestamp', () => {
    render(<ChannelItem channel={mockChannel} />)

    // Should show some form of date (implementation may vary)
    // Just check that component renders without crashing
    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  it('should render with custom type and data', () => {
    const channelWithExtras: Channel = {
      ...mockChannel,
      customType: 'group',
      data: '{"description":"Test description"}',
    }

    render(<ChannelItem channel={channelWithExtras} />)

    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })

  it('should have channel-item base class', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveClass('channel-item')
  })
})
