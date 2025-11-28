/**
 * Error Page Tests
 *
 * Next.js error.tsx 컴포넌트 테스트
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorPage from '@/app/error'
import { AppError, ErrorType } from '@/_types/error.types'

// logError mock
jest.mock('@/_lib/errorUtils', () => ({
  logError: jest.fn(),
}))

describe('ErrorPage', () => {
  const mockReset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // 일반 에러에 대해 기본 메시지로 에러 페이지를 렌더링해야 함
  it('should render error page with default message for generic error', () => {
    const error = new Error('Test error')

    render(<ErrorPage error={error} reset={mockReset} />)

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument()
    expect(screen.getByText('예상치 못한 오류가 발생했습니다.')).toBeInTheDocument()
    expect(screen.getByText('다시 시도')).toBeInTheDocument()
    expect(screen.getByText('홈으로 이동')).toBeInTheDocument()
  })

  // AppError의 사용자 메시지를 렌더링해야 함
  it('should render user message from AppError', () => {
    const appError = new AppError(
      ErrorType.CHANNEL_CREATE_FAILED,
      '채널 생성에 실패했습니다.',
      'Technical error message'
    )

    render(<ErrorPage error={appError} reset={mockReset} />)

    expect(screen.getByText('채널 생성에 실패했습니다.')).toBeInTheDocument()
  })

  // 다시 시도 버튼 클릭 시 reset을 호출해야 함
  it('should call reset when retry button is clicked', () => {
    const error = new Error('Test error')

    render(<ErrorPage error={error} reset={mockReset} />)

    fireEvent.click(screen.getByText('다시 시도'))

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  // 홈으로 이동 버튼 클릭 시 홈으로 이동해야 함
  it('should navigate to home when home button is clicked', () => {
    const error = new Error('Test error')
    const originalLocation = window.location

    // @ts-ignore
    delete window.location
    window.location = { href: '' } as Location

    render(<ErrorPage error={error} reset={mockReset} />)

    fireEvent.click(screen.getByText('홈으로 이동'))

    expect(window.location.href).toContain('/')

    window.location = originalLocation
  })

  // 개발 모드에서 디버그 정보를 표시해야 함
  it('should show debug info in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    // @ts-ignore
    process.env.NODE_ENV = 'development'

    const error = new Error('Test error')
    error.stack = 'Test stack trace'

    render(<ErrorPage error={error} reset={mockReset} />)

    expect(screen.getByText('개발자 정보 (개발 환경에서만 표시)')).toBeInTheDocument()

    // @ts-ignore
    process.env.NODE_ENV = originalEnv
  })

  // 디버그 정보에 AppError 세부사항을 표시해야 함
  it('should show AppError details in debug info', () => {
    const originalEnv = process.env.NODE_ENV
    // @ts-ignore
    process.env.NODE_ENV = 'development'

    const appError = new AppError(
      ErrorType.SENDBIRD_INIT_FAILED,
      '사용자 메시지',
      'Technical message',
      undefined,
      900100
    )

    const { container } = render(<ErrorPage error={appError} reset={mockReset} />)

    // details 요소 내 텍스트 확인
    const debugInfo = container.querySelector('details')
    expect(debugInfo).toBeInTheDocument()
    expect(debugInfo?.textContent).toContain('SENDBIRD_INIT_FAILED')
    expect(debugInfo?.textContent).toContain('900100')
    expect(debugInfo?.textContent).toContain('Technical message')

    // @ts-ignore
    process.env.NODE_ENV = originalEnv
  })

  // digest가 있을 때 디버그 정보에 표시해야 함
  it('should show digest in debug info when available', () => {
    const originalEnv = process.env.NODE_ENV
    // @ts-ignore
    process.env.NODE_ENV = 'development'

    const error = new Error('Test error') as Error & { digest?: string }
    error.digest = 'abc123'

    const { container } = render(<ErrorPage error={error} reset={mockReset} />)

    const debugInfo = container.querySelector('details')
    expect(debugInfo).toBeInTheDocument()
    expect(debugInfo?.textContent).toContain('abc123')

    // @ts-ignore
    process.env.NODE_ENV = originalEnv
  })
})
