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

/**
 * Response from channel list API with pagination
 *
 * @interface ChannelListResponse
 * @property {Channel[]} channels - Array of channel objects
 * @property {boolean} hasMore - Whether there are more channels to load
 * @property {string} [token] - Pagination token for next page
 */
export interface ChannelListResponse {
  channels: Channel[]
  hasMore: boolean
  token?: string
}

/**
 * Parameters for creating a new channel
 *
 * @interface CreateChannelParams
 * @property {string} name - Name for the new channel (optional, will be auto-generated if not provided)
 * @property {string} [customType] - Custom type for categorization
 * @property {Record<string, unknown>} [data] - Custom metadata as key-value pairs
 */
export interface CreateChannelParams {
  name?: string
  customType?: string
  data?: Record<string, unknown>
}

/**
 * Parameters for updating a channel
 *
 * @interface UpdateChannelParams
 * @property {string} url - Channel URL to update
 * @property {string} [name] - New name (optional)
 * @property {string} [customType] - New custom type (optional)
 * @property {Record<string, unknown>} [data] - New metadata (optional)
 */
export interface UpdateChannelParams {
  url: string
  name?: string
  customType?: string
  data?: Record<string, unknown>
}

/**
 * Sorting options for channel list
 */
export type ChannelSortOrder = 'latest' | 'chronological' | 'alphabetical'

/**
 * Filter options for channel list query
 *
 * @interface ChannelFilterOptions
 * @property {string} [customType] - Filter by custom type
 * @property {ChannelSortOrder} [order] - Sort order (default: 'latest')
 * @property {number} [limit] - Number of channels per page (default: 20)
 */
export interface ChannelFilterOptions {
  customType?: string
  order?: ChannelSortOrder
  limit?: number
}
