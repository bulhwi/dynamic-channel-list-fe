/**
 * React Query Client 설정
 *
 * SSR/CSR 양쪽에서 사용 가능한 QueryClient 생성
 * Server Component와 Client Component 모두 지원
 */

import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query'
import { QUERY_CONFIG } from '@/_constants/config'

/**
 * QueryClient 생성 함수
 * - 서버/클라이언트 환경 모두 지원
 * - 적절한 기본 옵션 설정
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 refetch 비활성화
        staleTime: QUERY_CONFIG.STALE_TIME_MS,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: QUERY_CONFIG.RETRY_COUNT,
      },
      dehydrate: {
        // dehydrate할 쿼리 결정
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * QueryClient 싱글톤
 * - 서버: 매 요청마다 새로운 인스턴스 (데이터 격리)
 * - 클라이언트: 싱글톤 (앱 전체에서 공유)
 */
export function getQueryClient() {
  if (isServer) {
    // 서버: 항상 새로운 QueryClient 생성
    return makeQueryClient()
  } else {
    // 클라이언트: 싱글톤 패턴
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
