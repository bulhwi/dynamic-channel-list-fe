/**
 * Unit Tests for App Providers
 *
 * React Query Provider 래핑 및 Sendbird 초기화를 테스트합니다.
 */

import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Providers } from '@/app/providers'
import { useQuery } from '@tanstack/react-query'

// Mock Sendbird client
jest.mock('@/services/sendbird/client', () => ({
  initializeSendbird: jest.fn(),
  connectUser: jest.fn(),
}))

// 테스트용 컴포넌트: useQuery를 사용하는 간단한 컴포넌트
function TestComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      return { message: 'Hello from React Query' }
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  return <div>{data?.message}</div>
}

describe('Providers', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    // MSW 사용 모드로 설정 (실제 Sendbird 연결 스킵)
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_USE_MSW: 'true',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  // 자식 컴포넌트를 렌더링해야 함
  it('should render children', async () => {
    render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    )

    // 초기화 대기
    await waitFor(() => {
      expect(screen.getByText('Test Child')).toBeInTheDocument()
    })
  })

  // QueryClient를 제공해야 함
  it('should provide QueryClient to children', async () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    )

    // 초기화 완료 후 데이터 로딩
    // (Providers 초기화 → TestComponent 렌더링 → React Query 실행)

    // 데이터가 로드되면 메시지 표시
    expect(await screen.findByText('Hello from React Query')).toBeInTheDocument()
  })

  // 여러 자식 컴포넌트를 렌더링해야 함
  it('should render multiple children', async () => {
    render(
      <Providers>
        <div>First Child</div>
        <div>Second Child</div>
      </Providers>
    )

    // 초기화 대기
    await waitFor(() => {
      expect(screen.getByText('First Child')).toBeInTheDocument()
      expect(screen.getByText('Second Child')).toBeInTheDocument()
    })
  })
})
