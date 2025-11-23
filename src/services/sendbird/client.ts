/**
 * Sendbird Client Service
 *
 * Provides singleton access to Sendbird SDK instance with initialization,
 * connection, and disconnection logic.
 */

import SendbirdChat from '@sendbird/chat'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'
import type { SendbirdChatWith, User } from '@sendbird/chat'

// Singleton instance
let sendbirdInstance: SendbirdChatWith<[GroupChannelModule]> | null = null

/**
 * Initializes the Sendbird SDK with required configuration.
 *
 * Uses singleton pattern to ensure only one instance exists.
 * **IMPORTANT**: localCacheEnabled is set to false as per assignment requirements.
 *
 * @returns {SendbirdChatWith<[GroupChannelModule]>} The initialized Sendbird instance
 * @throws {Error} When NEXT_PUBLIC_SENDBIRD_APP_ID environment variable is missing
 *
 * @example
 * ```typescript
 * const sendbird = initializeSendbird()
 * ```
 */
export function initializeSendbird(): SendbirdChatWith<[GroupChannelModule]> {
  // Return existing instance if already initialized
  if (sendbirdInstance) {
    return sendbirdInstance
  }

  // Validate environment variable
  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID

  if (!appId) {
    throw new Error('NEXT_PUBLIC_SENDBIRD_APP_ID environment variable is required')
  }

  // Initialize Sendbird with required configuration
  sendbirdInstance = SendbirdChat.init({
    appId,
    localCacheEnabled: false, // REQUIRED by assignment
    modules: [new GroupChannelModule()],
  })

  return sendbirdInstance
}

/**
 * Connects a user to Sendbird.
 *
 * Must call initializeSendbird() before connecting.
 *
 * @param {string} userId - Unique user identifier
 * @param {string} [accessToken] - Optional access token for authenticated users
 * @returns {Promise<User>} The connected user object
 * @throws {Error} When Sendbird is not initialized or userId is missing
 *
 * @example
 * ```typescript
 * const user = await connectUser('user-123', 'optional-token')
 * console.log('Connected:', user.userId)
 * ```
 */
export async function connectUser(userId: string, accessToken?: string): Promise<User> {
  // Validate userId
  if (!userId || userId.trim() === '') {
    throw new Error('userId is required')
  }

  // Ensure Sendbird is initialized
  const instance = getSendbirdInstance()
  if (!instance) {
    throw new Error('Sendbird is not initialized. Call initializeSendbird() first.')
  }

  try {
    // Connect user with or without token
    const user = await instance.connect(userId, accessToken)
    return user
  } catch (error) {
    // Re-throw with original error message
    throw error
  }
}

/**
 * Disconnects the current user from Sendbird.
 *
 * @returns {Promise<void>}
 * @throws {Error} When Sendbird is not initialized
 *
 * @example
 * ```typescript
 * await disconnectUser()
 * console.log('User disconnected')
 * ```
 */
export async function disconnectUser(): Promise<void> {
  const instance = getSendbirdInstance()
  if (!instance) {
    throw new Error('Sendbird is not initialized')
  }

  await instance.disconnect()
}

/**
 * Gets the current Sendbird instance.
 *
 * @returns {SendbirdChatWith<[GroupChannelModule]> | null} The Sendbird instance or null if not initialized
 *
 * @example
 * ```typescript
 * const sendbird = getSendbirdInstance()
 * if (sendbird) {
 *   console.log('Sendbird is ready')
 * }
 * ```
 */
export function getSendbirdInstance(): SendbirdChatWith<[GroupChannelModule]> | null {
  return sendbirdInstance
}

/**
 * Resets the Sendbird instance (for testing purposes).
 *
 * @internal
 */
export function _resetSendbirdInstance(): void {
  sendbirdInstance = null
}
