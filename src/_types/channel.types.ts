/**
 * Channel Type Definitions
 *
 * Core types for channel data and operations.
 * Based on Sendbird SDK GroupChannel structure but simplified for our needs.
 */

/**
 * Represents a chat channel
 *
 * @interface Channel
 * @property {string} url - Unique identifier for the channel
 * @property {string} name - Display name of the channel
 * @property {number} createdAt - Unix timestamp (milliseconds) when channel was created
 * @property {string} [customType] - Optional custom type for categorization
 * @property {string} [data] - Optional JSON string for custom metadata
 */
export interface Channel {
  url: string
  name: string
  createdAt: number
  customType?: string
  data?: string
}
