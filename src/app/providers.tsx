/**
 * 앱 프로바이더
 *
 * 애플리케이션을 위한 Sendbird SDK, MSW, React Query 초기화
 */

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, type ReactNode } from 'react'
import { initializeSendbird, connectUser } from '@/services/sendbird/client'

/**
 * MSW 초기화 (NEXT_PUBLIC_USE_MSW=true일 때만)
 * 테스트 환경에서는 스킵
 */
const initMocks = async () => {
  // 테스트 환경에서는 MSW import하지 않음
  if (process.env.NODE_ENV === 'test') {
    return
  }

  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_MSW === 'true') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

/**
 * Sendbird SDK 초기화 및 사용자 연결
 */
const initSendbird = async () => {
  try {
    // SDK 초기화
    initializeSendbird()

    // 랜덤 userId로 연결 (데모용)
    // 실제 앱에서는 인증된 사용자 ID 사용
    const userId = `user-${Math.random().toString(36).substring(2, 11)}`
    await connectUser(userId)

    console.log('✅ Sendbird connected:', userId)
    return { success: true, userId }
  } catch (error) {
    console.error('❌ Sendbird connection failed:', error)
    return { success: false, error }
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

  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        // MSW 초기화 (옵션)
        await initMocks()

        // Sendbird SDK 초기화 및 연결 (MSW 사용하지 않을 때만)
        if (process.env.NEXT_PUBLIC_USE_MSW !== 'true') {
          const result = await initSendbird()
          if (!result.success) {
            setError('Failed to connect to Sendbird')
          }
        }

        setIsReady(true)
      } catch (err) {
        console.error('Initialization error:', err)
        setError('Failed to initialize application')
        setIsReady(true) // 에러가 있어도 앱은 렌더링
      }
    }

    init()
  }, [])

  // 초기화 대기 중
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Sendbird...</p>
        </div>
      </div>
    )
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please check your Sendbird configuration and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
