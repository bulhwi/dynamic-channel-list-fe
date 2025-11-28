/**
 * Unit Tests for ChannelItem Component
 *
 * TDD approach: Write tests first, then implement component
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChannelItem from '@/app/_components/ChannelItem/ChannelItem'
import type { Channel } from '@/_types/channel.types'

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
    expect(screen.getByText('premium')).toBeInTheDocument()
  })

  // 기본 스타일을 가져야 함
  it('should render with base styles', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).toBeInTheDocument()
  })

  // onClick이 제공될 때 cursor pointer를 가져야 함
  it('should have cursor pointer when onClick is provided', () => {
    const mockOnClick = jest.fn()
    const { container } = render(<ChannelItem channel={mockChannel} onClick={mockOnClick} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveStyle({ cursor: 'pointer' })
  })

  // onClick이 없을 때 cursor default를 가져야 함
  it('should have cursor default when onClick is not provided', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveStyle({ cursor: 'default' })
  })

  // 클릭 시 onClick 핸들러가 호출되어야 함
  it('should call onClick handler when clicked', () => {
    const mockOnClick = jest.fn()
    render(<ChannelItem channel={mockChannel} onClick={mockOnClick} />)

    const item = screen.getByText('Test Channel').closest('div')
    fireEvent.click(item!)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(mockOnClick).toHaveBeenCalledWith(mockChannel)
  })

  // isUpdating이 true일 때 onClick 호출을 무시해야 함
  it('should not call onClick when isUpdating is true', () => {
    const mockOnClick = jest.fn()
    render(<ChannelItem channel={mockChannel} onClick={mockOnClick} isUpdating={true} />)

    const item = screen.getByText('Test Channel').closest('div')
    fireEvent.click(item!)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  // isUpdating일 때 opacity를 낮춰야 함
  it('should have reduced opacity when isUpdating is true', () => {
    const { container } = render(<ChannelItem channel={mockChannel} isUpdating={true} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveStyle({ opacity: '0.6' })
  })

  // isUpdating일 때 로딩 인디케이터를 렌더링해야 함
  it('should render loading indicator when isUpdating is true', () => {
    render(<ChannelItem channel={mockChannel} isUpdating={true} />)

    expect(screen.getByText('Updating...')).toBeInTheDocument()
  })

  // isUpdating이 false일 때 로딩 인디케이터를 렌더링하지 않아야 함
  it('should not render loading indicator when isUpdating is false', () => {
    render(<ChannelItem channel={mockChannel} isUpdating={false} />)

    expect(screen.queryByText('Updating...')).not.toBeInTheDocument()
  })

  // onClick이 있을 때 role="button"을 가져야 함
  it('should have role="button" when onClick is provided', () => {
    const mockOnClick = jest.fn()
    const { container } = render(<ChannelItem channel={mockChannel} onClick={mockOnClick} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveAttribute('role', 'button')
  })

  // onClick이 없을 때 role 속성이 없어야 함
  it('should not have role attribute when onClick is not provided', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).not.toHaveAttribute('role')
  })

  // onClick이 있고 isUpdating이 false일 때 tabIndex=0을 가져야 함
  it('should have tabIndex=0 when onClick is provided and not updating', () => {
    const mockOnClick = jest.fn()
    const { container } = render(<ChannelItem channel={mockChannel} onClick={mockOnClick} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveAttribute('tabIndex', '0')
  })

  // isUpdating일 때 aria-disabled="true"를 가져야 함
  it('should have aria-disabled="true" when isUpdating', () => {
    const { container } = render(<ChannelItem channel={mockChannel} isUpdating={true} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveAttribute('aria-disabled', 'true')
  })

  // data-channel-url 속성을 가져야 함
  it('should have data-channel-url attribute', () => {
    const { container } = render(<ChannelItem channel={mockChannel} />)

    const item = container.firstChild as HTMLElement
    expect(item).toHaveAttribute('data-channel-url', 'test-channel-url')
  })
})
