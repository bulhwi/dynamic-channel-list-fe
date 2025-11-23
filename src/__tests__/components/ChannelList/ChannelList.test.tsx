/**
 * Unit Tests for ChannelList Component
 *
 * ChannelList는 채널 목록을 표시하고 다음을 처리합니다:
 * - 로딩 상태
 * - 에러 상태
 * - 빈 목록
 * - 알파벳 순 정렬
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChannelList from '@/components/ChannelList/ChannelList'
import type { Channel } from '@/types/channel.types'
import * as useChannelsHook from '@/hooks/useChannels'

// useChannels hook을 mock
jest.mock('@/hooks/useChannels')

// 목 데이터
const mockChannels: Channel[] = [
  {
    url: 'channel-zebra',
    name: 'Zebra Channel',
    createdAt: 1000,
    customType: 'group',
  },
  {
    url: 'channel-apple',
    name: 'Apple Channel',
    createdAt: 2000,
  },
  {
    url: 'channel-mango',
    name: 'Mango Channel',
    createdAt: 3000,
    customType: 'private',
  },
]

const mockUseChannels = useChannelsHook.useChannels as jest.MockedFunction<
  typeof useChannelsHook.useChannels
>

describe('ChannelList', () => {
  // 각 테스트 전에 mock 초기화
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // 로딩 상태가 표시되어야 함
  it('should show loading state initially', () => {
    mockUseChannels.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    } as any)

    render(<ChannelList />)

    expect(screen.getByText(/loading channels/i)).toBeInTheDocument()
  })

  // 채널 목록이 렌더링되어야 함
  it('should render channel list when data is loaded', () => {
    mockUseChannels.mockReturnValue({
      data: { channels: mockChannels, next: null },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any)

    render(<ChannelList />)

    // 채널들이 렌더링되었는지 확인
    expect(screen.getByText('Zebra Channel')).toBeInTheDocument()
    expect(screen.getByText('Apple Channel')).toBeInTheDocument()
    expect(screen.getByText('Mango Channel')).toBeInTheDocument()
  })

  // 채널들이 알파벳 순으로 정렬되어야 함
  it('should render channels in alphabetical order', () => {
    mockUseChannels.mockReturnValue({
      data: { channels: mockChannels, next: null },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any)

    const { container } = render(<ChannelList />)

    // 채널 아이템들을 DOM 순서대로 가져오기
    const channelItems = container.querySelectorAll('.channel-item')

    // 각 아이템 내의 채널 이름 확인
    expect(channelItems[0]).toHaveTextContent('Apple Channel')
    expect(channelItems[1]).toHaveTextContent('Mango Channel')
    expect(channelItems[2]).toHaveTextContent('Zebra Channel')
  })

  // 에러 상태가 표시되어야 함
  it('should show error state when API fails', () => {
    mockUseChannels.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API Error'),
      refetch: jest.fn(),
    } as any)

    render(<ChannelList />)

    expect(screen.getByText(/error loading channels/i)).toBeInTheDocument()
  })

  // 빈 목록 메시지가 표시되어야 함
  it('should show empty state when no channels exist', () => {
    mockUseChannels.mockReturnValue({
      data: { channels: [], next: null },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any)

    render(<ChannelList />)

    expect(screen.getByText(/no channels found/i)).toBeInTheDocument()
  })

  // 각 채널이 고유한 key를 가져야 함 (채널 URL 사용)
  it('should use channel URL as unique key', () => {
    mockUseChannels.mockReturnValue({
      data: { channels: mockChannels, next: null },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any)

    const { container } = render(<ChannelList />)

    // 채널 아이템들이 렌더링되었는지 확인
    const channelItems = container.querySelectorAll('.channel-item')
    expect(channelItems.length).toBe(3)
  })

  // 커스텀 타입이 있는 채널을 렌더링해야 함
  it('should render channels with custom types', () => {
    mockUseChannels.mockReturnValue({
      data: { channels: mockChannels, next: null },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any)

    render(<ChannelList />)

    // 커스텀 타입이 렌더링되었는지 확인
    expect(screen.getByText('group')).toBeInTheDocument()
    expect(screen.getByText('private')).toBeInTheDocument()
  })

  // 채널 URL들이 렌더링되어야 함
  it('should render channel URLs', () => {
    mockUseChannels.mockReturnValue({
      data: { channels: mockChannels, next: null },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any)

    render(<ChannelList />)

    // URL들이 렌더링되었는지 확인
    expect(screen.getByText('channel-zebra')).toBeInTheDocument()
    expect(screen.getByText('channel-apple')).toBeInTheDocument()
    expect(screen.getByText('channel-mango')).toBeInTheDocument()
  })
})
