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

// 채널 타입
export type { Channel } from './channel.types'

// 컴포넌트 타입
export type {
  BaseComponentProps,
  ChannelItemProps,
  ChannelListProps,
  CreateChannelButtonProps,
  LoadingIndicatorProps,
  ErrorMessageProps,
} from './component.types'

// 에러 타입
export { ErrorType, AppError } from './error.types'

// Sendbird 에러 코드
export {
  SendbirdClientErrorCode,
  SendbirdServerErrorCode,
  SENDBIRD_ERROR_MESSAGES,
  isSendbirdError,
  getSendbirdErrorMessage,
} from './sendbirdError.types'
export type { SendbirdErrorCode, SendbirdErrorObject } from './sendbirdError.types'
