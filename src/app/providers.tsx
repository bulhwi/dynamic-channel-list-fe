/**
 * 앱 프로바이더
 *
 * React Query와 Sendbird SDK 초기화
 * SSR 최적화: QueryClient는 서버/클라이언트 양쪽 지원
 */

'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { getQueryClient } from '@/lib/query-client'
import { initializeSendbird, connectUser } from '@/services/sendbird/client'
import { logError, toAppError } from '@/_lib/errorUtils'
import { ErrorType } from '@/_types/error.types'

/**
 * MSW 초기화 (개발 모드 전용)
 */
const initMocks = async () => {
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
 * Sendbird SDK 초기화 (백그라운드)
 * - 블로킹하지 않음
 * - 초기화 실패 시 에러는 각 API 호출에서 처리
 */
const initSendbirdAsync = async () => {
  try {
    // SDK 초기화
    initializeSendbird()

    // 랜덤 userId로 연결 (데모용)
    const userId = `user-${Math.random().toString(36).substring(2, 11)}`
    await connectUser(userId)

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Sendbird connected:', userId)
    }
  } catch (error) {
    // 에러를 AppError로 변환하여 로깅
    const appError = toAppError(error, ErrorType.SENDBIRD_CONNECTION_FAILED)
    logError(appError, 'initSendbirdAsync')
    // 에러를 throw하지 않음 - 각 API 호출에서 처리
  }
}

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  // QueryClient 싱글톤 사용
  const queryClient = getQueryClient()

  useEffect(() => {
    const init = async () => {
      // MSW 초기화 (옵션)
      await initMocks()

      // Sendbird 초기화 (MSW 사용하지 않을 때만)
      if (process.env.NEXT_PUBLIC_USE_MSW !== 'true') {
        // 백그라운드에서 초기화 (await 없음)
        initSendbirdAsync()
      }
    }

    init()
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
