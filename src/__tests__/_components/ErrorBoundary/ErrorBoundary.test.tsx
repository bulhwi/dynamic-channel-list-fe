/**
 * ErrorBoundary Tests
 *
 * React ErrorBoundary 컴포넌트 테스트
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ErrorBoundary } from '@/app/_components/ErrorBoundary/ErrorBoundary'
import { AppError, ErrorType } from '@/_types/error.types'

// logError mock
jest.mock('@/_lib/errorUtils', () => ({
  logError: jest.fn(),
}))

// 에러를 발생시키는 테스트용 컴포넌트
function ThrowError({ error }: { error: Error }) {
  throw error
}

// 정상 동작 컴포넌트
function NormalComponent() {
  return <div>정상 컴포넌트</div>
}

describe('ErrorBoundary', () => {
  // console.error 억제
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  // 에러가 없을 때 자식 컴포넌트를 렌더링해야 함
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('정상 컴포넌트')).toBeInTheDocument()
  })

  // 에러 발생 시 폴백 UI를 렌더링해야 함
  it('should render fallback UI when error occurs', () => {
    const error = new Error('Test error')

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    )

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument()
    expect(screen.getByText('예상치 못한 오류가 발생했습니다.')).toBeInTheDocument()
  })

  // AppError의 사용자 메시지를 렌더링해야 함
  it('should render user message from AppError', () => {
    const appError = new AppError(
      ErrorType.CHANNEL_FETCH_FAILED,
      '채널 목록을 불러올 수 없습니다.',
      'Technical error'
    )

    render(
      <ErrorBoundary>
        <ThrowError error={appError} />
      </ErrorBoundary>
    )

    expect(screen.getByText('채널 목록을 불러올 수 없습니다.')).toBeInTheDocument()
  })

  // 다시 시도 버튼 클릭 시 에러 상태가 초기화되어야 함
  it('should reset error state when retry button is clicked', () => {
    let shouldThrow = true
    function ConditionalError() {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return <div>복구됨</div>
    }

    render(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    )

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument()

    // 에러를 발생시키지 않도록 설정
    shouldThrow = false

    fireEvent.click(screen.getByText('다시 시도'))

    expect(screen.getByText('복구됨')).toBeInTheDocument()
  })

  // 홈으로 이동 버튼 클릭 시 홈으로 이동해야 함
  it('should navigate to home when home button is clicked', () => {
    const error = new Error('Test error')
    const originalLocation = window.location

    // @ts-ignore
    delete window.location
    window.location = { href: '' } as Location

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    )

    fireEvent.click(screen.getByText('홈으로 이동'))

    expect(window.location.href).toContain('/')

    window.location = originalLocation
  })

  // 개발 모드에서 디버그 정보를 표시해야 함
  it('should show debug info in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    // @ts-ignore
    process.env.NODE_ENV = 'development'

    const error = new Error('Debug test error')
    error.stack = 'Test stack trace'

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    )

    expect(screen.getByText('개발자 정보 (개발 환경에서만 표시)')).toBeInTheDocument()

    // @ts-ignore
    process.env.NODE_ENV = originalEnv
  })

  // 디버그 정보에 AppError 타입과 코드를 표시해야 함
  it('should show AppError type and code in debug info', () => {
    const originalEnv = process.env.NODE_ENV
    // @ts-ignore
    process.env.NODE_ENV = 'development'

    const appError = new AppError(
      ErrorType.SENDBIRD_INIT_FAILED,
      'SDK 오류',
      'SDK initialization failed',
      undefined,
      900100
    )

    const { container } = render(
      <ErrorBoundary>
        <ThrowError error={appError} />
      </ErrorBoundary>
    )

    // details 요소 내 텍스트 확인
    const debugInfo = container.querySelector('details')
    expect(debugInfo).toBeInTheDocument()
    expect(debugInfo?.textContent).toContain('SENDBIRD_INIT_FAILED')
    expect(debugInfo?.textContent).toContain('900100')
    expect(debugInfo?.textContent).toContain('SDK initialization failed')

    // @ts-ignore
    process.env.NODE_ENV = originalEnv
  })

  // 커스텀 fallback이 제공되면 사용해야 함
  it('should use custom fallback when provided', () => {
    const error = new Error('Test error')
    const customFallback = (_error: Error, _reset: () => void) => <div>커스텀 에러 UI</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError error={error} />
      </ErrorBoundary>
    )

    expect(screen.getByText('커스텀 에러 UI')).toBeInTheDocument()
  })
})
