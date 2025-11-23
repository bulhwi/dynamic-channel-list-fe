/**
 * Utility Functions
 *
 * Collection of reusable utility functions for the application.
 */

import type { Channel } from '@/types/channel.types'

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

/**
 * Sorts channels alphabetically by name (case-insensitive).
 *
 * Returns a new array without modifying the original.
 * Used for displaying channels in alphabetical order.
 *
 * @param {Channel[]} channels - Array of channels to sort
 * @returns {Channel[]} New array of channels sorted alphabetically by name
 *
 * @example
 * ```typescript
 * const channels = [
 *   { name: 'Zebra', url: 'z', createdAt: 1000 },
 *   { name: 'apple', url: 'a', createdAt: 2000 }
 * ]
 * const sorted = sortChannels(channels)
 * // Returns: [{ name: 'apple', ... }, { name: 'Zebra', ... }]
 * // Original array is unchanged
 * ```
 */
export function sortChannels(channels: Channel[]): Channel[] {
  // Create a shallow copy to avoid mutating the original array
  return [...channels].sort((a, b) => {
    // Case-insensitive comparison
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
}
