/**
 * Component Props Type Definitions
 *
 * Shared type definitions for React component props.
 */

import type { Channel } from './channel.types'

/**
 * Base props that all components should extend
 *
 * @interface BaseComponentProps
 * @property {string} [className] - Additional CSS classes
 * @property {string} [testId] - Test ID for testing library
 */
export interface BaseComponentProps {
  className?: string
  testId?: string
}

/**
 * Props for ChannelItem component
 *
 * @interface ChannelItemProps
 * @property {Channel} channel - Channel data to display
 * @property {boolean} [isHovered] - Whether the item is currently hovered
 * @property {() => void} [onClick] - Click handler
 * @property {(url: string) => void} [onUpdate] - Update handler
 */
export interface ChannelItemProps extends BaseComponentProps {
  channel: Channel
  isHovered?: boolean
  onClick?: () => void
  onUpdate?: (url: string) => void
}

/**
 * Props for ChannelList component
 *
 * @interface ChannelListProps
 * @property {Channel[]} channels - Array of channels to display
 * @property {boolean} [isLoading] - Whether channels are loading
 * @property {boolean} [hasMore] - Whether there are more channels to load
 * @property {() => void} [onLoadMore] - Load more handler
 * @property {(url: string) => void} [onChannelClick] - Channel click handler
 * @property {(url: string) => void} [onChannelUpdate] - Channel update handler
 * @property {number} [maxHeight] - Maximum height in pixels (default: 10 items)
 */
export interface ChannelListProps extends BaseComponentProps {
  channels: Channel[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onChannelClick?: (url: string) => void
  onChannelUpdate?: (url: string) => void
  maxHeight?: number
}

/**
 * Props for CreateChannelButton component
 *
 * @interface CreateChannelButtonProps
 * @property {() => void} [onClick] - Click handler
 * @property {boolean} [isLoading] - Whether creation is in progress
 * @property {boolean} [disabled] - Whether button is disabled
 */
export interface CreateChannelButtonProps extends BaseComponentProps {
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
}

/**
 * Props for LoadingIndicator component
 *
 * @interface LoadingIndicatorProps
 * @property {string} [message] - Optional loading message
 * @property {'small' | 'medium' | 'large'} [size] - Size variant
 */
export interface LoadingIndicatorProps extends BaseComponentProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

/**
 * Props for ErrorMessage component
 *
 * @interface ErrorMessageProps
 * @property {string} message - Error message to display
 * @property {() => void} [onRetry] - Optional retry handler
 */
export interface ErrorMessageProps extends BaseComponentProps {
  message: string
  onRetry?: () => void
}