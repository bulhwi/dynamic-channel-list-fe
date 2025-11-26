/**
 * Type Definitions Index
 *
 * Central export point for all type definitions.
 * Import types from this file for better organization.
 *
 * @example
 * ```typescript
 * import type { Channel, ChannelListProps } from '@/_types'
 * ```
 */

// Channel types
export type { Channel } from './channel.types'

// Component types
export type {
  BaseComponentProps,
  ChannelItemProps,
  ChannelListProps,
  CreateChannelButtonProps,
  LoadingIndicatorProps,
  ErrorMessageProps,
} from './component.types'

// Error types
export { ErrorType, AppError } from './error.types'

// Sendbird error codes
export {
  SendbirdClientErrorCode,
  SendbirdServerErrorCode,
  SENDBIRD_ERROR_MESSAGES,
  isSendbirdError,
  getSendbirdErrorMessage,
} from './sendbirdError.types'
export type { SendbirdErrorCode, SendbirdErrorObject } from './sendbirdError.types'
