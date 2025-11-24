/**
 * ErrorMessage 컴포넌트
 *
 * 에러 상태를 사용자 친화적으로 표시하는 컴포넌트입니다.
 *
 * React.memo로 최적화: props가 변경되지 않으면 리렌더링 방지
 */

import { memo } from 'react'
import * as S from './ErrorMessage.style'

export interface ErrorMessageProps {
  /** 표시할 에러 메시지 */
  message: string
  /** 재시도 핸들러 (선택사항) */
  onRetry?: () => void
}

/**
 * 에러 메시지와 선택적 재시도 버튼을 표시하는 컴포넌트입니다.
 *
 * @param {ErrorMessageProps} props - 컴포넌트 props
 *
 * @example
 * ```tsx
 * <ErrorMessage message="Failed to load data" onRetry={handleRetry} />
 * ```
 */
const ErrorMessage = memo(({ message, onRetry }: ErrorMessageProps) => {
  return (
    <S.Container role="alert" data-testid="error-message">
      <S.Icon>⚠️</S.Icon>
      <S.Message>{message}</S.Message>
      {onRetry && (
        <S.RetryButton onClick={onRetry} type="button">
          다시 시도
        </S.RetryButton>
      )}
    </S.Container>
  )
})

ErrorMessage.displayName = 'ErrorMessage'

export default ErrorMessage
