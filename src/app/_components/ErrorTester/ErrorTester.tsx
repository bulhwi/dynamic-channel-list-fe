/**
 * ErrorTester 컴포넌트 (개발 환경 전용)
 *
 * 다양한 에러 시나리오를 테스트할 수 있는 도구입니다.
 * - Sendbird 에러 코드 시뮬레이션
 * - ErrorBoundary 동작 확인
 * - React Query 에러 처리 확인
 */

'use client'

import { useState } from 'react'
import { AppError, ErrorType } from '@/_types/error.types'
import {
  SendbirdClientErrorCode,
  SendbirdServerErrorCode,
  getSendbirdErrorMessage,
} from '@/_types/sendbirdError.types'
import { toAppError } from '@/_lib/errorUtils'
import * as S from './ErrorTester.style'

// 개발 환경에서만 렌더링
if (process.env.NODE_ENV !== 'development') {
  throw new Error('ErrorTester는 개발 환경에서만 사용할 수 있습니다.')
}

export default function ErrorTester() {
  const [lastError, setLastError] = useState<AppError | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  /**
   * ErrorBoundary를 트리거하는 에러 발생
   */
  const throwError = (error: Error) => {
    // React에서 에러를 던져 ErrorBoundary가 캐치하도록 함
    throw error
  }

  /**
   * Sendbird 클라이언트 에러 시뮬레이션
   */
  const simulateClientError = (code: SendbirdClientErrorCode) => {
    const message = getSendbirdErrorMessage(code)
    const sendbirdError = {
      code,
      message: message || 'Sendbird client error',
    }
    const appError = toAppError(sendbirdError, ErrorType.SENDBIRD_CONNECTION_FAILED)
    setLastError(appError)
    console.log('Simulated Client Error:', appError)
  }

  /**
   * Sendbird 서버 에러 시뮬레이션
   */
  const simulateServerError = (code: SendbirdServerErrorCode) => {
    const message = getSendbirdErrorMessage(code)
    const sendbirdError = {
      code,
      message: message || 'Sendbird server error',
    }
    const appError = toAppError(sendbirdError, ErrorType.CHANNEL_FETCH_FAILED)
    setLastError(appError)
    console.log('Simulated Server Error:', appError)
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>🧪 Error Tester (개발 환경 전용)</S.Title>
        <S.Description>
          다양한 에러 시나리오를 테스트하세요. ErrorBoundary와 에러 처리 동작을 확인할 수 있습니다.
        </S.Description>
      </S.Header>

      <S.Section>
        <S.SectionTitle>1. ErrorBoundary 테스트</S.SectionTitle>
        <S.ButtonGrid>
          <S.TestButton
            onClick={() =>
              throwError(
                new AppError(
                  ErrorType.SENDBIRD_INIT_FAILED,
                  '서비스 연결에 실패했습니다.',
                  'Sendbird initialization failed'
                )
              )
            }
          >
            초기화 실패
          </S.TestButton>
          <S.TestButton
            onClick={() =>
              throwError(
                new AppError(
                  ErrorType.NETWORK_ERROR,
                  '네트워크 연결을 확인해주세요.',
                  'Network connection failed'
                )
              )
            }
          >
            네트워크 에러
          </S.TestButton>
          <S.TestButton
            onClick={() =>
              throwError(
                new AppError(
                  ErrorType.UNKNOWN_ERROR,
                  '알 수 없는 오류가 발생했습니다.',
                  'Unknown error occurred'
                )
              )
            }
          >
            알 수 없는 에러
          </S.TestButton>
        </S.ButtonGrid>
      </S.Section>

      <S.Section>
        <S.SectionTitle>2. Sendbird 클라이언트 에러 (800xxx)</S.SectionTitle>
        <S.ButtonGrid>
          <S.TestButton
            onClick={() => simulateClientError(SendbirdClientErrorCode.INVALID_INITIALIZATION)}
          >
            800100: 초기화 실패
          </S.TestButton>
          <S.TestButton
            onClick={() => simulateClientError(SendbirdClientErrorCode.CONNECTION_REQUIRED)}
          >
            800101: 연결 필요
          </S.TestButton>
          <S.TestButton onClick={() => simulateClientError(SendbirdClientErrorCode.NETWORK_ERROR)}>
            800120: 네트워크 에러
          </S.TestButton>
          <S.TestButton
            onClick={() => simulateClientError(SendbirdClientErrorCode.WEBSOCKET_CONNECTION_FAILED)}
          >
            800210: WebSocket 실패
          </S.TestButton>
          <S.TestButton
            onClick={() =>
              simulateClientError(SendbirdClientErrorCode.MARK_AS_READ_RATE_LIMIT_EXCEEDED)
            }
          >
            800160: 속도 제한
          </S.TestButton>
          <S.TestButton onClick={() => simulateClientError(SendbirdClientErrorCode.ACK_TIMEOUT)}>
            800180: ACK 타임아웃
          </S.TestButton>
        </S.ButtonGrid>
      </S.Section>

      <S.Section>
        <S.SectionTitle>3. Sendbird 서버 에러 (400xxx, 500xxx, 900xxx)</S.SectionTitle>
        <S.ButtonGrid>
          <S.TestButton
            onClick={() => simulateServerError(SendbirdServerErrorCode.RESOURCE_NOT_FOUND)}
          >
            400201: 리소스 없음
          </S.TestButton>
          <S.TestButton
            onClick={() => simulateServerError(SendbirdServerErrorCode.UNAUTHORIZED_REQUEST)}
          >
            400108: 인증 실패
          </S.TestButton>
          <S.TestButton
            onClick={() =>
              simulateServerError(SendbirdServerErrorCode.PARAMETER_VALUE_LENGTH_EXCEEDED)
            }
          >
            400110: 값 길이 초과
          </S.TestButton>
          <S.TestButton onClick={() => simulateServerError(SendbirdServerErrorCode.BANNED_USER)}>
            400750: 정지된 사용자
          </S.TestButton>
          <S.TestButton onClick={() => simulateServerError(SendbirdServerErrorCode.INTERNAL_ERROR)}>
            500901: 서버 에러
          </S.TestButton>
          <S.TestButton
            onClick={() => simulateServerError(SendbirdServerErrorCode.RATE_LIMIT_EXCEEDED)}
          >
            500910: 속도 제한 초과
          </S.TestButton>
          <S.TestButton
            onClick={() =>
              simulateServerError(SendbirdServerErrorCode.REQUEST_FAILED_CHANNEL_NOT_FOUND)
            }
          >
            900200: 채널 없음
          </S.TestButton>
          <S.TestButton
            onClick={() =>
              simulateServerError(SendbirdServerErrorCode.REQUEST_FAILED_PROFANITY_FILTER)
            }
          >
            900400: 비속어 필터
          </S.TestButton>
        </S.ButtonGrid>
      </S.Section>

      {lastError && (
        <S.ResultSection>
          <S.ResultHeader>
            <S.SectionTitle>📋 마지막 시뮬레이션 결과</S.SectionTitle>
            <S.ToggleButton onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? '접기' : '펼치기'}
            </S.ToggleButton>
          </S.ResultHeader>

          <S.ResultContent>
            <S.ResultItem>
              <S.ResultLabel>Error Type:</S.ResultLabel>
              <S.ResultValue>{lastError.type}</S.ResultValue>
            </S.ResultItem>

            {lastError.code && (
              <S.ResultItem>
                <S.ResultLabel>Sendbird Code:</S.ResultLabel>
                <S.ResultValue $highlight>{lastError.code}</S.ResultValue>
              </S.ResultItem>
            )}

            <S.ResultItem>
              <S.ResultLabel>User Message:</S.ResultLabel>
              <S.ResultValue>{lastError.userMessage}</S.ResultValue>
            </S.ResultItem>

            {showDetails && (
              <>
                <S.ResultItem>
                  <S.ResultLabel>Technical Message:</S.ResultLabel>
                  <S.ResultValue>{lastError.technicalMessage || 'N/A'}</S.ResultValue>
                </S.ResultItem>

                <S.ResultItem>
                  <S.ResultLabel>JSON:</S.ResultLabel>
                  <S.CodeBlock>{JSON.stringify(lastError.toJSON(), null, 2)}</S.CodeBlock>
                </S.ResultItem>
              </>
            )}
          </S.ResultContent>

          <S.ClearButton onClick={() => setLastError(null)}>결과 지우기</S.ClearButton>
        </S.ResultSection>
      )}

      <S.Footer>
        <S.Note>
          💡 <strong>Tip:</strong> ErrorBoundary 테스트 버튼은 페이지를 새로고침해야 재시도할 수
          있습니다. 다른 버튼들은 콘솔에서 결과를 확인할 수 있습니다.
        </S.Note>
      </S.Footer>
    </S.Container>
  )
}
