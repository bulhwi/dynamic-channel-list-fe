/**
 * Integration Tests for Home Page
 *
 * TDD 접근: page.tsx와 CreateChannelButton 통합 테스트
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import Home from '@/app/page'
import * as channelService from '@/services/sendbird/channel.service'
import * as channelsApi from '@/services/api/channels'

// Mock services
jest.mock('@/services/sendbird/channel.service')
jest.mock('@/services/api/channels')

const mockCreateChannel = channelService.createChannel as jest.MockedFunction<
  typeof channelService.createChannel
>
const mockFetchChannels = channelsApi.fetchChannels as jest.MockedFunction<
  typeof channelsApi.fetchChannels
>

// 테스트용 QueryClient 생성
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

// 테스트용 래퍼 컴포넌트
function createWrapper() {
  const testQueryClient = createTestQueryClient()
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  }
}

describe('Home Page Integration', () => {
  const mockInitialChannels = [
    { url: 'channel-1', name: 'banana', createdAt: 1000 },
    { url: 'channel-2', name: 'apple', createdAt: 2000 },
    { url: 'channel-3', name: 'cherry', createdAt: 3000 },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // 기본 채널 목록 mock
    mockFetchChannels.mockResolvedValue({
      channels: mockInitialChannels,
      next: null,
    })
  })

  // 페이지가 제목과 설명을 렌더링해야 함
  it('should render page title and description', async () => {
    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    expect(screen.getByText('Dynamic Channel List')).toBeInTheDocument()
    expect(
      screen.getByText('Sendbird UIKit implementation with dynamic channel list features')
    ).toBeInTheDocument()
  })

  // CreateChannelButton이 렌더링되어야 함
  it('should render CreateChannelButton', async () => {
    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create channel/i })).toBeInTheDocument()
    })
  })

  // ChannelList가 렌더링되어야 함
  it('should render ChannelList with channels', async () => {
    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    // 채널이 알파벳 순으로 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
      expect(screen.getByText('banana')).toBeInTheDocument()
      expect(screen.getByText('cherry')).toBeInTheDocument()
    })
  })

  // 버튼 클릭 시 새 채널이 생성되어야 함
  it('should create new channel when button is clicked', async () => {
    const user = userEvent.setup()
    const mockNewChannel = {
      url: 'new-channel',
      name: 'avocado',
      createdAt: Date.now(),
    }
    mockCreateChannel.mockResolvedValue(mockNewChannel)

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    // 버튼이 나타날 때까지 대기
    const button = await screen.findByRole('button', { name: /create channel/i })

    // 버튼 클릭
    await user.click(button)

    // createChannel 서비스가 호출되었는지 확인
    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalledTimes(1)
    })
  })

  // 채널 생성 후 리스트가 업데이트되어야 함
  it('should update channel list after creation', async () => {
    const user = userEvent.setup()
    const mockNewChannel = {
      url: 'new-channel',
      name: 'avocado',
      createdAt: Date.now(),
    }
    mockCreateChannel.mockResolvedValue(mockNewChannel)

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    // 초기 채널 목록 확인
    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
    })

    // 새 채널 생성 시 fetchChannels가 다시 호출될 때 새 채널 포함
    mockFetchChannels.mockResolvedValue({
      channels: [...mockInitialChannels, mockNewChannel],
      next: null,
    })

    const button = await screen.findByRole('button', { name: /create channel/i })
    await user.click(button)

    // 새 채널이 리스트에 나타나는지 확인
    await waitFor(() => {
      expect(screen.getByText('avocado')).toBeInTheDocument()
    })
  })

  // 새 채널이 알파벳 순으로 삽입되어야 함
  it('should insert new channel in alphabetical order', async () => {
    const user = userEvent.setup()
    const mockNewChannel = {
      url: 'new-channel',
      name: 'avocado',
      createdAt: Date.now(),
    }
    mockCreateChannel.mockResolvedValue(mockNewChannel)

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
    })

    // 새 채널 생성 후 목록 업데이트
    mockFetchChannels.mockResolvedValue({
      channels: [...mockInitialChannels, mockNewChannel],
      next: null,
    })

    const button = await screen.findByRole('button', { name: /create channel/i })
    await user.click(button)

    // 모든 채널이 알파벳 순으로 표시되는지 확인
    await waitFor(() => {
      const channelNames = screen.getAllByRole('heading', { level: 3 }).map(el => el.textContent)
      // 알파벳 순: apple, avocado, banana, cherry
      expect(channelNames).toEqual(['apple', 'avocado', 'banana', 'cherry'])
    })
  })

  // 로딩 중에 버튼이 비활성화되어야 함
  it('should disable button during creation', async () => {
    const user = userEvent.setup()
    let resolveCreate: (value: any) => void
    const createPromise = new Promise(resolve => {
      resolveCreate = resolve
    })
    mockCreateChannel.mockReturnValue(createPromise as any)

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    const button = await screen.findByRole('button', { name: /create channel/i })

    // 버튼 클릭
    await user.click(button)

    // 버튼이 비활성화되고 "Creating..." 텍스트로 변경
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
    })

    // Promise resolve
    resolveCreate!({
      url: 'new-channel',
      name: 'testchan',
      createdAt: Date.now(),
    })
  })

  // 에러 발생 시 에러 메시지를 표시해야 함
  it('should display error message on creation failure', async () => {
    const user = userEvent.setup()
    const error = new Error('Channel creation failed')
    mockCreateChannel.mockRejectedValue(error)

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    const button = await screen.findByRole('button', { name: /create channel/i })
    await user.click(button)

    // 에러 메시지가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText(/channel creation failed/i)).toBeInTheDocument()
    })
  })

  // 여러 채널을 연속으로 생성할 수 있어야 함
  it('should allow creating multiple channels sequentially', async () => {
    const user = userEvent.setup()

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
    })

    // 첫 번째 채널 생성
    mockCreateChannel.mockResolvedValueOnce({
      url: 'channel-4',
      name: 'dragon',
      createdAt: Date.now(),
    })
    mockFetchChannels.mockResolvedValueOnce({
      channels: [
        ...mockInitialChannels,
        { url: 'channel-4', name: 'dragon', createdAt: Date.now() },
      ],
      next: null,
    })

    const button = await screen.findByRole('button', { name: /create channel/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('dragon')).toBeInTheDocument()
    })

    // 두 번째 채널 생성
    mockCreateChannel.mockResolvedValueOnce({
      url: 'channel-5',
      name: 'elephant',
      createdAt: Date.now(),
    })
    mockFetchChannels.mockResolvedValueOnce({
      channels: [
        ...mockInitialChannels,
        { url: 'channel-4', name: 'dragon', createdAt: Date.now() },
        { url: 'channel-5', name: 'elephant', createdAt: Date.now() },
      ],
      next: null,
    })

    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('elephant')).toBeInTheDocument()
    })

    expect(mockCreateChannel).toHaveBeenCalledTimes(2)
  })
})
