# 기술 사양서

## 애니메이션이 적용된 동적 채널 리스트

---

## 문서 정보

| 항목            | 상세 내용                 |
| --------------- | ------------------------- |
| **문서 유형**   | 기술 사양서               |
| **버전**        | 1.0.1                     |
| **최종 수정일** | 2025-11-24                |
| **상태**        | ✅ Production (v1.0 완료) |
| **관련 문서**   | PRD_KO.md                 |
| **작성자**      | 개발팀                    |
| **테스트 통과** | 161/161 (100%)            |
| **커버리지**    | 85%+                      |

---

## 목차

1. [시스템 아키텍처](#1-시스템-아키텍처)
2. [기술 스택](#2-기술-스택)
3. [컴포넌트 설계](#3-컴포넌트-설계)
4. [상태 관리](#4-상태-관리)
5. [Sendbird SDK 통합](#5-sendbird-sdk-통합)
6. [애니메이션 구현](#6-애니메이션-구현)
7. [무한 스크롤 구현](#7-무한-스크롤-구현)
8. [성능 최적화](#8-성능-최적화)
9. [테스팅 전략](#9-테스팅-전략)
10. [에러 핸들링](#10-에러-핸들링)
11. [빌드 및 배포](#11-빌드-및-배포)
12. [보안](#12-보안)
13. [개발 가이드라인](#13-개발-가이드라인)
14. [부록](#14-부록)

---

## 1. 시스템 아키텍처

### 1.1 하이레벨 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                브라우저 (Chrome)                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │          Next.js 앱 (클라이언트)                  │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         프레젠테이션 레이어              │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐   │    │  │
│  │  │  │ ChannelList│  │ CreateButton    │   │    │  │
│  │  │  └────────────┘  └─────────────────┘   │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐   │    │  │
│  │  │  │ ChannelItem│  │ LoadingSpinner  │   │    │  │
│  │  │  └────────────┘  └─────────────────┘   │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐   │    │  │
│  │  │  │ErrorBoundary│  │ ErrorMessage   │   │    │  │
│  │  │  └────────────┘  └─────────────────┘   │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                       ↕                           │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │      styled-components 레이어            │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐    │    │  │
│  │  │  │ *.style.ts │  │ common.style.ts │    │    │  │
│  │  │  │ (컴포넌트별)│  │ (디자인 토큰)   │    │    │  │
│  │  │  └────────────┘  └─────────────────┘    │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                       ↕                           │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         비즈니스 로직 레이어             │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐    │    │  │
│  │  │  │   Hooks    │  │  Services       │    │    │  │
│  │  │  │  (_hooks/) │  │  (services/)    │    │    │  │
│  │  │  │- useChannel│  │  - getChannels  │    │    │  │
│  │  │  │  List      │  │  - createChannel│    │    │  │
│  │  │  │- useCreate │  │  - updateChannel│    │    │  │
│  │  │  │- useUpdate │  │  - client.ts    │    │    │  │
│  │  │  │- useInfinite│ │                 │    │    │  │
│  │  │  │  Scroll    │  │                 │    │    │  │
│  │  │  └────────────┘  └─────────────────┘    │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                       ↕                           │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │      데이터 레이어 (React Query)         │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐    │    │  │
│  │  │  │   Queries  │  │   Mutations     │    │    │  │
│  │  │  │  - infinite│  │   - create      │    │    │  │
│  │  │  │    Query   │  │   - update      │    │    │  │
│  │  │  └────────────┘  └─────────────────┘    │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                       ↕                           │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         SSR 지원 레이어                  │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐    │    │  │
│  │  │  │ registry.tsx│  │query-client.ts │    │    │  │
│  │  │  │ (styled-c.)│  │  (SSR/CSR)     │    │    │  │
│  │  │  └────────────┘  └─────────────────┘    │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
                    HTTPS/WebSocket
                          ↕
┌─────────────────────────────────────────────────────────┐
│                Sendbird 플랫폼                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Group Channel API                      │  │
│  │  - createChannel()                                │  │
│  │  - updateChannel()                                │  │
│  │  - createMyGroupChannelListQuery()                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 계층화된 아키텍처

**프레젠테이션 레이어**

- 책임: UI 렌더링, 사용자 인터랙션, 애니메이션
- 기술: React 컴포넌트 (app/\_components/), ErrorBoundary
- 통신: 비즈니스 로직 레이어의 hooks 사용

**styled-components 레이어** (Session 08)

- 책임: 컴포넌트 스타일링, 디자인 토큰, SSR 스타일링
- 기술: styled-components 6.1.19, 컴포넌트별 \*.style.ts 파일
- 위치: \_styles/common.style.ts (디자인 토큰), \_styles/global.style.ts (GlobalStyle)
- 통신: 프레젠테이션 레이어 컴포넌트에서 소비

**비즈니스 로직 레이어**

- 책임: 비즈니스 규칙, 데이터 변환, 상태 관리
- 기술: 커스텀 React hooks (\_hooks/), 서비스 함수 (services/)
- 위치: \_hooks/ (private), services/sendbird/channel/ (API 분리)
- 통신: 데이터 페칭에 React Query 사용

**데이터 레이어**

- 책임: 서버 상태 관리, 캐싱, 동기화
- 기술: React Query (TanStack Query v5)
- 위치: app/providers.tsx의 QueryClientProvider
- 통신: 서비스 레이어를 통해 Sendbird SDK와 통신

**SSR 지원 레이어** (Session 08)

- 책임: 서버 사이드 렌더링 최적화
- 기술: styled-components SSR Registry, QueryClient SSR/CSR 호환성
- 위치: lib/registry.tsx, lib/query-client.ts
- 통신: layout.tsx에서 애플리케이션을 감쌈

**외부 통합 레이어**

- 책임: Sendbird SDK 통합
- 기술: @sendbird/chat SDK v4.20.2
- 위치: services/sendbird/client.ts
- 통신: REST API / WebSocket

---

## 2. 기술 스택

### 2.1 핵심 의존성

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^15.0.0",
    "@sendbird/chat": "^4.20.2",
    "@tanstack/react-query": "^5.90.10",
    "@tanstack/react-query-devtools": "^5.90.10",
    "styled-components": "6.1.19",
    "@formkit/auto-animate": "0.9.0"
  },
  "notes": {
    "removed": [
      "tailwindcss (Session 08 - CSS Modules 및 Tailwind 제거, styled-components로 통일)",
      "CSS Modules (Session 08 - styled-components *.style.ts 파일로 교체)"
    ],
    "added": [
      "styled-components 6.1.19 (Session 08 - SSR 지원 포함)",
      "@formkit/auto-animate 0.9.0 (Step 4 - 재배치 애니메이션)"
    ]
  }
}
```

### 2.2 개발 의존성

```json
{
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",

    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",

    "prettier": "^3.1.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.0.0",

    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",

    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

### 2.3 런타임 요구사항

- **Node.js**: >= 20.x LTS
- **npm**: >= 10.x 또는 **pnpm**: >= 8.x
- **브라우저**: Chrome >= 120 (최신)
- **OS**: macOS, Linux, Windows (개발환경)

---

## 3. 컴포넌트 설계

### 3.1 컴포넌트 트리

```
RootLayout (layout.tsx) [Server Component]
├── StyledComponentsRegistry [Client Component]
└── Providers [Client Component]
    └── QueryClientProvider
        └── Home (page.tsx) [Server Component]
            └── PageLayout [Client Component]
                ├── Header Section
                ├── ChannelActions [Client Component]
                │   └── CreateChannelButton
                │       └── LoadingSpinner (조건부)
                │
                └── ChannelList [Client Component]
                    ├── LoadingSpinner (조건부, 초기 로드)
                    ├── ErrorMessage (조건부)
                    ├── EmptyState (조건부)
                    │
                    └── ChannelItem[] (map)
                        ├── ChannelAvatar
                        └── ChannelName
```

### 3.2 컴포넌트 사양

#### 3.2.1 ChannelList 컴포넌트

**파일**: `app/_components/ChannelList/ChannelList.tsx`

**책임:**

- 채널 리스트 페칭 및 표시
- 무한 스크롤 처리
- 애니메이션을 위한 호버 상태 관리
- 자식 컴포넌트 조정

**Props 인터페이스:**

```typescript
interface ChannelListProps {
  className?: string
}
```

**내부 상태:**

```typescript
interface ChannelListState {
  hoveredIndex: number | null
  containerRef: RefObject<HTMLDivElement>
}
```

**사용하는 주요 Hooks:**

- `useChannelList()` - infinite query로 채널 페칭
- `useInfiniteScroll()` - 스크롤 하단 감지
- `useHoverAnimation()` - 호버 상태 관리

**구현 패턴:**

```typescript
export function ChannelList({ className }: ChannelListProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useChannelList();

  const { containerRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage
  });

  const { hoveredIndex, handleHover, handleLeave } = useHoverAnimation();

  // 페이지네이션된 데이터를 평탄화
  const channels = data?.pages.flatMap(page => page.channels) ?? [];

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;
  if (channels.length === 0) return <EmptyState />;

  return (
    <div ref={containerRef} className={styles.container}>
      {channels.map((channel, index) => (
        <ChannelItem
          key={channel.url}
          channel={channel}
          isHovered={hoveredIndex === index}
          isAdjacent={
            hoveredIndex !== null &&
            Math.abs(hoveredIndex - index) === 1
          }
          onMouseEnter={() => handleHover(index)}
          onMouseLeave={handleLeave}
        />
      ))}
      {isFetchingNextPage && <LoadingSpinner size="small" />}
    </div>
  );
}
```

---

#### 3.2.2 ChannelItem 컴포넌트

**파일**: `app/_components/ChannelItem/ChannelItem.tsx`

**책임:**

- 개별 채널 렌더링
- 호버 애니메이션 적용
- 업데이트를 위한 클릭 이벤트 처리

**Props 인터페이스:**

```typescript
interface ChannelItemProps {
  channel: Channel
  isHovered: boolean
  isAdjacent: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick?: (channel: Channel) => void
}
```

**애니메이션 상태:**

- 기본: `translateX(0)`
- 호버됨: `translateX(40px)`
- 인접: `translateX(20px)`

**구현 패턴:**

```typescript
export const ChannelItem = memo(function ChannelItem({
  channel,
  isHovered,
  isAdjacent,
  onMouseEnter,
  onMouseLeave,
  onClick
}: ChannelItemProps) {
  const { mutate: updateChannel, isPending } = useUpdateChannel();

  const handleClick = useCallback(() => {
    if (isPending) return;

    const newName = generateRandomName();
    updateChannel({ channelUrl: channel.url, newName });
  }, [channel.url, isPending, updateChannel]);

  const transform = isHovered ? 40 : isAdjacent ? 20 : 0;

  return (
    <div
      className={styles.item}
      style={{ transform: `translateX(${transform}px)` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick ?? handleClick}
      role="button"
      tabIndex={0}
    >
      <span className={styles.name}>{channel.name}</span>
      {isPending && <LoadingSpinner size="tiny" />}
    </div>
  );
});
```

**styled-components 스타일링** (`ChannelItem.style.ts`):

```typescript
import styled from 'styled-components'
import { colors } from '@/_styles/common.style'

export const ChannelItemContainer = styled.div<{ $isUpdating: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.gray[200]};
  background: ${colors.background.main};
  cursor: pointer;
  opacity: ${props => (props.$isUpdating ? 0.6 : 1)};

  transition:
    transform 250ms ease-in-out,
    background-color 200ms ease;

  &:hover {
    background-color: ${colors.gray[50]};
  }
`

export const ChannelName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.text.primary};
  user-select: none;
`
```

---

#### 3.2.3 CreateChannelButton 컴포넌트

**파일**: `app/_components/CreateChannelButton/CreateChannelButton.tsx`

**책임:**

- 채널 생성 트리거
- 생성 중 로딩 상태 표시
- 에러 처리

**Props 인터페이스:**

```typescript
interface CreateChannelButtonProps {
  className?: string
  onSuccess?: (channel: Channel) => void
}
```

**구현 패턴:**

```typescript
export function CreateChannelButton({
  className,
  onSuccess
}: CreateChannelButtonProps) {
  const { mutate: createChannel, isPending, isError } = useCreateChannel({
    onSuccess: (channel) => {
      onSuccess?.(channel);
    }
  });

  const handleClick = () => {
    const name = generateRandomName();
    createChannel({ name });
  };

  return (
    <button
      className={clsx(styles.button, className)}
      onClick={handleClick}
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? (
        <>
          <LoadingSpinner size="small" />
          생성 중...
        </>
      ) : (
        '새 채널 만들기'
      )}
    </button>
  );
}
```

---

## 4. 상태 관리

### 4.1 상태 아키텍처

**하이브리드 상태 관리** 방식 사용:

1. **서버 상태**: React Query로 관리
   - 채널 리스트 데이터
   - 로딩/에러 상태
   - 캐시 관리
   - 백그라운드 리페칭

2. **로컬 UI 상태**: React hooks로 관리
   - 호버 애니메이션 상태
   - 스크롤 위치
   - 임시 UI 플래그

### 4.2 React Query 설정

**파일**: `app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분 (기존 cacheTime)
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4.3 Query Keys 구조

**파일**: `services/api/queryKeys.ts`

```typescript
export const queryKeys = {
  channels: {
    all: ['channels'] as const,
    lists: () => [...queryKeys.channels.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.channels.lists(), filters] as const,
    details: () => [...queryKeys.channels.all, 'detail'] as const,
    detail: (url: string) => [...queryKeys.channels.details(), url] as const,
  },
  sendbird: {
    connection: ['sendbird', 'connection'] as const,
  },
} as const
```

### 4.4 커스텀 Hooks

#### 4.4.1 useChannelList Hook

**파일**: `_hooks/useChannelList.ts`

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchChannels } from '@/services/sendbird/channel.service'
import { queryKeys } from '@/services/api/queryKeys'

interface UseChannelListOptions {
  limit?: number
}

export function useChannelList(options: UseChannelListOptions = {}) {
  const limit = options.limit ?? 10

  return useInfiniteQuery({
    queryKey: queryKeys.channels.list('alphabetical'),
    queryFn: ({ pageParam }) =>
      fetchChannels({
        limit,
        token: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextToken,
    select: data => ({
      pages: data.pages,
      channels: data.pages.flatMap(page => page.channels),
    }),
  })
}
```

#### 4.4.2 useCreateChannel Hook

**파일**: `_hooks/useCreateChannel.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createChannel } from '@/services/sendbird/channel.service'
import { queryKeys } from '@/services/api/queryKeys'
import { sortChannels } from '@/utils/sortChannels'
import type { Channel } from '@/_types/channel.types'

interface CreateChannelParams {
  name: string
}

export function useCreateChannel(options?: { onSuccess?: (channel: Channel) => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateChannelParams) => createChannel(params),
    onSuccess: newChannel => {
      // 새 채널을 올바른 위치에 캐시 업데이트
      queryClient.setQueryData(queryKeys.channels.list('alphabetical'), (old: any) => {
        if (!old) return old

        const firstPage = old.pages[0]
        const updatedChannels = sortChannels([...firstPage.channels, newChannel])

        return {
          ...old,
          pages: [{ ...firstPage, channels: updatedChannels }, ...old.pages.slice(1)],
        }
      })

      options?.onSuccess?.(newChannel)
    },
  })
}
```

#### 4.4.3 useUpdateChannel Hook

**파일**: `_hooks/useUpdateChannel.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateChannel } from '@/services/sendbird/channel.service'
import { queryKeys } from '@/services/api/queryKeys'
import { sortChannels } from '@/utils/sortChannels'

interface UpdateChannelParams {
  channelUrl: string
  newName: string
}

export function useUpdateChannel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateChannelParams) => updateChannel(params),
    onSuccess: updatedChannel => {
      // 캐시 업데이트 및 재정렬
      queryClient.setQueryData(queryKeys.channels.list('alphabetical'), (old: any) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            channels: sortChannels(
              page.channels.map((ch: Channel) =>
                ch.url === updatedChannel.url ? updatedChannel : ch
              )
            ),
          })),
        }
      })
    },
  })
}
```

---

## 5. Sendbird SDK 통합

### 5.1 SDK 초기화

**파일**: `services/sendbird/client.ts`

```typescript
import SendbirdChat from '@sendbird/chat'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'
import type { SendbirdGroupChat } from '@sendbird/chat/groupChannel'

let sendbirdInstance: SendbirdGroupChat | null = null

export async function initializeSendbird(): Promise<SendbirdGroupChat> {
  if (sendbirdInstance) {
    return sendbirdInstance
  }

  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
  if (!appId) {
    throw new Error('NEXT_PUBLIC_SENDBIRD_APP_ID가 정의되지 않았습니다')
  }

  try {
    sendbirdInstance = SendbirdChat.init({
      appId,
      localCacheEnabled: false, // 과제 요구사항 필수
      modules: [new GroupChannelModule()],
    }) as SendbirdGroupChat

    return sendbirdInstance
  } catch (error) {
    console.error('Sendbird 초기화 실패:', error)
    throw error
  }
}

export async function connectUser(userId: string): Promise<void> {
  const sb = await initializeSendbird()

  try {
    await sb.connect(userId)
  } catch (error) {
    console.error('사용자 연결 실패:', error)
    throw error
  }
}

export function getSendbirdInstance(): SendbirdGroupChat {
  if (!sendbirdInstance) {
    throw new Error('Sendbird가 초기화되지 않았습니다. initializeSendbird()를 먼저 호출하세요.')
  }
  return sendbirdInstance
}
```

### 5.2 채널 서비스 (Phase 6: 3개 파일로 분리)

채널 서비스는 단일 `channel.service.ts` 파일에서 3개의 별도 파일로 분리되어 모듈성이 향상되었습니다:

#### 5.2.1 채널 가져오기 서비스

**파일**: `services/sendbird/channel/getChannels.ts`

````typescript
import { getSendbirdInstance } from '../client'
import { toAppError, logError } from '@/_lib/errorUtils'
import { AppError, ErrorType } from '@/_types/error.types'
import type { Channel } from '@/_types/channel.types'
import type {
  GroupChannel,
  GroupChannelListQuery,
  GroupChannelListQueryParams,
} from '@sendbird/chat/groupChannel'
import { GroupChannelListOrder } from '@sendbird/chat/groupChannel'

export interface GetChannelsOptions {
  /** 한 번에 가져올 채널 수 (기본값: 10) */
  limit?: number
  /** 페이지네이션을 위한 query 인스턴스 (선택적) */
  query?: GroupChannelListQuery
}

export interface GetChannelsResult {
  /** 채널 목록 */
  channels: Channel[]
  /** 다음 페이지가 있는지 여부 */
  hasMore: boolean
  /** 다음 페이지를 위한 query 인스턴스 */
  query: GroupChannelListQuery
}

/**
 * Sendbird SDK를 사용하여 채널 목록을 가져옵니다.
 *
 * 페이지네이션을 지원하며, GroupChannel 객체를 Channel 타입으로 변환합니다.
 * query 인스턴스를 전달하면 다음 페이지를 가져오고, 없으면 첫 페이지를 가져옵니다.
 *
 * @param {GetChannelsOptions} options - 조회 옵션 (limit, query)
 * @returns {Promise<GetChannelsResult>} 채널 목록, hasMore, query 인스턴스
 * @throws {Error} Sendbird 인스턴스가 초기화되지 않았을 때
 *
 * @example
 * ```typescript
 * // 첫 페이지 가져오기
 * const result = await getChannels({ limit: 10 })
 * console.log(result.channels) // 첫 10개 채널
 * console.log(result.hasMore) // 더 많은 채널이 있는지
 *
 * // 다음 페이지 가져오기
 * const nextResult = await getChannels({ query: result.query })
 * console.log(nextResult.channels) // 다음 10개 채널
 * ```
 */
export async function getChannels(options: GetChannelsOptions = {}): Promise<GetChannelsResult> {
  const { limit = 10, query: existingQuery } = options

  // Sendbird 인스턴스 가져오기
  const sendbird = getSendbirdInstance()

  if (!sendbird) {
    throw new AppError(
      ErrorType.SENDBIRD_INIT_FAILED,
      '서비스 연결에 실패했습니다. 페이지를 새로고침해주세요.',
      'Sendbird instance not initialized'
    )
  }

  try {
    let query: GroupChannelListQuery

    // 기존 query가 있으면 재사용, 없으면 새로 생성
    if (existingQuery) {
      query = existingQuery
    } else {
      // GroupChannelListQuery 파라미터 설정
      const params: GroupChannelListQueryParams = {
        limit,
        includeEmpty: true, // 빈 채널도 포함
        order: GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL, // 알파벳순 정렬 (과제 요구사항)
      }

      // 쿼리 생성
      query = sendbird.groupChannel.createMyGroupChannelListQuery(params)
    }

    // 채널 목록 조회
    const groupChannels: GroupChannel[] = await query.next()

    // GroupChannel을 Channel 타입으로 변환
    const channels: Channel[] = groupChannels.map(gc => ({
      url: gc.url,
      name: gc.name,
      createdAt: gc.createdAt,
      ...(gc.customType && { customType: gc.customType }),
      ...(gc.data && { data: gc.data }),
    }))

    // 결과 반환
    return {
      channels,
      hasMore: query.hasNext,
      query, // query 인스턴스 반환 (다음 페이지를 위해)
    }
  } catch (error) {
    // AppError로 변환하여 일관된 에러 처리
    const appError = toAppError(error, ErrorType.CHANNEL_FETCH_FAILED)
    logError(appError, 'getChannels')
    throw appError
  }
}
````

#### 5.2.2 채널 생성 서비스

**파일**: `services/sendbird/channel/createChannel.ts`

```typescript
import { getSendbirdInstance } from '../client'
import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { Channel } from '@/_types/channel.types'

// Sendbird GroupChannel을 Channel 타입으로 변환
function transformChannel(groupChannel: GroupChannel): Channel {
  return {
    url: groupChannel.url,
    name: groupChannel.name,
    createdAt: groupChannel.createdAt,
    customType: groupChannel.customType,
    data: groupChannel.data,
  }
}

interface CreateChannelParams {
  name: string
}

/**
 * 새 채널 생성
 * 중요: 과제에서 허용된 SDK 함수만 사용
 */
export async function createChannel({ name }: CreateChannelParams): Promise<Channel> {
  const sb = getSendbirdInstance()

  try {
    const params = {
      name, // 랜덤 8자 문자열
      isDistinct: false,
      operatorUserIds: [],
    }

    const groupChannel = await sb.groupChannel.createChannel(params)
    return transformChannel(groupChannel)
  } catch (error) {
    console.error('채널 생성 실패:', error)
    throw error
  }
}
```

#### 5.2.3 채널 업데이트 서비스

**파일**: `services/sendbird/channel/updateChannel.ts`

```typescript
import { getSendbirdInstance } from '../client'
import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { Channel } from '@/_types/channel.types'

// Sendbird GroupChannel을 Channel 타입으로 변환
function transformChannel(groupChannel: GroupChannel): Channel {
  return {
    url: groupChannel.url,
    name: groupChannel.name,
    createdAt: groupChannel.createdAt,
    customType: groupChannel.customType,
    data: groupChannel.data,
  }
}

interface UpdateChannelParams {
  channelUrl: string
  newName: string
}

/**
 * 채널 이름 업데이트
 * 중요: 과제에서 허용된 SDK 함수만 사용
 */
export async function updateChannel({
  channelUrl,
  newName,
}: UpdateChannelParams): Promise<Channel> {
  const sb = getSendbirdInstance()

  try {
    const channel = await sb.groupChannel.getChannel(channelUrl)
    const updatedChannel = await channel.updateChannel({
      name: newName, // 랜덤 8자 문자열
    })

    return transformChannel(updatedChannel)
  } catch (error) {
    console.error('채널 업데이트 실패:', error)
    throw error
  }
}
```

---

## 6. 애니메이션 구현

### 6.1 styled-components 기반 애니메이션

**전략**: GPU 가속과 최적의 성능을 위해 CSS transforms 사용, styled-components로 구현

**파일**: `app/_components/ChannelItem/ChannelItem.style.ts`

```typescript
import styled from 'styled-components'
import { colors } from '@/_styles/common.style'

export const ChannelItemContainer = styled.div<{ $isUpdating: boolean }>`
  /* 기본 스타일 */
  display: flex;
  align-items: center;
  height: 60px;
  padding: 12px 16px;
  background: ${colors.background.main};
  border-bottom: 1px solid ${colors.gray[200]};
  cursor: pointer;

  /* 애니메이션 속성 */
  transform: translateX(0);
  opacity: ${props => (props.$isUpdating ? 0.6 : 1)};
  transition:
    transform 250ms ease-in-out,
    background-color 200ms ease;

  /* 성능 최적화 */
  will-change: transform;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;

  /* 호버 효과 */
  &:hover {
    background-color: ${colors.gray[50]};
  }

  /* 호버 애니메이션 - data attribute로 제어 */
  &[data-hovered='true'] {
    transform: translateX(40px);
  }

  &[data-adjacent='true'] {
    transform: translateX(20px);
  }
`

// 공통 애니메이션 (common.style.ts)
export const animations = {
  fadeSlideIn: keyframes`
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,
  // 재배치 애니메이션은 @formkit/auto-animate가 자동 처리
}
```

### 6.2 호버 애니메이션 상태 관리

**파일**: `_hooks/useHoverAnimation.ts`

```typescript
import { useState, useCallback } from 'react'

interface UseHoverAnimationReturn {
  hoveredIndex: number | null
  handleHover: (index: number) => void
  handleLeave: () => void
}

export function useHoverAnimation(): UseHoverAnimationReturn {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleHover = useCallback((index: number) => {
    setHoveredIndex(index)
  }, [])

  const handleLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  return {
    hoveredIndex,
    handleHover,
    handleLeave,
  }
}
```

### 6.3 리스트 재정렬 애니메이션

채널 생성/업데이트 재배치의 경우:

```typescript
// auto-animate 라이브러리 (선택사항)
import { useAutoAnimate } from '@formkit/auto-animate/react';

export function ChannelList() {
  const [parent] = useAutoAnimate({
    duration: 300,
    easing: 'ease-in-out'
  });

  return (
    <div ref={parent} className={styles.list}>
      {channels.map(channel => (
        <ChannelItem key={channel.url} channel={channel} />
      ))}
    </div>
  );
}
```

**대안: React Transition Group을 사용한 수동 전환**

```typescript
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export function ChannelList() {
  return (
    <TransitionGroup className={styles.list}>
      {channels.map(channel => (
        <CSSTransition
          key={channel.url}
          timeout={300}
          classNames="channel-item"
        >
          <ChannelItem channel={channel} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
```

---

## 7. 무한 스크롤 구현

### 7.1 Intersection Observer 방식

**파일**: `_hooks/useInfiniteScroll.ts`

```typescript
import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  enabled: boolean
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll({
  onLoadMore,
  enabled,
  threshold = 1.0,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      {
        root: containerRef.current,
        rootMargin,
        threshold,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [enabled, onLoadMore, rootMargin, threshold])

  return { containerRef, sentinelRef }
}
```

**ChannelList에서 사용:**

```typescript
export function ChannelList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useChannelList();

  const { containerRef, sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    enabled: Boolean(hasNextPage && !isFetchingNextPage)
  });

  return (
    <div ref={containerRef} className={styles.container}>
      {channels.map(channel => (
        <ChannelItem key={channel.url} channel={channel} />
      ))}

      {/* intersection observer를 위한 sentinel 요소 */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
}
```

### 7.2 컨테이너 높이 제한

```css
.container {
  max-height: calc(60px * 10); /* 10개 항목 × 60px 높이 */
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* 커스텀 스크롤바 스타일링 */
.container::-webkit-scrollbar {
  width: 8px;
}

.container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

## 8. 성능 최적화

### 8.1 React 최적화

**메모이제이션:**

```typescript
// ChannelItem.tsx
export const ChannelItem = memo(
  function ChannelItem(props) {
    // 컴포넌트 구현
  },
  (prevProps, nextProps) => {
    // 커스텀 비교
    return (
      prevProps.channel.url === nextProps.channel.url &&
      prevProps.isHovered === nextProps.isHovered &&
      prevProps.isAdjacent === nextProps.isAdjacent
    )
  }
)
```

**비용이 많이 드는 계산에 useMemo 사용:**

```typescript
const sortedChannels = useMemo(() => {
  return sortChannels(channels)
}, [channels])
```

**안정적인 함수 참조를 위한 useCallback:**

```typescript
const handleChannelClick = useCallback(
  (channel: Channel) => {
    updateChannel({ channelUrl: channel.url, newName: generateRandomName() })
  },
  [updateChannel]
)
```

### 8.2 번들 최적화

**Next.js 설정** (`next.config.js`):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode 활성화
  reactStrictMode: true,

  // 컴파일러 옵션
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 실험적 기능
  experimental: {
    optimizePackageImports: ['@sendbird/chat'],
  },

  // Webpack 설정
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 번들 분석기 (개발용만)
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        )
      }
    }
    return config
  },
}

module.exports = nextConfig
```

### 8.3 styled-components 성능

```typescript
import styled from 'styled-components'

// ✅ 좋음 - GPU 가속 (transform 사용)
const ChannelItemContainer = styled.div`
  transform: translateX(40px);
  will-change: transform; // 필요할 때만 적용

  &:hover {
    will-change: auto; // 애니메이션 후 제거
  }

  /* ❌ 나쁨 - 레이아웃 재계산 유발 */
  /* left: 40px; */
`

// 레이아웃 최적화를 위한 contain 사용
const ChannelListContainer = styled.div`
  contain: layout style paint;
`

// SSR 최적화: ServerStyleSheet 사용
// src/lib/registry.tsx에서 FOUC 방지
```

---

## 9. 테스팅 전략

### 9.1 테스트 구조

```
__tests__/
├── unit/
│   ├── utils/
│   │   ├── generateRandomName.test.ts
│   │   └── sortChannels.test.ts
│   ├── _hooks/
│   │   ├── useSendbird.test.ts
│   │   ├── useChannelList.test.ts
│   │   └── useHoverAnimation.test.ts
│   └── services/
│       └── channel.service.test.ts
├── integration/
│   ├── channel-creation-flow.test.tsx
│   ├── channel-update-flow.test.tsx
│   └── infinite-scroll-flow.test.tsx
└── app/_components/
    ├── ChannelItem.test.tsx
    ├── ChannelList.test.tsx
    └── CreateChannelButton.test.tsx
```

### 9.2 Jest 설정

**파일**: `jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'app/_components/**/*.{js,jsx,ts,tsx}',
    '_hooks/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

**파일**: `jest.setup.js`

```javascript
import '@testing-library/jest-dom'

// Sendbird SDK 모킹
jest.mock('@sendbird/chat', () => ({
  __esModule: true,
  default: {
    init: jest.fn(() => ({
      connect: jest.fn(),
      groupChannel: {
        createMyGroupChannelListQuery: jest.fn(),
        createChannel: jest.fn(),
      },
    })),
  },
}))

// IntersectionObserver 모킹
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}
```

### 9.3 테스트 케이스 예시

**단위 테스트**: `utils/generateRandomName.test.ts`

```typescript
import { generateRandomName } from './generateRandomName'

describe('generateRandomName', () => {
  it('길이 8의 문자열을 반환해야 함', () => {
    const name = generateRandomName()
    expect(name).toHaveLength(8)
  })

  it('소문자만 포함해야 함', () => {
    const name = generateRandomName()
    expect(name).toMatch(/^[a-z]{8}$/)
  })

  it('여러 번 호출 시 다른 이름을 생성해야 함', () => {
    const name1 = generateRandomName()
    const name2 = generateRandomName()

    // 충돌 확률은 매우 낮음
    expect(name1).not.toBe(name2)
  })

  it('100개의 고유한 이름을 생성해야 함', () => {
    const names = Array.from({ length: 100 }, () => generateRandomName())
    const uniqueNames = new Set(names)

    // 아주 작은 충돌 확률 허용
    expect(uniqueNames.size).toBeGreaterThan(95)
  })
})
```

**컴포넌트 테스트**: `app/_components/ChannelItem.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ChannelItem } from './ChannelItem';
import type { Channel } from '@/_types/channel.types';

const mockChannel: Channel = {
  url: 'channel-123',
  name: 'testchan',
  createdAt: Date.now(),
};

describe('ChannelItem', () => {
  it('채널 이름을 렌더링해야 함', () => {
    render(
      <ChannelItem
        channel={mockChannel}
        isHovered={false}
        isAdjacent={false}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      />
    );

    expect(screen.getByText('testchan')).toBeInTheDocument();
  });

  it('호버 시 transform을 적용해야 함', () => {
    const { container } = render(
      <ChannelItem
        channel={mockChannel}
        isHovered={true}
        isAdjacent={false}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      />
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveStyle({ transform: 'translateX(40px)' });
  });

  it('인접 시 transform을 적용해야 함', () => {
    const { container } = render(
      <ChannelItem
        channel={mockChannel}
        isHovered={false}
        isAdjacent={true}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      />
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveStyle({ transform: 'translateX(20px)' });
  });

  it('호버 시 onMouseEnter를 호출해야 함', () => {
    const handleMouseEnter = jest.fn();
    const { container } = render(
      <ChannelItem
        channel={mockChannel}
        isHovered={false}
        isAdjacent={false}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {}}
      />
    );

    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });
});
```

---

## 10. 에러 핸들링

### 10.1 Error Boundary

**파일**: `app/_components/ErrorBoundary.tsx`

```typescript
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('경계에서 포착된 에러:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>문제가 발생했습니다</h2>
          <details>
            <summary>에러 상세</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 10.2 API 에러 처리

**파일**: `services/api/errors.ts`

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class NetworkError extends Error {
  constructor(message: string = '네트워크 요청 실패') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class SendbirdError extends Error {
  constructor(
    message: string,
    public code?: number
  ) {
    super(message)
    this.name = 'SendbirdError'
  }
}

export function handleSendbirdError(error: unknown): never {
  if (error instanceof Error) {
    throw new SendbirdError(error.message)
  }
  throw new SendbirdError('알 수 없는 Sendbird 에러')
}
```

### 10.3 사용자용 에러 메시지

**파일**: `app/_components/ErrorMessage/ErrorMessage.tsx`

```typescript
interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const userMessage = React.useMemo(() => {
    if (error instanceof NetworkError) {
      return '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.';
    }
    if (error instanceof SendbirdError) {
      return '채팅 서버와의 통신에 실패했습니다. 다시 시도해주세요.';
    }
    return '예기치 않은 오류가 발생했습니다. 다시 시도해주세요.';
  }, [error]);

  return (
    <div className={styles.container} role="alert">
      <div className={styles.icon}>⚠️</div>
      <p className={styles.message}>{userMessage}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          다시 시도
        </button>
      )}
    </div>
  );
}
```

---

## 11. 빌드 및 배포

### 11.1 개발 워크플로우

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test

# 워치 모드로 테스트 실행
npm test -- --watch

# 커버리지와 함께 테스트 실행
npm test -- --coverage

# 코드 린트
npm run lint

# 코드 포맷
npm run format

# 타입 체크
npm run type-check

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start
```

### 11.2 환경 변수

**파일**: `.env.local.example`

```bash
# Sendbird 설정
NEXT_PUBLIC_SENDBIRD_APP_ID=your_app_id_here

# 연결용 사용자 ID (개발용)
NEXT_PUBLIC_SENDBIRD_USER_ID=test_user_1

# 선택사항: 분석
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### 11.3 빌드 설정

**프로덕션 최적화:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "analyze": "ANALYZE=true next build"
  }
}
```

### 11.4 배포 (Vercel)

**파일**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SENDBIRD_APP_ID": "@sendbird-app-id"
  }
}
```

**단계:**

1. GitHub 저장소를 Vercel에 연결
2. Vercel 대시보드에서 환경 변수 추가
3. main 브랜치에 푸시 시 자동 배포
4. Pull Request에 대한 프리뷰 배포

---

## 12. 보안

### 12.1 환경 변수 보안

```typescript
// 빌드 시점에 환경 변수 검증
function validateEnv() {
  const required = ['NEXT_PUBLIC_SENDBIRD_APP_ID']

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`필수 환경 변수 누락: ${key}`)
    }
  }
}

validateEnv()
```

### 12.2 입력 새니타이제이션

```typescript
// 랜덤 이름을 생성하지만, 나중에 사용자 입력이 추가되면 새니타이즈
export function sanitizeChannelName(name: string): string {
  // HTML/스크립트 태그 제거
  return name
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .trim()
    .slice(0, 8) // 8자 제한 강제
}
```

### 12.3 XSS 방지

```typescript
// React는 기본적으로 이스케이프하지만 명시적으로 표현
export function ChannelItem({ channel }: Props) {
  return (
    <div>
      {/* 안전 - React가 자동으로 이스케이프 */}
      <span>{channel.name}</span>

      {/* 안전하지 않음 - dangerouslySetInnerHTML 피하기 */}
      {/* <div dangerouslySetInnerHTML={{ __html: channel.name }} /> */}
    </div>
  );
}
```

---

## 13. 개발 가이드라인

### 13.1 코드 스타일

**TypeScript:**

- strict mode 사용
- `any` 타입 피하기
- 객체에는 type보다 interface 선호
- 적절한 곳에 const assertion 사용

**React:**

- 함수형 컴포넌트만 사용
- 상태 관리에 hooks 사용
- 성능 최적화에 memo 사용
- 설명적인 컴포넌트 이름 (PascalCase)

**파일 네이밍:**

- 컴포넌트: `ComponentName.tsx`
- Hooks: `useHookName.ts`
- Utils: `functionName.ts`
- Types: `entityName.types.ts`
- Tests: `fileName.test.ts`

### 13.2 Git 워크플로우

```bash
# 브랜치 네이밍
feature/channel-creation
fix/hover-animation-bug
refactor/split-services
test/add-integration-tests

# 커밋 메시지 (Conventional Commits)
feat: 채널 생성 버튼 추가
fix: 호버 애니메이션 지연 해결
test: sortChannels 단위 테스트 추가
docs: 설치 지침으로 README 업데이트
refactor: 채널 서비스 로직 추출
```

### 13.3 코드 리뷰 체크리스트

- [ ] TypeScript 에러 없이 컴파일
- [ ] 모든 테스트 통과
- [ ] 테스트 커버리지 ≥ 80%
- [ ] ESLint 에러 없음
- [ ] Prettier로 포맷됨
- [ ] console.log 문 없음 (에러 처리 제외)
- [ ] 컴포넌트가 적절히 메모이제이션됨
- [ ] 접근성 속성 추가 (ARIA)
- [ ] 성능 테스트 (애니메이션 끊김 없음)
- [ ] 문서 업데이트

---

## 14. 부록

### 14.1 유틸리티 함수

**파일**: `utils/generateRandomName.ts`

```typescript
/**
 * 랜덤 8자 소문자 영문 문자열 생성
 * 채널 이름에 대한 과제 요구사항
 */
export function generateRandomName(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  let result = ''

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length)
    result += letters[randomIndex]
  }

  return result
}
```

**파일**: `utils/sortChannels.ts`

```typescript
import type { Channel } from '@/_types/channel.types'

/**
 * 이름으로 채널을 알파벳 순으로 정렬 (대소문자 구분 없음)
 */
export function sortChannels(channels: Channel[]): Channel[] {
  return [...channels].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
}
```

### 14.2 타입 정의

**파일**: `types/channel.types.ts`

```typescript
export interface Channel {
  url: string
  name: string
  createdAt: number
  customType?: string
  data?: string
}

export interface ChannelListResponse {
  channels: Channel[]
  nextToken?: string
}
```

### 14.3 상수

**파일**: `utils/constants.ts`

```typescript
export const CHANNEL_CONFIG = {
  LIMIT_PER_PAGE: 10,
  ITEM_HEIGHT: 60, // 픽셀
  MAX_VISIBLE_ITEMS: 10,
  CONTAINER_HEIGHT: 600, // 60px × 10
} as const

export const ANIMATION_CONFIG = {
  HOVER_OFFSET: 40, // 픽셀
  ADJACENT_OFFSET: 20, // 픽셀
  TRANSITION_DURATION: 250, // 밀리초
  EASING: 'ease-in-out',
} as const
```

---

**기술 사양서 끝**

---

## 문서 변경 이력

| 버전  | 날짜       | 작성자 | 변경 사항                                                                                                                                                                                                          |
| ----- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0.0 | 2025-11-23 | 개발팀 | 초기 기술 사양서 작성                                                                                                                                                                                              |
| 1.0.1 | 2025-11-24 | 개발팀 | Production 완료 상태 반영, styled-components 및 SSR 최적화 내용 업데이트 (의존성, 컴포넌트 트리, 애니메이션 구현, CSS 성능 섹션), 실제 테스트 결과 반영 (161 tests, 85%+ coverage)                                 |
| 1.0.2 | 2025-11-28 | 개발팀 | 아키텍처 다이어그램 업데이트 (Session 06 private 폴더, Session 08 styled-components, Phase 6 API 분리), 의존성 노트 추가 (제거/추가된 패키지), 계층화 아키텍처에 SSR 레이어 추가, 채널 서비스 3개 파일 분리 문서화 |

---

## 승인

| 역할          | 이름 | 날짜 | 서명 |
| ------------- | ---- | ---- | ---- |
| 기술 리드     | -    | -    | -    |
| 시니어 개발자 | -    | -    | -    |
| QA 리드       | -    | -    | -    |
