/**
 * Unit Tests for ErrorMessage Component
 *
 * TDD 접근: 컴포넌트 구현 전 테스트 작성
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'

describe('ErrorMessage', () => {
  // 에러 메시지가 렌더링되어야 함
  it('should render error message', () => {
    render(<ErrorMessage message="Something went wrong" />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  // alert role을 가져야 함
  it('should have alert role', () => {
    render(<ErrorMessage message="Error" />)

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
  })

  // 에러 아이콘을 표시해야 함
  it('should display error icon', () => {
    render(<ErrorMessage message="Error" />)

    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })

  // onRetry가 제공되면 재시도 버튼을 표시해야 함
  it('should display retry button when onRetry is provided', () => {
    const mockRetry = jest.fn()
    render(<ErrorMessage message="Error" onRetry={mockRetry} />)

    const retryButton = screen.getByRole('button', { name: /다시 시도/i })
    expect(retryButton).toBeInTheDocument()
  })

  // onRetry가 없으면 재시도 버튼을 표시하지 않아야 함
  it('should not display retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />)

    const retryButton = screen.queryByRole('button', { name: /다시 시도/i })
    expect(retryButton).not.toBeInTheDocument()
  })

  // 재시도 버튼 클릭 시 onRetry를 호출해야 함
  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup()
    const mockRetry = jest.fn()
    render(<ErrorMessage message="Error" onRetry={mockRetry} />)

    const retryButton = screen.getByRole('button', { name: /다시 시도/i })
    await user.click(retryButton)

    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  // 여러 번 클릭해도 각각 호출되어야 함
  it('should call onRetry multiple times when button is clicked multiple times', async () => {
    const user = userEvent.setup()
    const mockRetry = jest.fn()
    render(<ErrorMessage message="Error" onRetry={mockRetry} />)

    const retryButton = screen.getByRole('button', { name: /다시 시도/i })
    await user.click(retryButton)
    await user.click(retryButton)
    await user.click(retryButton)

    expect(mockRetry).toHaveBeenCalledTimes(3)
  })

  // 테스트 ID를 포함해야 함
  it('should include test id', () => {
    render(<ErrorMessage message="Error" />)

    const errorMessage = screen.getByTestId('error-message')
    expect(errorMessage).toBeInTheDocument()
  })

  // 긴 에러 메시지도 올바르게 렌더링되어야 함
  it('should render long error messages correctly', () => {
    const longMessage =
      'This is a very long error message that should be displayed correctly in the UI without breaking the layout or causing any issues.'
    render(<ErrorMessage message={longMessage} />)

    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })
})
