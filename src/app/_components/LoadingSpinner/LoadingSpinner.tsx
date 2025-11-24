/**
 * LoadingSpinner 컴포넌트
 *
 * 로딩 상태를 시각적으로 표시하는 스피너 컴포넌트입니다.
 *
 * React.memo로 최적화: props가 변경되지 않으면 리렌더링 방지
 */

import { memo } from 'react'
import type { Size } from '@/_styles/common.style'
import * as S from './LoadingSpinner.style'

export interface LoadingSpinnerProps {
  /** 스피너 크기 */
  size?: Size
}

/**
 * 로딩 스피너를 표시하는 컴포넌트입니다.
 *
 * @param {LoadingSpinnerProps} props - 컴포넌트 props
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="medium" />
 * ```
 */
const LoadingSpinner = memo(({ size = 'medium' }: LoadingSpinnerProps) => {
  return (
    <S.SpinnerContainer role="status" aria-label="Loading" data-testid="loading-spinner">
      <S.Circle $size={size} />
    </S.SpinnerContainer>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner
