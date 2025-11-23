/**
 * Type Definitions Index
 *
 * Central export point for all type definitions.
 * Import types from this file for better organization.
 *
 * @example
 * ```typescript
 * import type { Channel, ChannelListProps } from '@/types'
 * ```
 */

// Channel types
export type {
  Channel,
  ChannelListResponse,
  CreateChannelParams,
  UpdateChannelParams,
  ChannelSortOrder,
  ChannelFilterOptions,
} from './channel.types'

// Sendbird types
export type {
  SendbirdConfig,
  SendbirdConnectionParams,
  SendbirdChannelQuery,
  SendbirdChannelAdapter,
  SendbirdError,
  SendbirdResult,
} from './sendbird.types'

// Component types
export type {
  BaseComponentProps,
  ChannelItemProps,
  ChannelListProps,
  CreateChannelButtonProps,
  LoadingIndicatorProps,
  ErrorMessageProps,
} from './component.types'