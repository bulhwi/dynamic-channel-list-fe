/**
 * Unit Tests for LoadingSpinner Component
 *
 * TDD 접근: 컴포넌트 구현 전 테스트 작성
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'

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
    const { container } = render(<LoadingSpinner size="large" />)

    const spinner = container.firstChild as HTMLElement
    expect(spinner).toHaveClass('large')
  })

  // 기본 사이즈는 medium이어야 함
  it('should have medium size by default', () => {
    const { container } = render(<LoadingSpinner />)

    const spinner = container.firstChild as HTMLElement
    expect(spinner).toHaveClass('medium')
  })

  // small 사이즈를 지원해야 함
  it('should support small size', () => {
    const { container } = render(<LoadingSpinner size="small" />)

    const spinner = container.firstChild as HTMLElement
    expect(spinner).toHaveClass('small')
  })

  // 테스트 ID를 포함해야 함
  it('should include test id', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
  })

  // 스피너 애니메이션 클래스를 가져야 함
  it('should have spinner animation class', () => {
    const { container } = render(<LoadingSpinner />)

    const spinner = container.firstChild as HTMLElement
    expect(spinner).toHaveClass('spinner')
  })
})
