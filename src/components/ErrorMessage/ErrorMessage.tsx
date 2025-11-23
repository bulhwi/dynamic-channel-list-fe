/**
 * ErrorMessage 컴포넌트
 *
 * 에러 상태를 사용자 친화적으로 표시하는 컴포넌트입니다.
 */

import styles from './ErrorMessage.module.css'

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
const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className={styles.container} role="alert" data-testid="error-message">
      <div className={styles.icon}>⚠️</div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton} type="button">
          다시 시도
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
