/**
 * Sendbird SDK Type Definitions
 *
 * Type definitions for Sendbird SDK interactions.
 * These types provide type safety when working with the Sendbird SDK.
 */

import type { Channel } from './channel.types'

/**
 * Sendbird initialization configuration
 *
 * @interface SendbirdConfig
 * @property {string} appId - Sendbird application ID
 * @property {boolean} localCacheEnabled - Must be false per assignment requirements
 */
export interface SendbirdConfig {
  appId: string
  localCacheEnabled: false // Must be false per requirements
}

/**
 * Sendbird connection parameters
 *
 * @interface SendbirdConnectionParams
 * @property {string} userId - User ID to connect with
 * @property {string} [accessToken] - Optional access token for authentication
 */
export interface SendbirdConnectionParams {
  userId: string
  accessToken?: string
}

/**
 * Sendbird channel query parameters
 *
 * @interface SendbirdChannelQuery
 * @property {number} limit - Number of channels to fetch
 * @property {boolean} includeEmpty - Whether to include empty channels
 * @property {'latest_last_message' | 'chronological' | 'channel_name_alphabetical'} order - Sort order
 */
export interface SendbirdChannelQuery {
  limit: number
  includeEmpty: boolean
  order: 'latest_last_message' | 'chronological' | 'channel_name_alphabetical'
}

/**
 * Convert Sendbird GroupChannel to our Channel interface
 *
 * @param {unknown} groupChannel - Sendbird GroupChannel object
 * @returns {Channel} Normalized channel object
 */
export type SendbirdChannelAdapter = (groupChannel: unknown) => Channel

/**
 * Sendbird SDK error
 *
 * @interface SendbirdError
 * @property {number} code - Error code
 * @property {string} message - Error message
 */
export interface SendbirdError {
  code: number
  message: string
}

/**
 * Result type for Sendbird operations
 *
 * @template T - Success data type
 */
export type SendbirdResult<T> =
  | { success: true; data: T }
  | { success: false; error: SendbirdError }
