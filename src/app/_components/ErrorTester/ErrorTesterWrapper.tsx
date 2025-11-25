/**
 * ErrorTester Wrapper (Client Component)
 *
 * Server Component에서 dynamic import의 ssr: false를 사용할 수 없으므로
 * Client Component로 감싸서 동적 로드합니다.
 */

'use client'

import dynamic from 'next/dynamic'

// 클라이언트 사이드에서만 로드 (SSR 제외)
const ErrorTester = dynamic(() => import('./ErrorTester'), {
  ssr: false,
  loading: () => null,
})

export default function ErrorTesterWrapper() {
  // 개발 환경에서만 렌더링
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <ErrorTester />
}
