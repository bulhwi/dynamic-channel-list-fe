/**
 * Unit Tests for CreateChannelButton Component
 *
 * TDD 접근: 컴포넌트 구현 전 테스트 작성
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CreateChannelButton from '@/components/CreateChannelButton/CreateChannelButton'

describe('CreateChannelButton', () => {
  // 버튼이 렌더링되어야 함
  it('should render button with text', () => {
    const mockOnClick = jest.fn()
    render(<CreateChannelButton onClick={mockOnClick} />)

    expect(screen.getByRole('button', { name: /create channel/i })).toBeInTheDocument()
  })

  // 클릭 시 onClick 핸들러가 호출되어야 함
  it('should call onClick handler when clicked', () => {
    const mockOnClick = jest.fn()
    render(<CreateChannelButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  // 로딩 중일 때 버튼이 비활성화되어야 함
  it('should be disabled when loading', () => {
    const mockOnClick = jest.fn()
    render(<CreateChannelButton onClick={mockOnClick} isLoading={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  // 로딩 중일 때 로딩 텍스트가 표시되어야 함
  it('should show loading text when loading', () => {
    const mockOnClick = jest.fn()
    render(<CreateChannelButton onClick={mockOnClick} isLoading={true} />)

    expect(screen.getByText(/creating/i)).toBeInTheDocument()
  })

  // 로딩 중일 때 클릭이 호출되지 않아야 함
  it('should not call onClick when loading', () => {
    const mockOnClick = jest.fn()
    render(<CreateChannelButton onClick={mockOnClick} isLoading={true} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  // 에러가 있을 때 에러 메시지가 표시되어야 함
  it('should show error message when error prop is provided', () => {
    const mockOnClick = jest.fn()
    const errorMessage = 'Failed to create channel'
    render(<CreateChannelButton onClick={mockOnClick} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  // 에러가 있어도 버튼은 활성화되어야 함 (재시도 가능)
  it('should keep button enabled when error is shown', () => {
    const mockOnClick = jest.fn()
    render(<CreateChannelButton onClick={mockOnClick} error="Some error" />)

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  // 에러 메시지는 에러 스타일을 가져야 함
  it('should have error styling when error is shown', () => {
    const mockOnClick = jest.fn()
    render(<CreateChannelButton onClick={mockOnClick} error="Some error" />)

    const errorMessage = screen.getByText('Some error')
    expect(errorMessage).toHaveClass('error')
  })

  // 로딩과 에러가 동시에 있을 때 로딩 상태가 우선되어야 함
  it('should prioritize loading state over error state', () => {
    const mockOnClick = jest.fn()
    render(<CreateChannelButton onClick={mockOnClick} isLoading={true} error="Some error" />)

    expect(screen.getByText(/creating/i)).toBeInTheDocument()
    expect(screen.queryByText('Some error')).not.toBeInTheDocument()
  })

  // 성공 후 버튼이 정상 상태로 돌아와야 함
  it('should return to normal state after successful creation', () => {
    const mockOnClick = jest.fn()
    const { rerender } = render(<CreateChannelButton onClick={mockOnClick} isLoading={true} />)

    expect(screen.getByText(/creating/i)).toBeInTheDocument()

    // 로딩 완료 후 재렌더링
    rerender(<CreateChannelButton onClick={mockOnClick} isLoading={false} />)

    expect(screen.getByText(/create channel/i)).toBeInTheDocument()
    expect(screen.queryByText(/creating/i)).not.toBeInTheDocument()
  })
})
