/**
 * Next.js Error Page (Client Component)
 *
 * 클라이언트 사이드 에러를 캐치하는 Next.js 공식 에러 페이지입니다.
 * ErrorBoundary와 유사하지만 Next.js App Router에 최적화되어 있습니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

'use client'

import { useEffect } from 'react'
import { AppError } from '@/_types/error.types'
import { logError } from '@/_lib/errorUtils'
import * as S from '@/app/_components/ErrorBoundary/ErrorBoundary.style'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 에러 로깅
    logError(error, 'Next.js Error Page')
  }, [error])

  // AppError에서 사용자 친화적 메시지 추출
  const appError = error instanceof AppError ? error : null
  const userMessage = appError?.userMessage || '예상치 못한 오류가 발생했습니다.'

  return (
    <S.Container>
      <S.Icon>⚠️</S.Icon>
      <S.Title>문제가 발생했습니다</S.Title>
      <S.Message>{userMessage}</S.Message>

      <S.ButtonGroup>
        <S.Button onClick={reset}>다시 시도</S.Button>
        <S.Button onClick={() => (window.location.href = '/')} $variant="secondary">
          홈으로 이동
        </S.Button>
      </S.ButtonGroup>

      {/* 개발 환경에서만 디버그 정보 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <S.DebugInfo>
          <summary>개발자 정보 (개발 환경에서만 표시)</summary>
          <div>
            <p>
              <strong>Error Type:</strong> {appError ? appError.type : error.name}
            </p>
            {appError?.code && (
              <p>
                <strong>Sendbird Error Code:</strong> {appError.code}
              </p>
            )}
            <p>
              <strong>Technical Message:</strong> {appError?.technicalMessage || error.message}
            </p>
            {error.digest && (
              <p>
                <strong>Error Digest:</strong> {error.digest}
              </p>
            )}
            <p>
              <strong>Stack Trace:</strong>
            </p>
            <pre>{error.stack}</pre>
          </div>
        </S.DebugInfo>
      )}
    </S.Container>
  )
}
