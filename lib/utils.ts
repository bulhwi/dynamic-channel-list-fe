/**
 * Utility Functions
 *
 * Collection of reusable utility functions for the application.
 */

/**
 * Generates a random 8-letter lowercase English string.
 *
 * Used for creating random channel names when no custom name is provided.
 *
 * @returns {string} An 8-character string containing only lowercase letters (a-z)
 *
 * @example
 * ```typescript
 * const channelName = generateRandomName()
 * // Returns something like: "xkqpmwjd"
 * ```
 */
export function generateRandomName(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  let result = ''

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length)
    result += letters[randomIndex]
  }

  return result
}
