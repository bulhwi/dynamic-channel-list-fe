/**
 * 애플리케이션 에러 타입
 *
 * 에러의 종류를 명확하게 분류하여
 * 적절한 처리 및 사용자 메시지를 제공합니다.
 */
export enum ErrorType {
  // Sendbird SDK 관련
  SENDBIRD_INIT_FAILED = 'SENDBIRD_INIT_FAILED',
  SENDBIRD_CONNECTION_FAILED = 'SENDBIRD_CONNECTION_FAILED',

  // 채널 관련
  CHANNEL_FETCH_FAILED = 'CHANNEL_FETCH_FAILED',
  CHANNEL_CREATE_FAILED = 'CHANNEL_CREATE_FAILED',
  CHANNEL_UPDATE_FAILED = 'CHANNEL_UPDATE_FAILED',
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',

  // 네트워크 관련
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  // 기타
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * 커스텀 애플리케이션 에러
 *
 * 일관된 에러 처리를 위한 커스텀 에러 클래스입니다.
 * 사용자 친화적 메시지와 개발자용 기술 메시지를 분리합니다.
 */
export class AppError extends Error {
  /**
   * AppError 생성자
   *
   * @param type - 에러 타입 (ErrorType enum)
   * @param userMessage - 사용자에게 보여줄 메시지 (한글)
   * @param technicalMessage - 개발자용 메시지 (영문, 선택)
   * @param originalError - 원본 에러 (디버깅용, 선택)
   * @param code - Sendbird 에러 코드 (선택)
   */
  constructor(
    public type: ErrorType,
    public userMessage: string,
    public technicalMessage?: string,
    public originalError?: unknown,
    public code?: number
  ) {
    super(technicalMessage || userMessage)
    this.name = 'AppError'

    // Stack trace 유지 (디버깅용)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  /**
   * 에러를 JSON으로 직렬화
   * (로깅, 분석 도구 전송용)
   */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      code: this.code,
      userMessage: this.userMessage,
      technicalMessage: this.technicalMessage,
      stack: this.stack,
    }
  }
}
