# Session 08: styled-components 마이그레이션 및 SSR 최적화

**날짜**: 2025-11-24
**소요 시간**: ~3시간
**상태**: ✅ 완료
**관련 이슈**: #37 (CSS 스타일링 통일)

---

## 📋 개요

Phase 5 완료 후 리팩토링 작업 진행. CSS Modules와 Tailwind가 혼재된 스타일링을 styled-components로 통일하고, SSR을 제대로 활용하지 못하던 구조를 개선하여 초기 로딩 성능을 최적화함.

---

## 🎯 작업 목표

1. CSS 스타일링 방식을 styled-components로 통일
2. 공통 스타일 추출 및 재사용성 향상
3. 무한 렌더링 버그 수정
4. styled-components SSR 지원 구현
5. Server Components 활용하여 SSR 최적화
6. 초기 로딩 화면 제거

---

## 💬 주요 대화 내역

### 1. styled-components 마이그레이션 제안

**개발자 (나)**:

```
다른 제안을 할게 styled-component 기반으로 바꾸는건 어때?
```

**배경**:

- Issue #37에서 CSS 통일 논의 중
- CSS Modules과 Tailwind가 혼재되어 일관성 부족
- styled-components가 TypeScript와 잘 맞고, 조건부 스타일링이 편리함

**결정**:

- styled-components로 전환하기로 결정
- 공통 스타일을 `common.style.ts`로 분리
- 각 컴포넌트별로 `*.style.ts` 파일 생성

---

### 2. 스타일 파일 분리 요청

**개발자 (나)**:

```
테스트 수정하기 전에 styled-components를 적용하면서 추가된 각 컴포넌트별 css들을 *.style.ts 분리하여 관리하는 형태로 가자.
그리고 중복추가된 css나 공통화가 가능한 css의 경우 common.style.ts 형태로 정리하는것도 좋은 방법일거 같아
```

**배경**:

- 처음엔 컴포넌트 파일 안에 styled-components 작성
- 파일이 길어지고 관심사 분리 필요
- 중복 스타일(색상, 애니메이션 등) 발견

**Claude 보조 작업**:

1. `src/_styles/common.style.ts` 생성
   - 40+ 색상 토큰 정리
   - 3개 keyframe 애니메이션
   - 5개 CSS 믹스인
   - 4개 베이스 컴포넌트
2. 7개 컴포넌트 스타일 파일 분리
3. 테스트 코드 수정 (className → style 체크)

---

### 3. 무한 렌더링 버그 발견

**개발자 (나)**:

```
Create Channel 버튼을 클릭하면
react-dom-client.development.js:3892 Uncaught Error: Maximum update depth exceeded.
This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
React limits the number of nested updates to prevent infinite loops.
에러가 발생한다 원인 분석해서 수정해
```

**원인 분석 (Claude)**:

- `ChannelList.tsx`의 `setRefs` 함수가 매 렌더링마다 재생성됨
- ref 콜백이 변경되었다고 React가 인식
- `animateRef`가 내부적으로 상태 업데이트 → 리렌더링 → 무한 루프

**해결 방법**:

```typescript
// Before (무한 루프)
const setRefs = (element: HTMLDivElement | null) => {
  if (typeof animateRef === 'function') {
    animateRef(element)
  }
  containerRef.current = element
}

// After (수정됨)
const setRefs = useCallback(
  (element: HTMLDivElement | null) => {
    if (typeof animateRef === 'function') {
      animateRef(element)
    }
    containerRef.current = element
  },
  [animateRef, containerRef]
)
```

**커밋**: `571f0cb` - styled-components 마이그레이션 및 버그 수정

---

### 4. SSR 최적화 요청

**개발자 (나)**:

```
현재 ssr의 이점을 전혀 사용하고 잇지 않은거 같아,
sdk init이나 채널 목록을 불러오거나 queryClient 세팅, styled-component의 registry 설정등
ssr에서 처리하면 첫 화면 노출에서 conneting.. 문구가 보여질일이 없을거 같은데
확인해보고 리팩토링 해보자
```

**문제점 분석**:

1. **styled-components SSR 미구성**: FOUC 발생 가능
2. **모든 초기화가 클라이언트 전용**: `useEffect`에서 초기화 → 로딩 화면 필수
3. **QueryClient 클라이언트 전용**: SSR 중 데이터 prefetch 불가
4. **page.tsx가 Client Component**: 전체 페이지가 클라이언트 렌더링

**개선 계획**:

1. styled-components Registry 추가
2. QueryClient SSR 호환
3. Sendbird 백그라운드 초기화
4. Server Components 활용

---

## 🔧 구현 세부사항

### Phase 1: styled-components Registry

**Claude 보조**:

- `src/lib/registry.tsx` 생성
- ServerStyleSheet을 통한 스타일 수집 및 주입
- `layout.tsx`에 Registry 적용

```tsx
// src/lib/registry.tsx
export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>
  )
}
```

---

### Phase 2: QueryClient SSR/CSR 호환

**Claude 보조**:

- `src/lib/query-client.ts` 생성
- 서버: 매 요청마다 새 인스턴스 (데이터 격리)
- 클라이언트: 싱글톤 패턴 (성능)

```typescript
// src/lib/query-client.ts
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient() // 서버: 새 인스턴스
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient // 클라이언트: 싱글톤
  }
}
```

---

### Phase 3: Sendbird 초기화 최적화

**주요 변경사항**:

- 로딩 화면 제거
- 백그라운드 초기화 (블로킹 X)
- `providers.tsx` 간소화 (127줄 → 76줄)

```typescript
// Before: 블로킹 초기화 + 로딩 화면
useEffect(() => {
  const init = async () => {
    await initSendbird() // ← 블로킹
    setIsReady(true)     // ← 이후에야 렌더링
  }
  init()
}, [])

if (!isReady) return <LoadingScreen />

// After: 백그라운드 초기화
useEffect(() => {
  const init = async () => {
    await initMocks()
    if (process.env.NEXT_PUBLIC_USE_MSW !== 'true') {
      initSendbirdAsync() // ← await 없음, 백그라운드 실행
    }
  }
  init()
}, [])

// 즉시 children 렌더링
return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
```

---

### Phase 4: Server Components 활용

**구조 변경**:

```
Before:
page.tsx (Client Component)
  └─ 모든 로직 포함

After:
page.tsx (Server Component) ← SSR
  ├─ PageLayout (Client Component) ← styled-components
  ├─ ChannelActions (Client Component) ← interactive 로직
  └─ ChannelList (Client Component) ← 데이터 fetching
```

**생성된 컴포넌트**:

- `src/app/_components/ChannelActions/ChannelActions.tsx` - 채널 생성 버튼 로직
- `src/app/_components/PageLayout/PageLayout.tsx` - styled-components 레이아웃

---

## 📊 결과

### 파일 변경사항

**Commit 1 (styled-components)**: `571f0cb`

```
30 files changed
+873 insertions, -1,198 deletions
```

**Commit 2 (SSR 최적화)**: `131bfc4`

```
9 files changed
+208 insertions, -198 deletions
```

### 생성된 파일

```
src/
  _styles/
    common.style.ts (217줄)
  lib/
    registry.tsx (28줄)
    query-client.ts (46줄)
  app/
    _components/
      */
        *.style.ts (7개 파일)
      ChannelActions/
        ChannelActions.tsx
      PageLayout/
        PageLayout.tsx
```

### 삭제된 파일

```
- 5개 CSS Module 파일
- tailwind.config.ts
- postcss.config.mjs
- src/app/page.style.ts
- src/app/providers.style.ts
```

### 테스트 결과

```
✅ Tests:  161/161 passed (100%)
✅ Build:  Successful
📦 Bundle: 304 kB (변화 없음)
⚡ SSR:    Fully optimized
```

---

## 🚀 개선 효과

### Before (문제점)

- ❌ "Connecting to Sendbird..." 로딩 화면 필수
- ❌ useEffect에서 초기화 → 늦은 렌더링
- ❌ 모든 컴포넌트가 Client Component
- ❌ styled-components FOUC 가능성
- ❌ QueryClient 클라이언트 전용
- ❌ CSS Modules + Tailwind 혼재

### After (개선)

- ✅ 즉시 UI 표시 (로딩 화면 제거)
- ✅ Sendbird 백그라운드 초기화
- ✅ page.tsx는 Server Component
- ✅ styled-components SSR 완벽 지원
- ✅ QueryClient SSR/CSR 양쪽 지원
- ✅ 단일 스타일링 방식 (styled-components)
- ✅ SEO 최적화 (정적 HTML 생성)
- ✅ 더 빠른 FCP (First Contentful Paint)

---

## 🎓 배운 점

### 1. styled-components 실전 적용

- Transient props (`$prop`) 패턴
- 공통 스타일 추출 및 재사용
- TypeScript 타입 안전성

### 2. React Ref 함수 메모이제이션의 중요성

- Ref 콜백은 `useCallback`으로 메모이제이션 필수
- 매 렌더링마다 새 함수 생성 시 무한 루프 가능

### 3. Next.js 15 SSR 최적화

- styled-components ServerStyleSheet 사용법
- Server/Client Component 분리 전략
- QueryClient SSR/CSR 호환 패턴

### 4. 초기화 전략

- 블로킹 초기화의 단점
- 백그라운드 초기화의 장점
- 에러 처리를 각 API 호출로 위임

---

---

### Phase 5: Dead Code 제거

**개발자 (나)**:

```
readme.md에 userId localStorage 저장 이 부분은 제거 해도 될거 같아
```

**배경**:

- localStorage userId 저장 기능 롤백 후 README에 아직 TODO로 남아있음
- Phase 6에서 "⏳ userId localStorage 저장" 항목 불필요

**Claude 보조**:

- README.md에서 localStorage 관련 TODO 제거
- 커밋 및 푸시 완료

**Commit**: `157bc46` - README 업데이트

---

### Phase 6: API 파일 정리 및 구조 개선

**개발자 (나)**:

```
그전에 api관련 파일들 정리를 해보자
현재 channel.service.ts, channels.ts 이 두개 파일에서 사용되는 api 들은 ssr에서 호출되는 규격이지?
```

**문제점 발견**:

1. **Dead Code 존재**:
   - `src/services/api/channels.ts` - 사용되지 않는 wrapper layer
   - `src/_hooks/useChannels.ts` - 어디서도 import되지 않음
   - `src/__tests__/services/api/channels.test.ts` - 고아 테스트 파일

2. **파일 구조 혼란**:
   - `channel.service.ts` (216줄) - 3개 API가 단일 파일에 존재
   - 가독성 저하 및 유지보수 어려움

**해결 방법**:

**Step 1: Dead Code 제거**

```bash
# 삭제된 파일
- src/services/api/channels.ts
- src/_hooks/useChannels.ts
- src/__tests__/services/api/channels.test.ts
- 빈 디렉토리: src/services/api/, src/__tests__/services/api/
```

**Step 2: API 파일 분리**

개발자 제안:

```
channel.service.ts 이 파일 내에 있는 api들 각각 별도의 파일로 분리해보자
그래야 가독성이 좋을거 같아.
service/sendbird/channel/getChannels
service/sendbird/channel/createChannel
service/sendbird/channel/updateChannel
```

**새로운 파일 구조**:

```
src/services/sendbird/channel/
├── getChannels.ts      (109줄) - 채널 목록 조회 + 페이지네이션
├── createChannel.ts    (58줄)  - 랜덤 이름으로 채널 생성
└── updateChannel.ts    (73줄)  - 채널 이름 업데이트
```

**Import 경로 변경**:

```typescript
// Before
import * as channelService from '@/services/sendbird/channel.service'
const mockGetChannels = channelService.getChannels as jest.MockedFunction<...>

// After
import { getChannels } from '@/services/sendbird/channel/getChannels'
import { createChannel } from '@/services/sendbird/channel/createChannel'
import { updateChannel } from '@/services/sendbird/channel/updateChannel'
const mockGetChannels = getChannels as jest.MockedFunction<typeof getChannels>
```

**영향 받은 파일**:

```
수정된 파일: 13개
- 3개 hooks: useChannelList.ts, useCreateChannel.ts, useUpdateChannel.ts
- 6개 테스트: page.test.tsx, channel.service.test.ts, ChannelList.integration.test.tsx,
              useChannelList.test.tsx, useCreateChannel.test.tsx, useUpdateChannel.test.tsx
- 1개 서비스: channel.service.ts → 삭제, 3개 파일로 분리
```

**테스트 결과**:

```
✅ Tests:  152/152 passed (1 skipped)
✅ Build:  Successful
📦 Bundle: 304 kB (변화 없음)
```

**커밋**:

- Commit 3: `157bc46` - Dead code 제거
- Commit 4: `ffd4cc3` - API 파일 분리

---

## 🔄 다음 단계

1. **문서 업데이트**
   - README.md 파일 구조 업데이트 ✅
   - TECH_SPEC.md 업데이트 (EN/KO)
   - 세션 문서 업데이트

2. **ESLint 경고 수정** (Issue #41)
   - 36개 ESLint 경고 존재
   - 테스트 코드의 `any` 타입 사용

3. **성능 최적화** (Issue #40)
   - React.memo, useMemo, useCallback 적용

---

## 📝 메모

- **개발 주도**: 개발자가 리팩토링 방향 결정, Claude는 구현 보조
- **점진적 개선**: styled-components → SSR → Dead code 제거 → API 분리 순으로 진행
- **테스트 주도**: 모든 변경 후 테스트 통과 확인
- **문서화**: 커밋 메시지에 상세한 변경사항 기록
- **가독성 우선**: 단일 파일(216줄) → 3개 파일(58~109줄)로 분리하여 명확성 향상

---

## 📊 전체 작업 통계

### 커밋 이력

1. `571f0cb` - styled-components 마이그레이션 및 무한 렌더링 버그 수정
2. `131bfc4` - SSR 최적화 (Registry, QueryClient, Server Components)
3. `157bc46` - Dead code 제거 (channels.ts, useChannels.ts)
4. `ffd4cc3` - API 파일 분리 (channel.service.ts → 3개 파일)

### 최종 결과

```
파일 변경: 52개
추가: +1,344줄
삭제: -1,686줄
순 감소: -342줄 (코드 정리 효과)
```

**개선 효과**:

- ✅ 스타일링 통일 (styled-components)
- ✅ SSR 완벽 지원 (초기 로딩 최적화)
- ✅ Dead code 제거 (유지보수성 향상)
- ✅ API 파일 분리 (가독성 향상)
- ✅ Single Responsibility 원칙 준수
- ✅ 명확한 Import 경로

---

_이 세션은 2025-11-24에 완료되었습니다._
