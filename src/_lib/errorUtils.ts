/**
 * 에러 처리 유틸리티
 *
 * 일관된 에러 처리를 위한 헬퍼 함수들을 제공합니다.
 */

import { AppError, ErrorType } from '@/_types/error.types'
import {
  isSendbirdError,
  getSendbirdErrorMessage,
  SendbirdClientErrorCode,
  SendbirdServerErrorCode,
} from '@/_types/sendbirdError.types'

/**
 * 에러 타입별 사용자 친화적 메시지 매핑
 */
const USER_FRIENDLY_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.SENDBIRD_INIT_FAILED]: '서비스 연결에 실패했습니다. 페이지를 새로고침해주세요.',
  [ErrorType.SENDBIRD_CONNECTION_FAILED]: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorType.CHANNEL_FETCH_FAILED]: '채널 목록을 불러오지 못했습니다.',
  [ErrorType.CHANNEL_CREATE_FAILED]: '채널 생성에 실패했습니다.',
  [ErrorType.CHANNEL_UPDATE_FAILED]: '채널 수정에 실패했습니다.',
  [ErrorType.CHANNEL_NOT_FOUND]: '채널을 찾을 수 없습니다.',
  [ErrorType.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [ErrorType.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  [ErrorType.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.',
}

/**
 * 에러 타입별 사용자 친화적 메시지 반환
 *
 * @param type - 에러 타입
 * @returns 사용자에게 보여줄 메시지 (한글)
 */
function getUserFriendlyMessage(type: ErrorType): string {
  return USER_FRIENDLY_MESSAGES[type]
}

/**
 * Sendbird 에러 코드를 ErrorType으로 매핑
 */
function mapSendbirdCodeToErrorType(code: number, fallbackType: ErrorType): ErrorType {
  // Client Errors (800xxx)
  if (code === SendbirdClientErrorCode.INVALID_INITIALIZATION) {
    return ErrorType.SENDBIRD_INIT_FAILED
  }
  if (
    code === SendbirdClientErrorCode.CONNECTION_REQUIRED ||
    code === SendbirdClientErrorCode.CONNECTION_CANCELED ||
    code === SendbirdClientErrorCode.WEBSOCKET_CONNECTION_CLOSED ||
    code === SendbirdClientErrorCode.WEBSOCKET_CONNECTION_FAILED
  ) {
    return ErrorType.SENDBIRD_CONNECTION_FAILED
  }
  if (
    code === SendbirdClientErrorCode.NETWORK_ERROR ||
    code === SendbirdClientErrorCode.NETWORK_ROUTING_ERROR
  ) {
    return ErrorType.NETWORK_ERROR
  }
  if (
    code === SendbirdClientErrorCode.ACK_TIMEOUT ||
    code === SendbirdClientErrorCode.LOGIN_TIMEOUT
  ) {
    return ErrorType.TIMEOUT_ERROR
  }

  // Server Errors - Channel Not Found
  if (
    code === SendbirdServerErrorCode.RESOURCE_NOT_FOUND ||
    code === SendbirdServerErrorCode.REQUEST_FAILED_CHANNEL_NOT_FOUND
  ) {
    return ErrorType.CHANNEL_NOT_FOUND
  }

  // Server Errors - Network/Connection
  if (
    code === SendbirdServerErrorCode.SERVICE_UNAVAILABLE ||
    code === SendbirdServerErrorCode.WEBSOCKET_CONNECTION_LIMIT_EXCEEDED ||
    code === SendbirdServerErrorCode.TOO_MANY_WEBSOCKET_CONNECTIONS
  ) {
    return ErrorType.NETWORK_ERROR
  }

  // Server Errors - Rate Limit
  if (
    code === SendbirdServerErrorCode.RATE_LIMIT_EXCEEDED ||
    code === SendbirdClientErrorCode.MARK_AS_READ_RATE_LIMIT_EXCEEDED
  ) {
    return ErrorType.TIMEOUT_ERROR
  }

  // 그 외는 fallback 타입 사용
  return fallbackType
}

/**
 * 알 수 없는 에러를 AppError로 변환
 *
 * Sendbird SDK 에러, JavaScript Error, 문자열 등
 * 다양한 형태의 에러를 AppError로 통일합니다.
 *
 * @param error - 변환할 에러 (any type)
 * @param fallbackType - 에러 타입을 알 수 없을 때 사용할 기본 타입
 * @returns AppError 인스턴스
 *
 * @example
 * ```typescript
 * try {
 *   await sendbirdAPI()
 * } catch (error) {
 *   const appError = toAppError(error, ErrorType.CHANNEL_FETCH_FAILED)
 *   throw appError
 * }
 * ```
 */
export function toAppError(error: unknown, fallbackType: ErrorType): AppError {
  // 이미 AppError인 경우 그대로 반환
  if (error instanceof AppError) {
    return error
  }

  // Sendbird 에러 객체인 경우 (공식 에러 코드 사용)
  if (isSendbirdError(error)) {
    // isSendbirdError 타입 가드가 error.code가 number임을 보장
    const errorCode = error.code
    const sendbirdMessage = getSendbirdErrorMessage(errorCode)
    const errorType = mapSendbirdCodeToErrorType(errorCode, fallbackType)

    if (sendbirdMessage) {
      return new AppError(
        errorType,
        sendbirdMessage,
        error.message || `Sendbird error code: ${errorCode}`,
        error,
        errorCode
      )
    }
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    // Sendbird SDK 특정 에러 메시지 파싱 (코드가 없는 경우)
    const errorMessage = error.message.toLowerCase()

    // 초기화 실패
    if (errorMessage.includes('not initialized') || errorMessage.includes('init')) {
      return new AppError(
        ErrorType.SENDBIRD_INIT_FAILED,
        getUserFriendlyMessage(ErrorType.SENDBIRD_INIT_FAILED),
        error.message,
        error
      )
    }

    // 연결 실패
    if (errorMessage.includes('connect') || errorMessage.includes('connection')) {
      return new AppError(
        ErrorType.SENDBIRD_CONNECTION_FAILED,
        getUserFriendlyMessage(ErrorType.SENDBIRD_CONNECTION_FAILED),
        error.message,
        error
      )
    }

    // 네트워크 에러
    if (errorMessage.includes('network') || errorMessage.includes('fetch failed')) {
      return new AppError(
        ErrorType.NETWORK_ERROR,
        getUserFriendlyMessage(ErrorType.NETWORK_ERROR),
        error.message,
        error
      )
    }

    // 타임아웃
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return new AppError(
        ErrorType.TIMEOUT_ERROR,
        getUserFriendlyMessage(ErrorType.TIMEOUT_ERROR),
        error.message,
        error
      )
    }

    // 채널을 찾을 수 없음
    if (errorMessage.includes('not found') || errorMessage.includes('channel not found')) {
      return new AppError(
        ErrorType.CHANNEL_NOT_FOUND,
        getUserFriendlyMessage(ErrorType.CHANNEL_NOT_FOUND),
        error.message,
        error
      )
    }

    // 기타 Error 객체 - fallback 타입 사용
    return new AppError(fallbackType, getUserFriendlyMessage(fallbackType), error.message, error)
  }

  // 문자열 에러
  if (typeof error === 'string') {
    return new AppError(fallbackType, getUserFriendlyMessage(fallbackType), error, error)
  }

  // 알 수 없는 타입 - 문자열로 변환
  return new AppError(
    ErrorType.UNKNOWN_ERROR,
    getUserFriendlyMessage(ErrorType.UNKNOWN_ERROR),
    String(error),
    error
  )
}

/**
 * 에러 로깅
 *
 * 개발 환경에서는 console.error로 출력하고,
 * 프로덕션 환경에서는 에러 추적 서비스(Sentry 등)로 전송할 수 있습니다.
 *
 * @param error - 로깅할 에러 (AppError 또는 Error)
 * @param context - 에러 발생 컨텍스트 (함수명, 컴포넌트명 등)
 *
 * @example
 * ```typescript
 * catch (error) {
 *   const appError = toAppError(error, ErrorType.CHANNEL_FETCH_FAILED)
 *   logError(appError, 'getChannels')
 *   throw appError
 * }
 * ```
 */
export function logError(error: AppError | Error, context?: string): void {
  // 개발 환경에서 콘솔 출력
  if (process.env.NODE_ENV === 'development') {
    const prefix = context ? `[Error in ${context}]` : '[Error]'

    if (error instanceof AppError) {
      console.error(prefix, {
        type: error.type,
        userMessage: error.userMessage,
        technicalMessage: error.technicalMessage,
        originalError: error.originalError,
        stack: error.stack,
      })
    } else {
      console.error(prefix, error)
    }
  }

  // TODO: 프로덕션 환경에서는 에러 추적 서비스로 전송
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, {
  //     contexts: {
  //       error: {
  //         context,
  //         ...(error instanceof AppError && {
  //           type: error.type,
  //           userMessage: error.userMessage,
  //         }),
  //       },
  //     },
  //   })
  // }
}

/**
 * AppError인지 확인하는 타입 가드
 *
 * @param error - 확인할 에러
 * @returns AppError 여부
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * 심각한 에러인지 판단 (Critical Error)
 *
 * 심각한 에러는 사용자가 재시도해도 해결되지 않는 에러로,
 * ErrorBoundary로 전체 화면을 교체해야 합니다.
 *
 * @param error - 확인할 에러
 * @returns 심각한 에러 여부
 *
 * @example
 * ```typescript
 * if (isCriticalError(appError)) {
 *   throw appError // ErrorBoundary가 캐치
 * }
 * ```
 */
export function isCriticalError(error: AppError): boolean {
  // 에러 타입으로 먼저 판단
  if (error.type === ErrorType.SENDBIRD_INIT_FAILED || error.type === ErrorType.UNKNOWN_ERROR) {
    return true
  }

  // Sendbird 에러 코드가 있는 경우 코드로 판단
  if (error.code) {
    // Client Errors - Critical
    if (error.code === SendbirdClientErrorCode.INVALID_INITIALIZATION) {
      return true
    }

    // Server Errors - Critical
    const criticalServerCodes = [
      SendbirdServerErrorCode.UNAUTHORIZED_REQUEST, // 400108: 인증 실패
      SendbirdServerErrorCode.ACCESS_TOKEN_NOT_VALID, // 400303: 토큰 무효
      SendbirdServerErrorCode.APPLICATION_NOT_AVAILABLE, // 403100: 앱 사용 불가
      SendbirdServerErrorCode.SERVICE_UNAVAILABLE, // 503: 서비스 사용 불가
      SendbirdServerErrorCode.REQUEST_FAILED_UNAUTHORIZED, // 900010: 권한 없음
      SendbirdServerErrorCode.REQUEST_FAILED_UNAPPROVED_APP, // 900040: 승인되지 않은 앱
      SendbirdServerErrorCode.REQUEST_FAILED_APP_DISABLED, // 900050: 앱 비활성화
      SendbirdServerErrorCode.REQUEST_FAILED_APP_DELETED, // 900060: 앱 삭제됨
    ]

    if (criticalServerCodes.includes(error.code)) {
      return true
    }
  }

  return false
}

/**
 * 복구 가능한 에러인지 판단 (Recoverable Error)
 *
 * 복구 가능한 에러는 사용자가 재시도하면 해결될 수 있는 에러로,
 * ErrorMessage 컴포넌트로 인라인 표시합니다.
 *
 * @param error - 확인할 에러
 * @returns 복구 가능한 에러 여부
 *
 * @example
 * ```typescript
 * if (isRecoverableError(appError)) {
 *   return <ErrorMessage message={appError.userMessage} onRetry={refetch} />
 * }
 * ```
 */
export function isRecoverableError(error: AppError): boolean {
  // 심각한 에러는 복구 불가능
  if (isCriticalError(error)) {
    return false
  }

  // 에러 타입으로 판단
  const recoverableTypes = [
    ErrorType.NETWORK_ERROR,
    ErrorType.TIMEOUT_ERROR,
    ErrorType.CHANNEL_FETCH_FAILED,
    ErrorType.CHANNEL_CREATE_FAILED,
    ErrorType.CHANNEL_UPDATE_FAILED,
    ErrorType.CHANNEL_NOT_FOUND,
    ErrorType.SENDBIRD_CONNECTION_FAILED,
  ]

  if (recoverableTypes.includes(error.type)) {
    return true
  }

  // Sendbird 에러 코드로 판단
  if (error.code) {
    // Client Errors - Recoverable
    const recoverableClientCodes = [
      SendbirdClientErrorCode.CONNECTION_REQUIRED, // 800101: 연결 필요
      SendbirdClientErrorCode.CONNECTION_CANCELED, // 800102: 연결 취소
      SendbirdClientErrorCode.NETWORK_ERROR, // 800120: 네트워크 에러
      SendbirdClientErrorCode.NETWORK_ROUTING_ERROR, // 800121: 라우팅 에러
      SendbirdClientErrorCode.MARK_AS_READ_RATE_LIMIT_EXCEEDED, // 800160: Rate limit
      SendbirdClientErrorCode.ACK_TIMEOUT, // 800180: ACK 타임아웃
      SendbirdClientErrorCode.LOGIN_TIMEOUT, // 800190: 로그인 타임아웃
      SendbirdClientErrorCode.WEBSOCKET_CONNECTION_CLOSED, // 800200: WebSocket 종료
      SendbirdClientErrorCode.WEBSOCKET_CONNECTION_FAILED, // 800210: WebSocket 실패
      SendbirdClientErrorCode.REQUEST_FAILED, // 800220: 요청 실패
    ]

    if (recoverableClientCodes.includes(error.code)) {
      return true
    }

    // Server Errors - Recoverable
    const recoverableServerCodes = [
      SendbirdServerErrorCode.RESOURCE_NOT_FOUND, // 400201: 리소스 없음
      SendbirdServerErrorCode.RATE_LIMIT_EXCEEDED, // 500910: Rate limit
      SendbirdServerErrorCode.REQUEST_FAILED_CHANNEL_NOT_FOUND, // 900200: 채널 없음
    ]

    if (recoverableServerCodes.includes(error.code)) {
      return true
    }
  }

  // 기타 에러는 복구 가능한 것으로 간주 (안전한 기본값)
  return true
}
