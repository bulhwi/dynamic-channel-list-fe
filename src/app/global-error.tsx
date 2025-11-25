/**
 * Next.js Global Error Page (Client Component)
 *
 * 루트 레벨의 에러를 캐치하는 Next.js 공식 글로벌 에러 페이지입니다.
 * 루트 layout.tsx의 에러를 캐치합니다.
 *
 * 주의: global-error는 반드시 <html>과 <body> 태그를 포함해야 합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errortsx
 */

'use client'

import { useEffect } from 'react'
import { AppError } from '@/_types/error.types'
import { logError } from '@/_lib/errorUtils'

interface GlobalErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    // 에러 로깅
    logError(error, 'Next.js Global Error Page')
  }, [error])

  // AppError에서 사용자 친화적 메시지 추출
  const appError = error instanceof AppError ? error : null
  const userMessage = appError?.userMessage || '예상치 못한 오류가 발생했습니다.'

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '1.5rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            심각한 문제가 발생했습니다
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem', maxWidth: '500px' }}>
            {userMessage}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'white',
                backgroundColor: '#6366f1',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#333',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              홈으로 이동
            </button>
          </div>

          {/* 개발 환경에서만 디버그 정보 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <details
              style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
                maxWidth: '800px',
                textAlign: 'left',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: '0.5rem' }}>
                개발자 정보 (개발 환경에서만 표시)
              </summary>
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
                <pre
                  style={{
                    margin: '0.5rem 0 0 0',
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '0.25rem',
                    overflow: 'auto',
                    fontSize: '0.875rem',
                  }}
                >
                  {error.stack}
                </pre>
              </div>
            </details>
          )}
        </div>
      </body>
    </html>
  )
}
