# Technical Specification

## Dynamic Channel List with Animation

---

## Document Information

| Item                  | Details                       |
| --------------------- | ----------------------------- |
| **Document Type**     | Technical Specification       |
| **Version**           | 1.0.1                         |
| **Last Updated**      | 2025-11-24                    |
| **Status**            | ✅ Production (v1.0 Complete) |
| **Related Documents** | PRD_EN.md                     |
| **Authors**           | Development Team              |
| **Tests Passed**      | 161/161 (100%)                |
| **Coverage**          | 85%+                          |

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Component Design](#3-component-design)
4. [State Management](#4-state-management)
5. [Sendbird SDK Integration](#5-sendbird-sdk-integration)
6. [Animation Implementation](#6-animation-implementation)
7. [Infinite Scroll Implementation](#7-infinite-scroll-implementation)
8. [Performance Optimization](#8-performance-optimization)
9. [Testing Strategy](#9-testing-strategy)
10. [Error Handling](#10-error-handling)
11. [Build & Deployment](#11-build--deployment)
12. [Security](#12-security)
13. [Development Guidelines](#13-development-guidelines)
14. [Appendices](#14-appendices)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Chrome)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Next.js App (Client)                 │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         Presentation Layer              │    │  │
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
│  │  │      styled-components Layer             │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐    │    │  │
│  │  │  │ *.style.ts │  │ common.style.ts │    │    │  │
│  │  │  │ (per comp.)│  │ (design tokens) │    │    │  │
│  │  │  └────────────┘  └─────────────────┘    │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                       ↕                           │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         Business Logic Layer             │    │  │
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
│  │  │         Data Layer (React Query)         │    │  │
│  │  │  ┌────────────┐  ┌─────────────────┐    │    │  │
│  │  │  │   Queries  │  │   Mutations     │    │    │  │
│  │  │  │  - infinite│  │   - create      │    │    │  │
│  │  │  │    Query   │  │   - update      │    │    │  │
│  │  │  └────────────┘  └─────────────────┘    │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                       ↕                           │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         SSR Support Layer                │    │  │
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
│                  Sendbird Platform                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Group Channel API                    │  │
│  │  - createChannel()                                │  │
│  │  - updateChannel()                                │  │
│  │  - createMyGroupChannelListQuery()                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Layered Architecture

**Presentation Layer**

- Responsible for: UI rendering, user interactions, animations
- Technologies: React components (app/\_components/), ErrorBoundary
- Communication: Consumes hooks from Business Logic Layer

**styled-components Layer** (Session 08)

- Responsible for: Component styling, design tokens, SSR styling
- Technologies: styled-components 6.1.19, \*.style.ts files per component
- Location: \_styles/common.style.ts (design tokens), \_styles/global.style.ts (GlobalStyle)
- Communication: Consumed by Presentation Layer components

**Business Logic Layer**

- Responsible for: Business rules, data transformation, state management
- Technologies: Custom React hooks (\_hooks/), service functions (services/)
- Location: \_hooks/ (private), services/sendbird/channel/ (API split)
- Communication: Uses React Query for data fetching

**Data Layer**

- Responsible for: Server state management, caching, synchronization
- Technologies: React Query (TanStack Query v5)
- Location: QueryClientProvider in app/providers.tsx
- Communication: Communicates with Sendbird SDK via service layer

**SSR Support Layer** (Session 08)

- Responsible for: Server-side rendering optimization
- Technologies: styled-components SSR Registry, QueryClient SSR/CSR compatibility
- Location: lib/registry.tsx, lib/query-client.ts
- Communication: Wraps application in layout.tsx

**External Integration Layer**

- Responsible for: Sendbird SDK integration
- Technologies: @sendbird/chat SDK v4.20.2
- Location: services/sendbird/client.ts
- Communication: REST API / WebSocket

---

## 2. Technology Stack

### 2.1 Core Dependencies

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
      "tailwindcss (Session 08 - CSS Modules and Tailwind removed in favor of styled-components)",
      "CSS Modules (Session 08 - replaced with styled-components *.style.ts files)"
    ],
    "added": [
      "styled-components 6.1.19 (Session 08 - with SSR support)",
      "@formkit/auto-animate 0.9.0 (Step 4 - repositioning animations)"
    ]
  }
}
```

### 2.2 Development Dependencies

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

### 2.3 Runtime Requirements

- **Node.js**: >= 20.x LTS
- **npm**: >= 10.x or **pnpm**: >= 8.x
- **Browser**: Chrome >= 120 (Latest)
- **OS**: macOS, Linux, Windows (development)

---

## 3. Component Design

### 3.1 Component Tree

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
                │       └── LoadingSpinner (conditional)
                │
                └── ChannelList [Client Component]
                    ├── LoadingSpinner (conditional, initial load)
                    ├── ErrorMessage (conditional)
                    ├── EmptyState (conditional)
                    │
                    └── ChannelItem[] (map)
                        ├── ChannelAvatar
                        └── ChannelName
```

### 3.2 Component Specifications

#### 3.2.1 ChannelList Component

**File**: `app/_components/ChannelList/ChannelList.tsx`

**Responsibilities:**

- Fetch and display channel list
- Handle infinite scroll
- Manage hover state for animations
- Coordinate child components

**Props Interface:**

```typescript
interface ChannelListProps {
  className?: string
}
```

**Internal State:**

```typescript
interface ChannelListState {
  hoveredIndex: number | null
  containerRef: RefObject<HTMLDivElement>
}
```

**Key Hooks Used:**

- `useChannelList()` - Fetch channels with infinite query
- `useInfiniteScroll()` - Detect scroll bottom
- `useHoverAnimation()` - Manage hover state

**Implementation Pattern:**

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

  // Flatten paginated data
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

#### 3.2.2 ChannelItem Component

**File**: `app/_components/ChannelItem/ChannelItem.tsx`

**Responsibilities:**

- Render individual channel
- Apply hover animations
- Handle click event for update

**Props Interface:**

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

**Animation States:**

- Default: `translateX(0)`
- Hovered: `translateX(40px)`
- Adjacent: `translateX(20px)`

**Implementation Pattern:**

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

**styled-components Styling** (`ChannelItem.style.ts`):

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

#### 3.2.3 CreateChannelButton Component

**File**: `app/_components/CreateChannelButton/CreateChannelButton.tsx`

**Responsibilities:**

- Trigger channel creation
- Show loading state during creation
- Handle errors

**Props Interface:**

```typescript
interface CreateChannelButtonProps {
  className?: string
  onSuccess?: (channel: Channel) => void
}
```

**Implementation Pattern:**

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
          Creating...
        </>
      ) : (
        'Create new channel'
      )}
    </button>
  );
}
```

---

## 4. State Management

### 4.1 State Architecture

We use a **hybrid state management** approach:

1. **Server State**: Managed by React Query
   - Channel list data
   - Loading/error states
   - Cache management
   - Background refetching

2. **Local UI State**: Managed by React hooks
   - Hover animation state
   - Scroll position
   - Temporary UI flags

### 4.2 React Query Configuration

**File**: `app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
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

### 4.3 Query Keys Structure

**File**: `services/api/queryKeys.ts`

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

### 4.4 Custom Hooks

#### 4.4.1 useChannelList Hook

**File**: `_hooks/useChannelList.ts`

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

**File**: `_hooks/useCreateChannel.ts`

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
      // Update cache with new channel in correct position
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

**File**: `_hooks/useUpdateChannel.ts`

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
      // Update cache and re-sort
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

## 5. Sendbird SDK Integration

### 5.1 SDK Initialization

**File**: `services/sendbird/client.ts`

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
    throw new Error('NEXT_PUBLIC_SENDBIRD_APP_ID is not defined')
  }

  try {
    sendbirdInstance = SendbirdChat.init({
      appId,
      localCacheEnabled: false, // REQUIRED by assignment
      modules: [new GroupChannelModule()],
    }) as SendbirdGroupChat

    return sendbirdInstance
  } catch (error) {
    console.error('Failed to initialize Sendbird:', error)
    throw error
  }
}

export async function connectUser(userId: string): Promise<void> {
  const sb = await initializeSendbird()

  try {
    await sb.connect(userId)
  } catch (error) {
    console.error('Failed to connect user:', error)
    throw error
  }
}

export function getSendbirdInstance(): SendbirdGroupChat {
  if (!sendbirdInstance) {
    throw new Error('Sendbird not initialized. Call initializeSendbird() first.')
  }
  return sendbirdInstance
}
```

### 5.2 Channel Service (Phase 6: Split into 3 files)

The channel service was split from a single `channel.service.ts` file into three separate files for better modularity:

#### 5.2.1 Get Channels Service

**File**: `services/sendbird/channel/getChannels.ts`

```typescript
import { getSendbirdInstance } from '../client'
import { GroupChannelListOrder } from '@sendbird/chat/groupChannel'
import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { Channel } from '@/_types/channel.types'

// Transform Sendbird GroupChannel to our Channel type
function transformChannel(groupChannel: GroupChannel): Channel {
  return {
    url: groupChannel.url,
    name: groupChannel.name,
    createdAt: groupChannel.createdAt,
    customType: groupChannel.customType,
    data: groupChannel.data,
  }
}

interface GetChannelsParams {
  limit: number
  token?: string
}

interface GetChannelsResult {
  channels: Channel[]
  nextToken?: string
}

/**
 * Fetch channels using Sendbird SDK
 * IMPORTANT: Only allowed SDK function per assignment
 */
export async function getChannels({ limit, token }: GetChannelsParams): Promise<GetChannelsResult> {
  const sb = getSendbirdInstance()

  const query = sb.groupChannel.createMyGroupChannelListQuery({
    includeEmpty: true, // REQUIRED
    limit, // REQUIRED
    order: GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL, // REQUIRED
  })

  // If token exists, load specific page
  if (token) {
    // Note: Sendbird query doesn't support token-based pagination
    // We use hasNext and load next page
  }

  if (!query.hasNext) {
    return { channels: [], nextToken: undefined }
  }

  try {
    const groupChannels = await query.next()
    const channels = groupChannels.map(transformChannel)
    const nextToken = query.hasNext ? 'next' : undefined

    return { channels, nextToken }
  } catch (error) {
    console.error('Failed to fetch channels:', error)
    throw error
  }
}
```

#### 5.2.2 Create Channel Service

**File**: `services/sendbird/channel/createChannel.ts`

```typescript
import { getSendbirdInstance } from '../client'
import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { Channel } from '@/_types/channel.types'

// Transform Sendbird GroupChannel to our Channel type
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
 * Create a new channel
 * IMPORTANT: Only allowed SDK function per assignment
 */
export async function createChannel({ name }: CreateChannelParams): Promise<Channel> {
  const sb = getSendbirdInstance()

  try {
    const params = {
      name, // Random 8-letter string
      isDistinct: false,
      operatorUserIds: [],
    }

    const groupChannel = await sb.groupChannel.createChannel(params)
    return transformChannel(groupChannel)
  } catch (error) {
    console.error('Failed to create channel:', error)
    throw error
  }
}
```

#### 5.2.3 Update Channel Service

**File**: `services/sendbird/channel/updateChannel.ts`

```typescript
import { getSendbirdInstance } from '../client'
import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { Channel } from '@/_types/channel.types'

// Transform Sendbird GroupChannel to our Channel type
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
 * Update channel name
 * IMPORTANT: Only allowed SDK function per assignment
 */
export async function updateChannel({
  channelUrl,
  newName,
}: UpdateChannelParams): Promise<Channel> {
  const sb = getSendbirdInstance()

  try {
    const channel = await sb.groupChannel.getChannel(channelUrl)
    const updatedChannel = await channel.updateChannel({
      name: newName, // Random 8-letter string
    })

    return transformChannel(updatedChannel)
  } catch (error) {
    console.error('Failed to update channel:', error)
    throw error
  }
}
```

---

## 6. Animation Implementation

### 6.1 styled-components Based Animations

**Strategy**: Use CSS transforms for GPU acceleration and optimal performance, implemented with styled-components.

**File**: `app/_components/ChannelItem/ChannelItem.style.ts`

```typescript
import styled from 'styled-components'
import { colors } from '@/_styles/common.style'

export const ChannelItemContainer = styled.div<{ $isUpdating: boolean }>`
  /* Base styles */
  display: flex;
  align-items: center;
  height: 60px;
  padding: 12px 16px;
  background: ${colors.background.main};
  border-bottom: 1px solid ${colors.gray[200]};
  cursor: pointer;

  /* Animation properties */
  transform: translateX(0);
  opacity: ${props => props.$isUpdating ? 0.6 : 1};
  transition:
    transform 250ms ease-in-out,
    background-color 200ms ease;

  /* Performance optimization */
  will-change: transform;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;

  /* Hover effect */
  &:hover {
    background-color: ${colors.gray[50]};
  }

  /* Hover animation - controlled via data attributes */
  &[data-hovered='true'] {
    transform: translateX(40px);
  }

  &[data-adjacent='true'] {
    transform: translateX(20px);
  }
`

// Common animations (common.style.ts)
export const animations = {
  fadeSlideIn: keyframes`
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.item--entering {
  animation: slideInFromLeft 300ms ease-out;
}

/* Position change animation */
.item--repositioning {
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 6.2 Hover Animation State Management

**File**: `_hooks/useHoverAnimation.ts`

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

### 6.3 List Re-ordering Animation

For channel creation/update re-positioning:

```typescript
// Auto-animate library (optional)
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

**Alternative: Manual transition with React Transition Group**

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

## 7. Infinite Scroll Implementation

### 7.1 Intersection Observer Approach

**File**: `_hooks/useInfiniteScroll.ts`

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

**Usage in ChannelList:**

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

      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
}
```

### 7.2 Container Height Limitation

```css
.container {
  max-height: calc(60px * 10); /* 10 items × 60px height */
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* Custom scrollbar styling */
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

## 8. Performance Optimization

### 8.1 React Optimization

**Memoization:**

```typescript
// ChannelItem.tsx
export const ChannelItem = memo(
  function ChannelItem(props) {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return (
      prevProps.channel.url === nextProps.channel.url &&
      prevProps.isHovered === nextProps.isHovered &&
      prevProps.isAdjacent === nextProps.isAdjacent
    )
  }
)
```

**useMemo for expensive computations:**

```typescript
const sortedChannels = useMemo(() => {
  return sortChannels(channels)
}, [channels])
```

**useCallback for stable function references:**

```typescript
const handleChannelClick = useCallback(
  (channel: Channel) => {
    updateChannel({ channelUrl: channel.url, newName: generateRandomName() })
  },
  [updateChannel]
)
```

### 8.2 Bundle Optimization

**Next.js Configuration** (`next.config.js`):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['@sendbird/chat'],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Bundle analyzer (development only)
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

### 8.3 CSS Performance

```css
/* Use transform instead of left/top for animations */
.item {
  /* ✅ Good - GPU accelerated */
  transform: translateX(40px);

  /* ❌ Bad - triggers layout recalculation */
  /* left: 40px; */
}

/* Limit will-change usage */
.item {
  /* Only apply when necessary */
  will-change: transform;
}

.item:hover {
  /* Remove after animation */
  will-change: auto;
}

/* Use contain for layout optimization */
.list {
  contain: layout style paint;
}
```

### 8.4 Image and Asset Optimization

Although this project doesn't use images, best practices:

```typescript
// If using images in future
import Image from 'next/image';

<Image
  src="/channel-icon.png"
  width={40}
  height={40}
  alt="Channel"
  loading="lazy"
  placeholder="blur"
/>
```

---

## 9. Testing Strategy

### 9.1 Test Structure

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

### 9.2 Jest Configuration

**File**: `jest.config.js`

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

**File**: `jest.setup.js`

```javascript
import '@testing-library/jest-dom'

// Mock Sendbird SDK
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

// Mock IntersectionObserver
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

### 9.3 Example Test Cases

**Unit Test**: `utils/generateRandomName.test.ts`

```typescript
import { generateRandomName } from './generateRandomName'

describe('generateRandomName', () => {
  it('should return a string of length 8', () => {
    const name = generateRandomName()
    expect(name).toHaveLength(8)
  })

  it('should contain only lowercase letters', () => {
    const name = generateRandomName()
    expect(name).toMatch(/^[a-z]{8}$/)
  })

  it('should generate different names on multiple calls', () => {
    const name1 = generateRandomName()
    const name2 = generateRandomName()

    // Probability of collision is extremely low
    expect(name1).not.toBe(name2)
  })

  it('should generate 100 unique names', () => {
    const names = Array.from({ length: 100 }, () => generateRandomName())
    const uniqueNames = new Set(names)

    // Allow very small collision probability
    expect(uniqueNames.size).toBeGreaterThan(95)
  })
})
```

**Component Test**: `app/_components/ChannelItem.test.tsx`

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
  it('should render channel name', () => {
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

  it('should apply hovered transform', () => {
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

  it('should apply adjacent transform', () => {
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

  it('should call onMouseEnter when hovered', () => {
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

## 10. Error Handling

### 10.1 Error Boundary

**File**: `app/_components/ErrorBoundary.tsx`

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
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 10.2 API Error Handling

**File**: `services/api/errors.ts`

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
  constructor(message: string = 'Network request failed') {
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
  throw new SendbirdError('Unknown Sendbird error')
}
```

### 10.3 User-Facing Error Messages

**File**: `app/_components/ErrorMessage/ErrorMessage.tsx`

```typescript
interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const userMessage = React.useMemo(() => {
    if (error instanceof NetworkError) {
      return 'Network connection failed. Please check your internet connection.';
    }
    if (error instanceof SendbirdError) {
      return 'Failed to communicate with chat server. Please try again.';
    }
    return 'An unexpected error occurred. Please try again.';
  }, [error]);

  return (
    <div className={styles.container} role="alert">
      <div className={styles.icon}>⚠️</div>
      <p className={styles.message}>{userMessage}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          Retry
        </button>
      )}
    </div>
  );
}
```

---

## 11. Build & Deployment

### 11.1 Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

### 11.2 Environment Variables

**File**: `.env.local.example`

```bash
# Sendbird Configuration
NEXT_PUBLIC_SENDBIRD_APP_ID=your_app_id_here

# User ID for connection (development)
NEXT_PUBLIC_SENDBIRD_USER_ID=test_user_1

# Optional: Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### 11.3 Build Configuration

**Production optimizations:**

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

### 11.4 Deployment (Vercel)

**File**: `vercel.json`

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

**Steps:**

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
4. Preview deployments for pull requests

---

## 12. Security

### 12.1 Environment Variable Security

```typescript
// Validate environment variables at build time
function validateEnv() {
  const required = ['NEXT_PUBLIC_SENDBIRD_APP_ID']

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }
}

validateEnv()
```

### 12.2 Input Sanitization

```typescript
// Although we generate random names, sanitize if user input is added later
export function sanitizeChannelName(name: string): string {
  // Remove any HTML/script tags
  return name
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .trim()
    .slice(0, 8) // Enforce 8-character limit
}
```

### 12.3 XSS Prevention

```typescript
// React escapes by default, but be explicit
export function ChannelItem({ channel }: Props) {
  return (
    <div>
      {/* Safe - React escapes automatically */}
      <span>{channel.name}</span>

      {/* Unsafe - avoid dangerouslySetInnerHTML */}
      {/* <div dangerouslySetInnerHTML={{ __html: channel.name }} /> */}
    </div>
  );
}
```

---

## 13. Development Guidelines

### 13.1 Code Style

**TypeScript:**

- Use strict mode
- Avoid `any` type
- Prefer interfaces over types for objects
- Use const assertions where appropriate

**React:**

- Functional components only
- Hooks for state management
- Memo for performance optimization
- Descriptive component names (PascalCase)

**File naming:**

- Components: `ComponentName.tsx`
- Hooks: `useHookName.ts`
- Utils: `functionName.ts`
- Types: `entityName.types.ts`
- Tests: `fileName.test.ts`

### 13.2 Git Workflow

```bash
# Branch naming
feature/channel-creation
fix/hover-animation-bug
refactor/split-services
test/add-integration-tests

# Commit messages (Conventional Commits)
feat: add channel creation button
fix: resolve hover animation lag
test: add unit tests for sortChannels
docs: update README with setup instructions
refactor: extract channel service logic
```

### 13.3 Code Review Checklist

- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Test coverage ≥ 80%
- [ ] ESLint shows no errors
- [ ] Code is formatted with Prettier
- [ ] No console.log statements (except error handling)
- [ ] Components are properly memoized
- [ ] Accessibility attributes added (ARIA)
- [ ] Performance tested (no jank in animations)
- [ ] Documentation updated

---

## 14. Appendices

### 14.1 Utility Functions

**File**: `utils/generateRandomName.ts`

```typescript
/**
 * Generates a random 8-letter lowercase English string
 * Required by assignment for channel names
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

**File**: `utils/sortChannels.ts`

```typescript
import type { Channel } from '@/_types/channel.types'

/**
 * Sorts channels alphabetically by name (case-insensitive)
 */
export function sortChannels(channels: Channel[]): Channel[] {
  return [...channels].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
}
```

### 14.2 Type Definitions

**File**: `types/channel.types.ts`

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

### 14.3 Constants

**File**: `utils/constants.ts`

```typescript
export const CHANNEL_CONFIG = {
  LIMIT_PER_PAGE: 10,
  ITEM_HEIGHT: 60, // pixels
  MAX_VISIBLE_ITEMS: 10,
  CONTAINER_HEIGHT: 600, // 60px × 10
} as const

export const ANIMATION_CONFIG = {
  HOVER_OFFSET: 40, // pixels
  ADJACENT_OFFSET: 20, // pixels
  TRANSITION_DURATION: 250, // milliseconds
  EASING: 'ease-in-out',
} as const
```

---

**End of Technical Specification**

---

## Document Change Log

| Version | Date       | Author           | Changes                                                                                                                                                                                                                                                  |
| ------- | ---------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2025-11-23 | Development Team | Initial technical specification                                                                                                                                                                                                                          |
| 1.0.1   | 2025-11-24 | Development Team | Production completion status update, styled-components and SSR optimization content updates (dependencies, component tree, animation implementation, CSS performance section), actual test results reflected (161 tests, 85%+ coverage)                  |
| 1.0.2   | 2025-11-28 | Development Team | Architecture diagrams updated (Session 06 private folders, Session 08 styled-components, Phase 6 API split), dependencies notes added (removed/added packages), layered architecture expanded with SSR layer, channel service split (3 files) documented |

---

## Approval

| Role             | Name | Date | Signature |
| ---------------- | ---- | ---- | --------- |
| Tech Lead        | -    | -    | -         |
| Senior Developer | -    | -    | -         |
| QA Lead          | -    | -    | -         |
