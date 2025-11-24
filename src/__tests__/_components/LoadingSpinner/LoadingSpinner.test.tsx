/**
 * Unit Tests for LoadingSpinner Component
 *
 * TDD 접근: 컴포넌트 구현 전 테스트 작성
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingSpinner from '@/app/_components/LoadingSpinner/LoadingSpinner'

describe('LoadingSpinner', () => {
  // 스피너가 렌더링되어야 함
  it('should render spinner', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
  })

  // 스피너가 올바른 aria-label을 가져야 함
  it('should have correct aria-label', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByLabelText(/loading/i)
    expect(spinner).toBeInTheDocument()
  })

  // 커스텀 사이즈를 지원해야 함
  it('should support custom size', () => {
    render(<LoadingSpinner size="large" />)

    const spinner = screen.getByTestId('loading-spinner')
    const circle = spinner.querySelector('div')
    expect(circle).toHaveStyle({ width: '32px', height: '32px' })
  })

  // 기본 사이즈는 medium이어야 함
  it('should have medium size by default', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByTestId('loading-spinner')
    const circle = spinner.querySelector('div')
    expect(circle).toHaveStyle({ width: '24px', height: '24px' })
  })

  // small 사이즈를 지원해야 함
  it('should support small size', () => {
    render(<LoadingSpinner size="small" />)

    const spinner = screen.getByTestId('loading-spinner')
    const circle = spinner.querySelector('div')
    expect(circle).toHaveStyle({ width: '16px', height: '16px' })
  })

  // 테스트 ID를 포함해야 함
  it('should include test id', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
  })
})
