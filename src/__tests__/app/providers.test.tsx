/**
 * Unit Tests for App Providers
 *
 * React Query Provider 래핑을 테스트합니다.
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Providers } from '@/app/providers'
import { useQuery } from '@tanstack/react-query'

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
  // 자식 컴포넌트를 렌더링해야 함
  it('should render children', () => {
    render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    )

    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  // QueryClient를 제공해야 함
  it('should provide QueryClient to children', async () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    )

    // 처음에는 로딩 상태
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // 데이터가 로드되면 메시지 표시
    expect(await screen.findByText('Hello from React Query')).toBeInTheDocument()
  })

  // 여러 자식 컴포넌트를 렌더링해야 함
  it('should render multiple children', () => {
    render(
      <Providers>
        <div>First Child</div>
        <div>Second Child</div>
      </Providers>
    )

    expect(screen.getByText('First Child')).toBeInTheDocument()
    expect(screen.getByText('Second Child')).toBeInTheDocument()
  })
})
