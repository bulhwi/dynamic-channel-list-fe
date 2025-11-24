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
import { createChannel } from '@/services/sendbird/channel/createChannel'
import { getChannels } from '@/services/sendbird/channel/getChannels'

// Mock services
jest.mock('@/services/sendbird/channel/createChannel')
jest.mock('@/services/sendbird/channel/getChannels')

const mockCreateChannel = createChannel as jest.MockedFunction<typeof createChannel>
const mockGetChannels = getChannels as jest.MockedFunction<typeof getChannels>

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
    mockGetChannels.mockResolvedValue({
      channels: mockInitialChannels,
      hasMore: false,
      query: { hasNext: false } as any,
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

    // 새 채널 생성 시 getChannels가 다시 호출될 때 새 채널 포함
    const updatedChannels = [...mockInitialChannels, mockNewChannel]
    mockGetChannels.mockResolvedValue({
      channels: updatedChannels,
      hasMore: false,
      query: { hasNext: false } as any,
    })
    mockGetChannels.mockResolvedValue({
      channels: updatedChannels,
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
    const updatedChannels2 = [...mockInitialChannels, mockNewChannel]
    mockGetChannels.mockResolvedValue({
      channels: updatedChannels2,
      hasMore: false,
      query: { hasNext: false } as any,
    })
    mockGetChannels.mockResolvedValue({
      channels: updatedChannels2,
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
  // TODO: Fix mock strategy for multiple sequential channel creations
  it.skip('should allow creating multiple channels sequentially', async () => {
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
    const withDragon = [
      ...mockInitialChannels,
      { url: 'channel-4', name: 'dragon', createdAt: Date.now() },
    ]
    mockGetChannels.mockResolvedValueOnce({
      channels: withDragon,
      hasMore: false,
      query: { hasNext: false } as any,
    })
    mockGetChannels.mockResolvedValueOnce({
      channels: withDragon,
      hasMore: false,
      query: { hasNext: false } as any,
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
    const withElephant = [
      ...mockInitialChannels,
      { url: 'channel-4', name: 'dragon', createdAt: Date.now() },
      { url: 'channel-5', name: 'elephant', createdAt: Date.now() },
    ]
    mockGetChannels.mockResolvedValueOnce({
      channels: withElephant,
      hasMore: false,
      query: { hasNext: false } as any,
    })
    mockGetChannels.mockResolvedValueOnce({
      channels: withElephant,
      hasMore: false,
      query: { hasNext: false } as any,
    })
    // 추가 호출을 위한 기본값
    mockGetChannels.mockResolvedValue({
      channels: withElephant,
      hasMore: false,
      query: { hasNext: false } as any,
    })

    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('elephant')).toBeInTheDocument()
    })

    expect(mockCreateChannel).toHaveBeenCalledTimes(2)
  })

  // LoadingSpinner가 로딩 중에 표시되어야 함
  it('should show LoadingSpinner during channel creation', async () => {
    const user = userEvent.setup()
    let resolveCreate: (value: any) => void
    const createPromise = new Promise(resolve => {
      resolveCreate = resolve
    })
    mockCreateChannel.mockReturnValue(createPromise as any)

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    const button = await screen.findByRole('button', { name: /create channel/i })
    await user.click(button)

    // LoadingSpinner가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    // Promise resolve
    resolveCreate!({
      url: 'new-channel',
      name: 'testchan',
      createdAt: Date.now(),
    })
  })

  // 재시도 버튼이 에러 시 표시되고 작동해야 함
  it('should show retry button and allow retrying on error', async () => {
    const user = userEvent.setup()
    mockCreateChannel.mockRejectedValueOnce(new Error('Failed to create'))

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    const button = await screen.findByRole('button', { name: /create channel/i })
    await user.click(button)

    // 에러 메시지와 재시도 버튼이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText(/failed to create/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /다시 시도/i })).toBeInTheDocument()
    })

    // 재시도 성공 시나리오
    mockCreateChannel.mockResolvedValueOnce({
      url: 'retry-channel',
      name: 'retrychan',
      createdAt: Date.now(),
    })
    const withRetry = [
      ...mockInitialChannels,
      { url: 'retry-channel', name: 'retrychan', createdAt: Date.now() },
    ]
    mockGetChannels.mockResolvedValueOnce({
      channels: withRetry,
      hasMore: false,
      query: { hasNext: false } as any,
    })
    mockGetChannels.mockResolvedValueOnce({
      channels: withRetry,
      hasMore: false,
      query: { hasNext: false } as any,
    })

    const retryButton = screen.getByRole('button', { name: /다시 시도/i })
    await user.click(retryButton)

    // 재시도 후 에러가 사라지고 새 채널이 표시되는지 확인
    await waitFor(() => {
      expect(screen.queryByText(/failed to create/i)).not.toBeInTheDocument()
      expect(screen.getByText('retrychan')).toBeInTheDocument()
    })
  })

  // E2E: 전체 채널 생성 플로우 (사용자 시나리오)
  it('should complete full channel creation flow from user perspective', async () => {
    const user = userEvent.setup()
    let resolveCreate: (value: any) => void
    const createPromise = new Promise(resolve => {
      resolveCreate = resolve
    })

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    // 1. 초기 채널 목록 확인
    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
      expect(screen.getByText('banana')).toBeInTheDocument()
      expect(screen.getByText('cherry')).toBeInTheDocument()
    })

    // 2. 생성 버튼 클릭
    mockCreateChannel.mockReturnValue(createPromise as any)
    const button = screen.getByRole('button', { name: /create channel/i })
    await user.click(button)

    // 3. 로딩 상태 확인
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
    })

    // 4. 채널 생성 완료
    const withAvocado = [
      ...mockInitialChannels,
      { url: 'new-channel', name: 'avocado', createdAt: Date.now() },
    ]
    mockGetChannels.mockResolvedValueOnce({
      channels: withAvocado,
      hasMore: false,
      query: { hasNext: false } as any,
    })
    mockGetChannels.mockResolvedValueOnce({
      channels: withAvocado,
      hasMore: false,
      query: { hasNext: false } as any,
    })

    resolveCreate!({
      url: 'new-channel',
      name: 'avocado',
      createdAt: Date.now(),
    })

    // 5. 새 채널이 올바른 알파벳 순서로 표시되는지 확인
    await waitFor(() => {
      const channelNames = screen.getAllByRole('heading', { level: 3 }).map(el => el.textContent)
      expect(channelNames).toEqual(['apple', 'avocado', 'banana', 'cherry'])
    })

    // 6. 버튼이 다시 활성화되는지 확인
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create channel/i })).not.toBeDisabled()
    })
  })

  // E2E: 에러 발생 시 전체 플로우
  it('should handle error flow from user perspective', async () => {
    const user = userEvent.setup()
    mockCreateChannel.mockRejectedValue(new Error('Network error'))

    const Wrapper = createWrapper()
    render(<Home />, { wrapper: Wrapper })

    // 1. 초기 상태 확인
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create channel/i })).toBeInTheDocument()
    })

    // 2. 버튼 클릭
    const button = screen.getByRole('button', { name: /create channel/i })
    await user.click(button)

    // 3. 에러 메시지와 재시도 버튼 확인
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /다시 시도/i })).toBeInTheDocument()
    })

    // 4. 원래 버튼은 여전히 활성화되어 있어야 함
    expect(screen.getByRole('button', { name: /create channel/i })).not.toBeDisabled()
  })
})
