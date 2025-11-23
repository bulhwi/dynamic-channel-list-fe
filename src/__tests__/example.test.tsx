import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '@/app/page'

// 각 테스트마다 새로운 QueryClient를 생성하는 헬퍼 함수
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // 테스트에서는 재시도 비활성화
      },
    },
  })
}

// 테스트용 래퍼 컴포넌트
function wrapper({ children }: { children: React.ReactNode }) {
  const testQueryClient = createTestQueryClient()
  return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
}

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />, { wrapper })

    const heading = screen.getByRole('heading', {
      name: /dynamic channel list/i,
    })

    expect(heading).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<Home />, { wrapper })

    expect(screen.getByText(/sendbird uikit implementation/i)).toBeInTheDocument()
  })
})
