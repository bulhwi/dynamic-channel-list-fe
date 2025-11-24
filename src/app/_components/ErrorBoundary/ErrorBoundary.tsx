/**
 * Error Boundary 컴포넌트
 *
 * React 컴포넌트 트리 내에서 발생한 에러를 캐치하고
 * 사용자 친화적인 fallback UI를 표시합니다.
 */

'use client'

import { Component, ReactNode } from 'react'
import { AppError } from '@/_types/error.types'
import { logError } from '@/_lib/errorUtils'
import * as S from './ErrorBoundary.style'

interface ErrorBoundaryProps {
  /** Error Boundary로 감쌀 자식 컴포넌트 */
  children: ReactNode
  /** 커스텀 fallback UI (선택사항) */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  /** 에러 발생 여부 */
  hasError: boolean
  /** 발생한 에러 객체 */
  error: Error | null
}

/**
 * React Error Boundary
 *
 * 컴포넌트 트리 내에서 발생한 JavaScript 에러를 캐치하고
 * 앱 전체가 크래시되는 것을 방지합니다.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 fallback UI 사용
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>오류: {error.message}</p>
 *       <button onClick={reset}>재시도</button>
 *     </div>
 *   )}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  /**
   * 에러 발생 시 상태 업데이트
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /**
   * 에러 로깅
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 (개발 환경: console, 프로덕션: Sentry 등)
    logError(error, 'ErrorBoundary')

    // 추가 정보 로깅 (개발 환경만)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Info:', errorInfo)
    }
  }

  /**
   * 에러 상태 리셋 (재시도)
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  /**
   * 홈으로 이동
   */
  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // 커스텀 fallback이 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset)
      }

      // AppError에서 사용자 친화적 메시지 추출
      const appError = this.state.error instanceof AppError ? this.state.error : null
      const userMessage = appError?.userMessage || '예상치 못한 오류가 발생했습니다.'

      // 기본 fallback UI
      return (
        <S.Container>
          <S.Icon>⚠️</S.Icon>
          <S.Title>문제가 발생했습니다</S.Title>
          <S.Message>{userMessage}</S.Message>

          <S.ButtonGroup>
            <S.Button onClick={this.handleReset}>다시 시도</S.Button>
            <S.Button onClick={this.handleGoHome} $variant="secondary">
              홈으로 이동
            </S.Button>
          </S.ButtonGroup>

          {/* 개발 환경에서만 디버그 정보 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <S.DebugInfo>
              <summary>개발자 정보 (개발 환경에서만 표시)</summary>
              <div>
                <p>
                  <strong>Error Type:</strong> {appError ? appError.type : this.state.error.name}
                </p>
                <p>
                  <strong>Technical Message:</strong>{' '}
                  {appError?.technicalMessage || this.state.error.message}
                </p>
                <p>
                  <strong>Stack Trace:</strong>
                </p>
                <pre>{this.state.error.stack}</pre>
              </div>
            </S.DebugInfo>
          )}
        </S.Container>
      )
    }

    // 에러가 없으면 자식 컴포넌트 렌더링
    return this.props.children
  }
}
