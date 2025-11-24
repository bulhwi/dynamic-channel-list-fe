/**
 * LoadingSpinner 컴포넌트
 *
 * 로딩 상태를 시각적으로 표시하는 스피너 컴포넌트입니다.
 */

import styles from './LoadingSpinner.module.css'

export interface LoadingSpinnerProps {
  /** 스피너 크기 */
  size?: 'small' | 'medium' | 'large'
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
const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  return (
    <div
      className={`${styles.spinner} ${styles[size]}`}
      role="status"
      aria-label="Loading"
      data-testid="loading-spinner"
    >
      <div className={styles.circle}></div>
    </div>
  )
}

export default LoadingSpinner
