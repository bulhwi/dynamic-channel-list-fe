/**
 * MSW 브라우저 워커 설정
 *
 * 브라우저 환경을 위한 Mock Service Worker 초기화
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * 요청 핸들러와 함께 MSW 워커 설정
 */
export const worker = setupWorker(...handlers)
