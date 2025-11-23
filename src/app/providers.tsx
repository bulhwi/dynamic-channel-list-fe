/**
 * 앱 프로바이더
 *
 * 애플리케이션을 위한 MSW와 React Query 초기화
 */

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, type ReactNode } from 'react'

/**
 * 개발 모드에서 MSW 초기화
 */
const initMocks = async () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    initMocks().then(() => {
      setMswReady(true)
    })
  }, [])

  // 개발 환경에서 MSW가 준비될 때까지 대기
  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return null
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
