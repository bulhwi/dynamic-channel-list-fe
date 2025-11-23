/**
 * CreateChannelButton 컴포넌트
 *
 * 채널 생성 버튼 컴포넌트
 * 로딩 상태와 에러 메시지를 표시합니다.
 */

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import styles from './CreateChannelButton.module.css'

export interface CreateChannelButtonProps {
  /** 버튼 클릭 핸들러 */
  onClick: () => void
  /** 로딩 상태 */
  isLoading?: boolean
  /** 에러 메시지 */
  error?: string
  /** 재시도 핸들러 (선택사항) */
  onRetry?: () => void
}

/**
 * 채널 생성 버튼 컴포넌트
 *
 * @param {CreateChannelButtonProps} props - 컴포넌트 props
 *
 * @example
 * ```tsx
 * <CreateChannelButton
 *   onClick={handleCreate}
 *   isLoading={isCreating}
 *   error={error?.message}
 *   onRetry={handleRetry}
 * />
 * ```
 */
const CreateChannelButton = ({
  onClick,
  isLoading = false,
  error,
  onRetry,
}: CreateChannelButtonProps) => {
  return (
    <div className={styles.container}>
      <button type="button" onClick={onClick} disabled={isLoading} className={styles.button}>
        {isLoading && (
          <span className={styles.loadingContent}>
            <LoadingSpinner size="small" />
            <span className={styles.loadingText}>Creating...</span>
          </span>
        )}
        {!isLoading && 'Create Channel'}
      </button>
      {!isLoading && error && (
        <div className={styles.errorWrapper}>
          <ErrorMessage message={error} onRetry={onRetry} />
        </div>
      )}
    </div>
  )
}

export default CreateChannelButton
