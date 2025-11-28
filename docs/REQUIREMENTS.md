# Dynamic Channel List - 요구사항 분석

## 📋 프로젝트 개요

**목표**: 애니메이션과 함께 인터랙티브하게 움직이는 채널 리스트 뷰 구현

**브라우저 호환성**: 최신 Chrome 브라우저

**AI 도구 사용**: 허용 (제출 시 사용 내역 명시 필요)

---

## 🚫 제약사항 (Limitations)

### 필수 준수사항

1. **React 최신 버전 사용**
2. **GroupChannelCollection 사용 금지** - 채널 리스트 관리에 사용 불가
3. **Sendbird SDK 함수 제한** - 아래 명시된 함수만 사용 가능

### 허용된 Sendbird SDK 함수

```typescript
// 1. 초기화
SendbirdChat.init({
  appId: 'YOUR_APP_ID',
  localCacheEnabled: false,
  modules: [new GroupChannelModule()],
})

// 2. 연결
sendbirdChat.connect(userId)

// 3. 채널 리스트 쿼리 생성
sendbirdChat.groupChannel.createMyGroupChannelListQuery({
  includeEmpty: true,
  limit: 10,
  order: GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL,
})

// 4. 채널 생성
sendbirdChat.groupChannel.createChannel({
  name: '랜덤 8자 영문 문자열',
})

// 5. 채널 업데이트
channel.updateChannel({
  name: '랜덤 8자 영문 문자열',
})
```

---

## 📝 기능 요구사항 (4 Steps)

### Step 1: 애니메이션 리스트 (기본 UI)

**목표**: 더미 데이터로 애니메이션 리스트 구현

**요구사항**:

- [ ] 8자 영문 문자열 배열 생성 (더미 데이터)
- [ ] 알파벳 순으로 정렬된 리스트 표시
- [ ] 호버 애니메이션 구현:
  - 호버된 아이템: **40px 오른쪽** 이동
  - 인접 아이템 (위/아래 1개씩): **20px 오른쪽** 이동
  - 마우스가 나가면 원위치로 복귀

**기술 포인트**:

- CSS Transform (translateX)
- CSS Transition (부드러운 애니메이션)
- Hover 상태 관리

---

### Step 2: 채널 생성 기능

**목표**: Sendbird SDK로 실제 채널 생성

**요구사항**:

- [ ] "Create new channel" 버튼 추가 (상단)
- [ ] 버튼 클릭 시:
  - 랜덤 8자 영문 문자열 생성
  - Sendbird SDK로 채널 생성
  - 생성된 채널을 알파벳 순서에 맞게 리스트에 삽입
  - 애니메이션과 함께 삽입

**기술 포인트**:

- Random String Generator (8자, 영문 소문자)
- `createChannel()` API 호출
- 정렬된 리스트에 삽입 로직
- 리스트 재렌더링 최적화

---

### Step 3: 페이지네이션 (무한 스크롤)

**목표**: 실제 Sendbird 데이터로 교체 및 페이지네이션

**요구사항**:

- [ ] 리스트 높이 제한: **최대 10개 아이템 높이**
- [ ] Sendbird SDK로 채널 데이터 fetch
- [ ] 더미 데이터를 실제 데이터로 교체
- [ ] 스크롤이 하단에 도달하면:
  - 다음 10개 채널 로드
  - 기존 리스트에 추가
  - 로딩 상태 표시

**기술 포인트**:

- `createMyGroupChannelListQuery()` 사용
- `limit: 10` 페이지네이션
- Scroll Event Handling
- Intersection Observer API (선택)
- 무한 스크롤 구현
- 로딩/에러 상태 관리

---

### Step 4: 채널 업데이트 기능

**목표**: 채널 클릭 시 이름 변경

**요구사항**:

- [ ] 리스트 아이템에 클릭 이벤트 추가
- [ ] 클릭 시:
  - 새로운 랜덤 8자 영문 문자열 생성
  - Sendbird SDK로 채널 이름 업데이트
  - 업데이트된 채널을 알파벳 순서에 맞게 재배치
  - 애니메이션과 함께 이동

**기술 포인트**:

- `updateChannel()` API 호출
- 리스트 정렬 로직 재사용
- 최적화된 리렌더링 (불필요한 전체 리렌더링 방지)
- 애니메이션 트랜지션

---

## 🎯 핵심 기술 요구사항 정리

### 1. 알파벳 정렬

- 모든 Step에서 채널 이름 기준 알파벳 순 정렬 유지
- 삽입/업데이트 시 자동 정렬

### 2. 애니메이션

- 호버 시 translateX 애니메이션
- 채널 삽입/업데이트 시 부드러운 트랜지션
- CSS Transition 활용

### 3. Sendbird SDK 통합

- 제한된 함수만 사용
- localCacheEnabled: false
- includeEmpty: true
- limit: 10
- order: CHANNEL_NAME_ALPHABETICAL

### 4. 랜덤 문자열 생성

- 8자 영문 소문자
- 재사용 가능한 유틸 함수

---

## 🛠 제안하는 기술 스택

### 확정된 스택

- ✅ **React 18+**
- ✅ **Next.js 15** (App Router)
- ✅ **TypeScript**
- ✅ **Jest** (TDD)
- ✅ **React Query** (API 상태 관리)
- ✅ **Fetch API** (HTTP 통신)

### 추가 추천 라이브러리

#### 1. 테스트 관련

```json
{
  "@testing-library/react": "^14.x",
  "@testing-library/jest-dom": "^6.x",
  "@testing-library/user-event": "^14.x",
  "jest-environment-jsdom": "^29.x"
}
```

**이유**:

- React 컴포넌트 테스트에 필수
- TDD 방식으로 개발 시 필요
- 사용자 인터랙션 테스트 (호버, 클릭)

#### 2. 애니메이션 라이브러리 (선택)

```json
{
  "framer-motion": "^11.x"
}
```

**이유**:

- 복잡한 애니메이션 구현 시 유용
- 리스트 재정렬 애니메이션에 최적
- 하지만 **순수 CSS로 충분**할 수도 있음 (과제 복잡도에 따라)

#### 3. 코드 품질 도구

```json
{
  "eslint": "^8.x",
  "prettier": "^3.x",
  "husky": "^9.x",
  "lint-staged": "^15.x"
}
```

**이유**:

- 코드 스타일 일관성
- Pre-commit Hook으로 품질 보장
- 프로페셔널한 프로젝트 구성

#### 4. 유틸리티

```json
{
  "clsx": "^2.x" // 조건부 className 관리
}
```

---

## 📁 제안하는 프로젝트 구조

```
sendbird-channel-list/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ChannelList/
│   │   ├── ChannelList.tsx
│   │   ├── ChannelList.test.tsx
│   │   ├── ChannelList.module.css
│   │   └── index.ts
│   ├── ChannelItem/
│   │   ├── ChannelItem.tsx
│   │   ├── ChannelItem.test.tsx
│   │   ├── ChannelItem.module.css
│   │   └── index.ts
│   └── CreateChannelButton/
│       ├── CreateChannelButton.tsx
│       ├── CreateChannelButton.test.tsx
│       └── index.ts
├── hooks/
│   ├── useSendbird.ts
│   ├── useSendbird.test.ts
│   ├── useChannelList.ts
│   ├── useChannelList.test.ts
│   └── useInfiniteScroll.ts
├── services/
│   ├── sendbird/
│   │   ├── client.ts
│   │   ├── channel.service.ts
│   │   └── channel.service.test.ts
│   └── api/
│       └── queries.ts (React Query)
├── utils/
│   ├── generateRandomName.ts
│   ├── generateRandomName.test.ts
│   ├── sortChannels.ts
│   └── sortChannels.test.ts
├── types/
│   ├── channel.types.ts
│   └── sendbird.types.ts
├── constants/
│   └── sendbird.constants.ts
├── __tests__/
│   └── integration/
│       └── channel-flow.test.tsx
├── .env.local.example
├── jest.config.js
├── jest.setup.js
└── tsconfig.json
```

---

## ✅ TDD 체크리스트

### Unit Tests

- [ ] `generateRandomName()` - 8자 영문 문자열 생성
- [ ] `sortChannels()` - 채널 정렬 로직
- [ ] `ChannelItem` - 호버 애니메이션
- [ ] `ChannelList` - 리스트 렌더링
- [ ] `useSendbird` - SDK 초기화
- [ ] `useChannelList` - 채널 CRUD

### Integration Tests

- [ ] 채널 생성 플로우
- [ ] 채널 업데이트 플로우
- [ ] 무한 스크롤 플로우
- [ ] 정렬 및 재정렬

### E2E Tests (선택)

- [ ] 전체 사용자 시나리오

---

## 🎨 UI/UX 고려사항

### 필수

1. **로딩 상태**: 채널 로드 중 표시
2. **에러 핸들링**: API 실패 시 메시지
3. **빈 상태**: 채널이 없을 때 안내
4. **호버 피드백**: 마우스 커서 변경 (pointer)

### 추가 (선택)

5. **토스트 알림**: 채널 생성/업데이트 성공 메시지
6. **스켈레톤 UI**: 로딩 중 플레이스홀더
7. **트랜지션**: 리스트 재정렬 시 부드러운 이동
8. **접근성**: ARIA 속성, 키보드 네비게이션

---

## 🚀 개발 순서 제안

### Phase 1: 기반 구축 (TDD)

1. TypeScript 타입 정의
2. 유틸 함수 작성 + 테스트
3. Sendbird 서비스 레이어 + 테스트

### Phase 2: Step 1 (더미 데이터)

4. ChannelItem 컴포넌트 + 애니메이션
5. ChannelList 컴포넌트
6. 호버 애니메이션 테스트

### Phase 3: Step 2 (생성)

7. CreateButton 컴포넌트
8. 채널 생성 로직 + React Query
9. 정렬 및 삽입 테스트

### Phase 4: Step 3 (페이지네이션)

10. 무한 스크롤 훅
11. React Query Infinite Query
12. 스크롤 이벤트 처리

### Phase 5: Step 4 (업데이트)

13. 클릭 이벤트 핸들러
14. 채널 업데이트 로직
15. 재정렬 애니메이션

### Phase 6: 마무리

16. 통합 테스트
17. 코드 리팩토링
18. 문서화 (README, CLAUDE.md)

---

## 📌 주의사항

### Sendbird SDK 관련

- ⚠️ `localCacheEnabled: false` 필수
- ⚠️ `GroupChannelCollection` 사용 금지
- ⚠️ 명시된 5개 함수만 사용

### 성능 최적화

- React.memo 사용 (불필요한 리렌더링 방지)
- useMemo/useCallback 활용
- Virtual Scrolling (채널이 매우 많을 경우 고려)

### 타입 안전성

- Sendbird SDK 타입 정의 활용
- any 타입 지양
- 엄격한 타입 체크

---

## 🎁 추가 가점 요소 (선택사항)

### 1. 성능 최적화

- Lighthouse 점수 90+ 달성
- Bundle Size 최적화
- Code Splitting

### 2. 접근성 (a11y)

- WCAG 2.1 AA 준수
- 키보드 네비게이션
- 스크린 리더 지원

### 3. 문서화

- Storybook으로 컴포넌트 문서화
- JSDoc 주석
- Architecture Decision Records (ADR)

### 4. CI/CD

- GitHub Actions
- 자동 테스트 실행
- Vercel/Netlify 자동 배포

### 5. 에러 모니터링

- Sentry 연동 (선택)
- 에러 로깅 시스템

---

## 🔍 체크리스트 (제출 전,후 )

### 기능

- [ ] Step 1-4 모두 구현 완료
- [ ] 애니메이션 부드럽게 동작
- [ ] 알파벳 정렬 정상 작동
- [ ] 무한 스크롤 정상 작동

### 코드 품질

- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 에러 없음
- [ ] 모든 테스트 통과
- [ ] 코드 커버리지 80% 이상 (목표)

### 문서

- 모둔 문서는 영문버전(en)과 한국어버전(ko) 두가지로 만들자
- [ ] docs/ 디렉토리 하위에 문서를 정리해자(prd, 테크스펙문서 등등)
- [ ] README.md 작성
- [ ] CLAUDE.md (AI 사용 기록)
- [ ] 환경 변수 설정 가이드

### 제출물

- 전체 프롬프트를 문서화하여 제출이 필요함.(claude hooks로 구성하여 자동화 해놓자!)
