/**
 * Sendbird SDK 공식 에러 코드
 *
 * @see https://sendbird.com/docs/chat/sdk/v4/javascript/error-codes
 *
 * Client Error Codes: 800xxx (클라이언트 측 에러)
 * Server Error Codes: 400xxx, 500xxx, 900xxx (서버 측 에러)
 */

/**
 * 클라이언트 에러 코드 (800xxx)
 * SDK 내부에서 발생하는 에러
 */
export enum SendbirdClientErrorCode {
  /** Sendbird 인스턴스가 초기화되지 않음 */
  INVALID_INITIALIZATION = 800100,
  /** 연결이 필요한 작업을 연결 없이 시도함 */
  CONNECTION_REQUIRED = 800101,
  /** 연결이 취소됨 */
  CONNECTION_CANCELED = 800102,
  /** 잘못된 파라미터 값 */
  INVALID_PARAMETER = 800110,
  /** 네트워크 에러 */
  NETWORK_ERROR = 800120,
  /** 네트워크 라우팅 에러 */
  NETWORK_ROUTING_ERROR = 800121,
  /** 잘못된 데이터 형식 */
  MALFORMED_DATA = 800130,
  /** 잘못된 에러 데이터 형식 */
  MALFORMED_ERROR_DATA = 800140,
  /** 잘못된 채널 타입 */
  WRONG_CHANNEL_TYPE = 800150,
  /** 읽음 처리 속도 제한 초과 */
  MARK_AS_READ_RATE_LIMIT_EXCEEDED = 800160,
  /** 쿼리가 이미 진행 중 */
  QUERY_IN_PROGRESS = 800170,
  /** ACK 타임아웃 */
  ACK_TIMEOUT = 800180,
  /** 로그인 타임아웃 */
  LOGIN_TIMEOUT = 800190,
  /** WebSocket 연결 종료됨 */
  WEBSOCKET_CONNECTION_CLOSED = 800200,
  /** WebSocket 연결 실패 */
  WEBSOCKET_CONNECTION_FAILED = 800210,
  /** 요청 실패 */
  REQUEST_FAILED = 800220,
  /** 파일 업로드 취소 실패 */
  FILE_UPLOAD_CANCEL_FAILED = 800230,
  /** 요청이 취소됨 */
  REQUEST_CANCELLED = 800240,
}

/**
 * 서버 에러 코드 (400xxx, 500xxx, 900xxx)
 * Sendbird 서버에서 반환하는 에러
 */
export enum SendbirdServerErrorCode {
  // 400xxx - Bad Request 계열
  /** 예상치 못한 파라미터 타입 */
  UNEXPECTED_PARAMETER_TYPE = 400100,
  UNEXPECTED_PARAMETER_TYPE_101 = 400101,
  UNEXPECTED_PARAMETER_TYPE_102 = 400102,
  UNEXPECTED_PARAMETER_TYPE_103 = 400103,
  UNEXPECTED_PARAMETER_TYPE_104 = 400104,
  /** 필수 파라미터 누락 */
  MISSING_REQUIRED_PARAMETERS = 400105,
  /** 음수 값 허용 안됨 */
  NEGATIVE_NUMBER_NOT_ALLOWED = 400106,
  /** 인증되지 않은 요청 */
  UNAUTHORIZED_REQUEST = 400108,
  /** 파라미터 값 길이 초과 */
  PARAMETER_VALUE_LENGTH_EXCEEDED = 400110,
  /** 잘못된 값 */
  INVALID_VALUE = 400111,
  /** 호환되지 않는 값들 */
  INCOMPATIBLE_VALUES = 400112,
  /** 파라미터 값 범위 초과 */
  PARAMETER_VALUE_OUT_OF_RANGE = 400113,
  /** 잘못된 리소스 URL */
  INVALID_URL_OF_RESOURCE = 400114,
  /** 허용되지 않는 문자 */
  NOT_ALLOWED_CHARACTER = 400151,

  // 400xxx - Resource 관련
  /** 리소스를 찾을 수 없음 */
  RESOURCE_NOT_FOUND = 400201,
  /** 리소스가 이미 존재함 */
  RESOURCE_ALREADY_EXISTS = 400202,
  /** 파라미터에 너무 많은 항목 */
  TOO_MANY_ITEMS_IN_PARAMETER = 400203,

  // 400xxx - User 관련
  /** 사용자를 찾을 수 없음 */
  USER_NOT_FOUND = 400300,
  /** 비활성화된 사용자 */
  DEACTIVATED_USER = 400301,
  /** 사용자 ID가 이미 존재함 */
  USER_ID_ALREADY_EXISTS = 400302,
  /** 액세스 토큰이 유효하지 않음 */
  ACCESS_TOKEN_NOT_VALID = 400303,
  /** 사용자가 허용 목록에 없음 */
  USER_NOT_IN_ALLOW_LIST = 400304,
  /** 너무 많은 사용자 */
  TOO_MANY_USERS = 400305,
  /** 사용자 프로필 URL이 잘못됨 */
  INVALID_USER_PROFILE_URL = 400306,
  /** 너무 긴 사용자 ID */
  USER_ID_TOO_LONG = 400307,

  // 400xxx - API/Request 관련
  /** 잘못된 API 토큰 */
  INVALID_API_TOKEN = 400401,
  /** 일회성 토큰이 만료되지 않음 */
  ONE_TIME_TOKEN_NOT_EXPIRED = 400402,
  /** 너무 많은 등록 ID */
  TOO_MANY_REGISTRATION_IDS = 400403,
  /** 잘못된 매개변수 이름 */
  INVALID_PARAMETER_NAME = 400404,

  // 400xxx - Connection 관련
  /** WebSocket 연결 수 제한 초과 */
  WEBSOCKET_CONNECTION_LIMIT_EXCEEDED = 400500,
  /** WebSocket 연결 수 초과 (서버) */
  TOO_MANY_WEBSOCKET_CONNECTIONS = 400501,

  // 400xxx - Blocked User 관련
  /** 차단된 사용자가 대상 사용자에 의해 차단됨 */
  BLOCKED_USER_SEND_NOT_ALLOWED = 400700,
  /** 차단된 사용자가 채널에 참가하려 함 */
  BLOCKED_USER_CHANNEL_JOIN_NOT_ALLOWED = 400701,
  /** 차단되지 않은 사용자 */
  USER_NOT_BLOCKED = 400702,

  // 400xxx - Banned User 관련
  /** 밴된 사용자 */
  BANNED_USER = 400750,
  /** 사용자가 밴되지 않음 */
  USER_NOT_BANNED = 400751,

  // 400xxx - 기타
  /** 허용되지 않는 요청 */
  UNACCEPTABLE = 400920,
  /** 잘못된 엔드포인트 */
  INVALID_ENDPOINT = 400930,

  // 403xxx - Forbidden
  /** 애플리케이션을 사용할 수 없음 */
  APPLICATION_NOT_AVAILABLE = 403100,

  // 500xxx - Server Error
  /** 푸시 토큰을 등록할 수 없음 */
  PUSH_TOKEN_NOT_REGISTERED = 500601,
  /** 푸시 토큰을 등록 해제할 수 없음 */
  PUSH_TOKEN_NOT_UNREGISTERED = 500602,
  /** 내부 서버 에러 */
  INTERNAL_ERROR = 500901,
  /** 속도 제한 초과 */
  RATE_LIMIT_EXCEEDED = 500910,

  // 503 - Service Unavailable
  /** 서비스 사용 불가 */
  SERVICE_UNAVAILABLE = 503,

  // 900xxx - Request Failed 계열
  /** 권한 없는 요청 실패 */
  REQUEST_FAILED_UNAUTHORIZED = 900010,
  /** 유효하지 않은 요청 실패 */
  REQUEST_FAILED_INVALID = 900020,
  /** 너무 큰 요청 실패 */
  REQUEST_FAILED_TOO_LARGE = 900030,
  /** 승인되지 않은 앱 */
  REQUEST_FAILED_UNAPPROVED_APP = 900040,
  /** 애플리케이션 비활성화됨 */
  REQUEST_FAILED_APP_DISABLED = 900050,
  /** 애플리케이션 삭제됨 */
  REQUEST_FAILED_APP_DELETED = 900060,
  /** 부적절한 콘텐츠 */
  REQUEST_FAILED_INAPPROPRIATE_CONTENT = 900070,
  /** 비활성화된 기능 */
  REQUEST_FAILED_FEATURE_DISABLED = 900100,

  // 900xxx - Channel 관련
  /** 채널을 찾을 수 없음 */
  REQUEST_FAILED_CHANNEL_NOT_FOUND = 900200,
  /** 고유 채널 생성 실패 */
  REQUEST_FAILED_UNIQUE_CHANNEL_CREATION = 900201,
  /** 숨겨진 채널 */
  REQUEST_FAILED_HIDDEN_CHANNEL = 900210,
  /** 채널 생성 제한 초과 */
  REQUEST_FAILED_CHANNEL_CREATION_LIMIT_EXCEEDED = 900211,
  /** 메타 배열 키 제한 초과 */
  REQUEST_FAILED_META_ARRAY_KEY_LIMIT_EXCEEDED = 900220,
  /** 메타 배열 값 제한 초과 */
  REQUEST_FAILED_META_ARRAY_VALUE_LIMIT_EXCEEDED = 900221,
  /** 메타 카운터 키 제한 초과 */
  REQUEST_FAILED_META_COUNTER_KEY_LIMIT_EXCEEDED = 900222,

  // 900xxx - Message 관련
  /** 메시지를 찾을 수 없음 */
  REQUEST_FAILED_MESSAGE_NOT_FOUND = 900300,
  /** 밴된 사용자의 메시지 전송 */
  REQUEST_FAILED_BANNED_USER_SEND_MESSAGE = 900301,
  /** 음소거된 사용자의 메시지 전송 */
  REQUEST_FAILED_MUTED_USER_SEND_MESSAGE = 900302,
  /** 메시지 업데이트 실패 */
  REQUEST_FAILED_MESSAGE_UPDATE = 900303,
  /** 프로판티 필터로 인한 전송 실패 */
  REQUEST_FAILED_PROFANITY_FILTER = 900400,
  /** 도메인 필터로 인한 전송 실패 */
  REQUEST_FAILED_DOMAIN_FILTER = 900500,
}

/**
 * 모든 Sendbird 에러 코드 타입
 */
export type SendbirdErrorCode = SendbirdClientErrorCode | SendbirdServerErrorCode

/**
 * Sendbird 에러 코드별 한글 사용자 메시지 매핑
 */
export const SENDBIRD_ERROR_MESSAGES: Record<SendbirdErrorCode, string> = {
  // Client Errors (800xxx)
  [SendbirdClientErrorCode.INVALID_INITIALIZATION]:
    '서비스 연결에 실패했습니다. 페이지를 새로고침해주세요.',
  [SendbirdClientErrorCode.CONNECTION_REQUIRED]:
    '서버 연결이 필요합니다. 잠시 후 다시 시도해주세요.',
  [SendbirdClientErrorCode.CONNECTION_CANCELED]: '연결이 취소되었습니다.',
  [SendbirdClientErrorCode.INVALID_PARAMETER]: '잘못된 요청입니다.',
  [SendbirdClientErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [SendbirdClientErrorCode.NETWORK_ROUTING_ERROR]: '네트워크 연결이 불안정합니다.',
  [SendbirdClientErrorCode.MALFORMED_DATA]: '데이터 형식이 올바르지 않습니다.',
  [SendbirdClientErrorCode.MALFORMED_ERROR_DATA]: '에러 정보를 읽을 수 없습니다.',
  [SendbirdClientErrorCode.WRONG_CHANNEL_TYPE]: '지원하지 않는 채널 타입입니다.',
  [SendbirdClientErrorCode.MARK_AS_READ_RATE_LIMIT_EXCEEDED]:
    '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
  [SendbirdClientErrorCode.QUERY_IN_PROGRESS]: '이미 진행 중인 작업이 있습니다.',
  [SendbirdClientErrorCode.ACK_TIMEOUT]: '요청 시간이 초과되었습니다.',
  [SendbirdClientErrorCode.LOGIN_TIMEOUT]: '로그인 시간이 초과되었습니다. 다시 시도해주세요.',
  [SendbirdClientErrorCode.WEBSOCKET_CONNECTION_CLOSED]: '서버 연결이 종료되었습니다.',
  [SendbirdClientErrorCode.WEBSOCKET_CONNECTION_FAILED]: '서버 연결에 실패했습니다.',
  [SendbirdClientErrorCode.REQUEST_FAILED]: '요청에 실패했습니다.',
  [SendbirdClientErrorCode.FILE_UPLOAD_CANCEL_FAILED]: '파일 업로드 취소에 실패했습니다.',
  [SendbirdClientErrorCode.REQUEST_CANCELLED]: '요청이 취소되었습니다.',

  // Server Errors (400xxx) - Bad Request
  [SendbirdServerErrorCode.UNEXPECTED_PARAMETER_TYPE]: '잘못된 요청입니다.',
  [SendbirdServerErrorCode.UNEXPECTED_PARAMETER_TYPE_101]: '잘못된 요청입니다.',
  [SendbirdServerErrorCode.UNEXPECTED_PARAMETER_TYPE_102]: '잘못된 요청입니다.',
  [SendbirdServerErrorCode.UNEXPECTED_PARAMETER_TYPE_103]: '잘못된 요청입니다.',
  [SendbirdServerErrorCode.UNEXPECTED_PARAMETER_TYPE_104]: '잘못된 요청입니다.',
  [SendbirdServerErrorCode.MISSING_REQUIRED_PARAMETERS]: '필수 정보가 누락되었습니다.',
  [SendbirdServerErrorCode.NEGATIVE_NUMBER_NOT_ALLOWED]: '잘못된 값입니다.',
  [SendbirdServerErrorCode.UNAUTHORIZED_REQUEST]: '인증에 실패했습니다.',
  [SendbirdServerErrorCode.PARAMETER_VALUE_LENGTH_EXCEEDED]: '입력 값이 너무 깁니다.',
  [SendbirdServerErrorCode.INVALID_VALUE]: '잘못된 값입니다.',
  [SendbirdServerErrorCode.INCOMPATIBLE_VALUES]: '호환되지 않는 값입니다.',
  [SendbirdServerErrorCode.PARAMETER_VALUE_OUT_OF_RANGE]: '값의 범위를 벗어났습니다.',
  [SendbirdServerErrorCode.INVALID_URL_OF_RESOURCE]: '잘못된 URL입니다.',
  [SendbirdServerErrorCode.NOT_ALLOWED_CHARACTER]: '허용되지 않는 문자가 포함되어 있습니다.',

  // Server Errors (400xxx) - Resource
  [SendbirdServerErrorCode.RESOURCE_NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [SendbirdServerErrorCode.RESOURCE_ALREADY_EXISTS]: '이미 존재하는 리소스입니다.',
  [SendbirdServerErrorCode.TOO_MANY_ITEMS_IN_PARAMETER]: '너무 많은 항목이 포함되어 있습니다.',

  // Server Errors (400xxx) - User
  [SendbirdServerErrorCode.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
  [SendbirdServerErrorCode.DEACTIVATED_USER]: '비활성화된 사용자입니다.',
  [SendbirdServerErrorCode.USER_ID_ALREADY_EXISTS]: '이미 사용 중인 사용자 ID입니다.',
  [SendbirdServerErrorCode.ACCESS_TOKEN_NOT_VALID]: '인증 토큰이 유효하지 않습니다.',
  [SendbirdServerErrorCode.USER_NOT_IN_ALLOW_LIST]: '접근 권한이 없습니다.',
  [SendbirdServerErrorCode.TOO_MANY_USERS]: '사용자 수가 너무 많습니다.',
  [SendbirdServerErrorCode.INVALID_USER_PROFILE_URL]: '잘못된 프로필 URL입니다.',
  [SendbirdServerErrorCode.USER_ID_TOO_LONG]: '사용자 ID가 너무 깁니다.',

  // Server Errors (400xxx) - API/Request
  [SendbirdServerErrorCode.INVALID_API_TOKEN]: 'API 토큰이 유효하지 않습니다.',
  [SendbirdServerErrorCode.ONE_TIME_TOKEN_NOT_EXPIRED]: '일회성 토큰이 아직 유효합니다.',
  [SendbirdServerErrorCode.TOO_MANY_REGISTRATION_IDS]: '등록 ID가 너무 많습니다.',
  [SendbirdServerErrorCode.INVALID_PARAMETER_NAME]: '잘못된 파라미터 이름입니다.',

  // Server Errors (400xxx) - Connection
  [SendbirdServerErrorCode.WEBSOCKET_CONNECTION_LIMIT_EXCEEDED]: '동시 접속자 수가 초과되었습니다.',
  [SendbirdServerErrorCode.TOO_MANY_WEBSOCKET_CONNECTIONS]: '동시 접속자 수가 초과되었습니다.',

  // Server Errors (400xxx) - Blocked User
  [SendbirdServerErrorCode.BLOCKED_USER_SEND_NOT_ALLOWED]:
    '차단된 사용자에게 메시지를 보낼 수 없습니다.',
  [SendbirdServerErrorCode.BLOCKED_USER_CHANNEL_JOIN_NOT_ALLOWED]:
    '차단된 사용자가 참가할 수 없습니다.',
  [SendbirdServerErrorCode.USER_NOT_BLOCKED]: '차단되지 않은 사용자입니다.',

  // Server Errors (400xxx) - Banned User
  [SendbirdServerErrorCode.BANNED_USER]: '정지된 사용자입니다.',
  [SendbirdServerErrorCode.USER_NOT_BANNED]: '정지되지 않은 사용자입니다.',

  // Server Errors (400xxx) - Other
  [SendbirdServerErrorCode.UNACCEPTABLE]: '허용되지 않는 요청입니다.',
  [SendbirdServerErrorCode.INVALID_ENDPOINT]: '잘못된 API 엔드포인트입니다.',

  // Server Errors (403xxx)
  [SendbirdServerErrorCode.APPLICATION_NOT_AVAILABLE]: '서비스를 사용할 수 없습니다.',

  // Server Errors (500xxx)
  [SendbirdServerErrorCode.PUSH_TOKEN_NOT_REGISTERED]: '푸시 알림 등록에 실패했습니다.',
  [SendbirdServerErrorCode.PUSH_TOKEN_NOT_UNREGISTERED]: '푸시 알림 해제에 실패했습니다.',
  [SendbirdServerErrorCode.INTERNAL_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [SendbirdServerErrorCode.RATE_LIMIT_EXCEEDED]:
    '요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.',
  [SendbirdServerErrorCode.SERVICE_UNAVAILABLE]: '서비스를 일시적으로 사용할 수 없습니다.',

  // Server Errors (900xxx) - Request Failed
  [SendbirdServerErrorCode.REQUEST_FAILED_UNAUTHORIZED]: '권한이 없습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_INVALID]: '잘못된 요청입니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_TOO_LARGE]: '요청 크기가 너무 큽니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_UNAPPROVED_APP]: '승인되지 않은 앱입니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_APP_DISABLED]: '앱이 비활성화되었습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_APP_DELETED]: '앱이 삭제되었습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_INAPPROPRIATE_CONTENT]:
    '부적절한 콘텐츠가 포함되어 있습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_FEATURE_DISABLED]: '비활성화된 기능입니다.',

  // Server Errors (900xxx) - Channel
  [SendbirdServerErrorCode.REQUEST_FAILED_CHANNEL_NOT_FOUND]: '채널을 찾을 수 없습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_UNIQUE_CHANNEL_CREATION]:
    '고유 채널 생성에 실패했습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_HIDDEN_CHANNEL]: '숨겨진 채널입니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_CHANNEL_CREATION_LIMIT_EXCEEDED]:
    '채널 생성 한도를 초과했습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_META_ARRAY_KEY_LIMIT_EXCEEDED]:
    '메타데이터 키 한도를 초과했습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_META_ARRAY_VALUE_LIMIT_EXCEEDED]:
    '메타데이터 값 한도를 초과했습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_META_COUNTER_KEY_LIMIT_EXCEEDED]:
    '메타데이터 카운터 한도를 초과했습니다.',

  // Server Errors (900xxx) - Message
  [SendbirdServerErrorCode.REQUEST_FAILED_MESSAGE_NOT_FOUND]: '메시지를 찾을 수 없습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_BANNED_USER_SEND_MESSAGE]:
    '정지된 사용자는 메시지를 보낼 수 없습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_MUTED_USER_SEND_MESSAGE]:
    '음소거된 사용자는 메시지를 보낼 수 없습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_MESSAGE_UPDATE]: '메시지 수정에 실패했습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_PROFANITY_FILTER]: '부적절한 언어가 감지되었습니다.',
  [SendbirdServerErrorCode.REQUEST_FAILED_DOMAIN_FILTER]: '차단된 도메인이 포함되어 있습니다.',
}

/**
 * Sendbird 에러 객체 타입 가드
 */
export interface SendbirdErrorObject {
  code?: number
  message?: string
}

/**
 * code가 반드시 존재하는 Sendbird 에러 타입
 * isSendbirdError 타입 가드에서 사용
 */
export interface SendbirdErrorWithCode {
  code: number
  message?: string
}

/**
 * Sendbird 에러인지 확인하는 타입 가드
 * code가 number 타입으로 존재하는 경우에만 true 반환
 */
export function isSendbirdError(error: unknown): error is SendbirdErrorWithCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as SendbirdErrorObject).code === 'number'
  )
}

/**
 * Sendbird 에러 코드에서 사용자 메시지 가져오기
 */
export function getSendbirdErrorMessage(code: number): string | null {
  return SENDBIRD_ERROR_MESSAGES[code as SendbirdErrorCode] || null
}
