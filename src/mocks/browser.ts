/**
 * MSW Browser Worker Setup
 *
 * Initializes Mock Service Worker for browser environment
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * Setup MSW worker with request handlers
 */
export const worker = setupWorker(...handlers)
