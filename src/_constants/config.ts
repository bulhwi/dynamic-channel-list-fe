/**
 * 애플리케이션 전역 상수 설정
 *
 * 매직 넘버를 방지하고 일관된 설정 관리를 위한 상수 정의
 * 모든 하드코딩된 숫자 값은 이 파일에서 관리됩니다.
 *
 * @example
 * ```typescript
 * import { CHANNEL_CONFIG } from '@/_constants/config'
 *
 * const limit = CHANNEL_CONFIG.DEFAULT_PAGE_SIZE
 * ```
 */

/**
 * 채널 관련 설정
 */
export const CHANNEL_CONFIG = {
  /** 채널 목록 기본 페이지 크기 */
  DEFAULT_PAGE_SIZE: 10,
  /** 랜덤 채널 이름 생성 시 문자열 길이 */
  RANDOM_NAME_LENGTH: 8,
} as const

/**
 * React Query 캐싱 및 재시도 설정
 */
export const QUERY_CONFIG = {
  /** 데이터가 stale 상태가 되기까지의 시간 (밀리초) */
  STALE_TIME_MS: 60 * 1000, // 1분
  /** 요청 실패 시 재시도 횟수 */
  RETRY_COUNT: 1,
} as const

/**
 * Infinite Scroll 설정
 */
export const SCROLL_CONFIG = {
  /** IntersectionObserver rootMargin (하단 감지 시작 거리) */
  ROOT_MARGIN: '100px',
  /** IntersectionObserver threshold (요소가 보이는 비율) */
  THRESHOLD: 1.0,
} as const

/**
 * 애니메이션 설정
 */
export const ANIMATION_CONFIG = {
  /** 채널 아이템 애니메이션 지속 시간 (밀리초) */
  DURATION_MS: 400,
  /** 애니메이션 이징 함수 */
  EASING: 'ease-in-out',
} as const
