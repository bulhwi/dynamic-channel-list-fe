/**
 * CreateChannelButton 컴포넌트
 *
 * 채널 생성 버튼 컴포넌트
 * 로딩 상태와 에러 메시지를 표시합니다.
 *
 * React.memo로 최적화: props가 변경되지 않으면 리렌더링 방지
 */

import { memo } from 'react'
import LoadingSpinner from '@/app/_components/LoadingSpinner/LoadingSpinner'
import ErrorMessage from '@/app/_components/ErrorMessage/ErrorMessage'
import * as S from './CreateChannelButton.style'

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
const CreateChannelButton = memo(
  ({ onClick, isLoading = false, error, onRetry }: CreateChannelButtonProps) => {
    return (
      <S.Container>
        <S.Button type="button" onClick={onClick} disabled={isLoading} $isLoading={isLoading}>
          {isLoading && (
            <S.LoadingContent>
              <LoadingSpinner size="small" />
              <S.LoadingText>Creating...</S.LoadingText>
            </S.LoadingContent>
          )}
          {!isLoading && 'Create Channel'}
        </S.Button>
        {!isLoading && error && (
          <S.ErrorWrapper>
            <ErrorMessage message={error} onRetry={onRetry} />
          </S.ErrorWrapper>
        )}
      </S.Container>
    )
  }
)

CreateChannelButton.displayName = 'CreateChannelButton'

export default CreateChannelButton
