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
 * localStorage에서 userId를 가져오거나 새로 생성합니다.
 * - 이미 있으면 재사용 (UX 개선)
 * - 없으면 생성하고 저장
 */
const getUserId = (): string => {
  const STORAGE_KEY = 'sendbird_user_id'

  try {
    // localStorage에서 기존 userId 조회
    const existingUserId = localStorage.getItem(STORAGE_KEY)

    if (existingUserId) {
      return existingUserId
    }

    // 새로운 userId 생성
    const newUserId = `user-${Math.random().toString(36).substring(2, 11)}`

    // localStorage에 저장
    localStorage.setItem(STORAGE_KEY, newUserId)

    return newUserId
  } catch {
    // localStorage 접근 실패 시 (예: 프라이빗 모드) 임시 userId 생성
    return `user-${Math.random().toString(36).substring(2, 11)}`
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

    // localStorage에서 userId 가져오기 (영구 보존)
    const userId = getUserId()
    await connectUser(userId)

    // Sendbird 연결 성공 (로깅 제거 - 프로덕션 코드)
  } catch {
    // Sendbird 연결 실패 (로깅 제거 - 각 API 호출에서 에러 처리)
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
