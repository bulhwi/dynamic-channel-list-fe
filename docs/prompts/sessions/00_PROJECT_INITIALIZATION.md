# 프로젝트 초기화 - 대화 로그

**날짜**: 2025-11-23
**세션**: 초기 설정 및 문서화

---

## 세션 개요

이 문서는 동적 채널 리스트 프로젝트 설정, PRD 및 기술 사양서 작성을 위해 사용자와 Claude Code 간에 이루어진 초기 대화를 기록합니다.

---

## 대화 요약

### 🎯 사용자의 초기 요청

**사용자**:

```
현재 디렉토리에에서 docs하위에 잇는 문서를 분석하여 prd 작성해줘.
_JS__EN__Assignment_for_Messaging_Apps_(UIKit)_-_Dynamic_Channel_List.pdf 문서가 원본 요구사항 문서이고,
_JS__EN__Assignment_for_Messaging_Apps_(UIKit)_-_Dynamic_Channel_List.pdf를 바탕으로 내가 추가적으로 필요한 사항들을 정리한 문서가 REQUIREMENTS.md 문서야.
이해했지?
```

---

### 📝 Claude의 응답 및 작업

**확인**: Claude가 작업을 이해했음을 확인함.

**수행한 작업**:

1. 두 문서 읽기:
   - `docs/_JS__EN__Assignment_for_Messaging_Apps_(UIKit)_-_Dynamic_Channel_List.pdf`
   - `docs/REQUIREMENTS.md`

2. 두 출처의 요구사항 분석:
   - **PDF**: 원본 Sendbird 과제 (Step 1-4, SDK 제약사항, 애니메이션)
   - **REQUIREMENTS.md**: 확장 요구사항 (기술 스택, TDD, 문서화 등)

3. 포괄적인 PRD 문서 작성:
   - `docs/PRD_EN.md` - 영어 버전 (~1,000줄)
   - `docs/PRD_KO.md` - 한국어 버전 (~1,000줄)

---

### 📊 식별된 주요 요구사항

#### 원본 PDF에서:

**Step 1: 더미 데이터를 활용한 애니메이션 리스트**

- 알파벳 순으로 정렬된 리스트 생성
- 호버 애니메이션:
  - 호버된 항목: 오른쪽으로 40px
  - 인접 항목: 오른쪽으로 20px
  - 마우스가 떠나면 원래 위치로 복귀

**Step 2: 채널 생성**

- "Create new channel" 버튼
- 무작위 8글자 영어 문자열 이름
- 자동 알파벳 순 삽입

**Step 3: 페이지네이션**

- 컨테이너 높이 10개 항목으로 제한
- Sendbird SDK에서 실제 채널 가져오기
- 무한 스크롤 구현

**Step 4: 채널 업데이트**

- 클릭하여 채널 이름 업데이트
- 새로운 무작위 8글자 문자열
- 자동 재배치

**SDK 제약사항**:

- 특정 Sendbird 함수 5개만 허용
- `localCacheEnabled: false` 필수
- `GroupChannelCollection` 금지

#### REQUIREMENTS.md에서:

**기술 스택**:

- React 18+ / Next.js 15 / TypeScript
- 상태 관리를 위한 React Query
- 테스팅을 위한 Jest
- TDD 접근법

**추가 요구사항**:

- 테스트 커버리지 ≥80%
- 영어 + 한국어 문서
- 프롬프트 문서화 (hooks를 통한 자동화)
- 상세한 프로젝트 구조

---

### 🔄 후속 요청

**사용자**:

```
응, 작성해보자
그리고 한국어 문서와 영문문서를 docs/ko, docs/en 하위로 분리해서 관리하자
또, 프롬프트 문서화도 바로 해줘 claude hooks로 설정해두면 편할거 같아,
너랑 내가 주고받은 질문/답변/실행계획등 정리해서 문서화를 하면 좋을거 같아
```

---

### 🛠 Claude의 구현 계획

**생성한 Todo 리스트**:

1. ✅ 디렉토리 구조 생성 (docs/en, docs/ko)
2. ✅ 기존 PRD 파일을 언어별 디렉토리로 이동
3. ✅ TECH_SPEC_EN.md 작성 (영어 기술 사양서)
4. ✅ TECH_SPEC_KO.md 작성 (한국어 기술 사양서)
5. ✅ 프롬프트 문서화를 위한 Claude hooks 설정
6. ✅ 현재 대화 내용으로 초기 프롬프트 문서 생성

---

### 📁 디렉토리 재구성

**변경 전**:

```
docs/
├── PRD_EN.md
├── PRD_KO.md
├── REQUIREMENTS.md
└── *.pdf
```

**변경 후**:

```
docs/
├── en/
│   ├── PRD.md
│   └── TECH_SPEC.md
├── ko/
│   ├── PRD.md
│   ├── TECH_SPEC.md
│   └── REQUIREMENTS.md
├── prompts/
│   └── 00_PROJECT_INITIALIZATION.md (이 파일)
└── *.pdf
```

---

### 📄 생성된 문서

#### 1. 제품 요구사항 문서 (PRD)

**위치**:

- `docs/en/PRD.md` (영어)
- `docs/ko/PRD.md` (한국어)

**구조** (16개 섹션):

1. 문서 정보
2. 요약
3. 목표 및 목적
4. 사용자 스토리 (US-001 ~ US-005)
5. 기능 요구사항 (FR-001 ~ FR-014)
6. 기술 요구사항
7. 비기능 요구사항
8. 제약사항 및 한계
9. 사용자 인터페이스 요구사항
10. 테스팅 요구사항
11. 개발 단계 (6단계)
12. 위험 및 완화 방안
13. 성공 기준
14. 결과물 체크리스트
15. 부록
16. 승인 및 서명

**주요 특징**:

- 정량적 성공 지표 (60 FPS, 80% 커버리지, <2s 로드)
- 수락 기준이 포함된 상세한 사용자 스토리
- 단계별 기능 요구사항
- 테스트 체크리스트가 포함된 TDD 접근법
- 단계 기반 개발 일정

---

#### 2. 기술 사양서 (TECH_SPEC)

**위치**:

- `docs/en/TECH_SPEC.md` (영어)
- `docs/ko/TECH_SPEC.md` (한국어)

**구조** (14개 섹션):

1. 시스템 아키텍처 (계층화된 아키텍처 다이어그램)
2. 기술 스택 (상세 의존성)
3. 컴포넌트 설계 (트리 + 사양)
4. 상태 관리 (React Query + hooks)
5. Sendbird SDK 통합 (클라이언트 + 서비스)
6. 애니메이션 구현 (CSS + hooks)
7. 무한 스크롤 구현 (Intersection Observer)
8. 성능 최적화 (React + 번들 + CSS)
9. 테스팅 전략 (Jest + RTL + 커버리지)
10. 에러 처리 (boundaries + API 에러)
11. 빌드 및 배포 (워크플로우 + Vercel)
12. 보안 (환경 변수 + 새니타이제이션)
13. 개발 가이드라인 (코드 스타일 + Git)
14. 부록 (유틸리티 + 타입 + 상수)

**주요 특징**:

- 코드 예제가 포함된 상세한 컴포넌트 사양
- React Query 설정 및 커스텀 hooks
- 완전한 Sendbird SDK 통합 가이드
- CSS 예제가 포함된 애니메이션 구현
- 포괄적인 테스팅 전략
- 성능 최적화 기법
- 프로덕션 준비 빌드 설정

---

### 🔧 Claude Hooks 설정

**생성한 Hook**: `.claude/hooks/user-prompt-submit`

**목적**: 모든 사용자 프롬프트를 일일 대화 파일에 자동으로 기록

**설정**:

- 로그 디렉토리: `docs/prompts/`
- 로그 파일 형식: `conversation_YYYYMMDD.md`
- 타임스탬프 형식: `YYYY-MM-DD HH:MM:SS`

**기능**:

- 로그 디렉토리가 없으면 생성
- 헤더가 포함된 일일 로그 파일 생성
- 타임스탬프와 함께 각 사용자 프롬프트 추가
- 시간순 대화 이력 유지

**파일 권한**: 실행 가능 (`chmod +x`)

---

## 주요 기술적 결정

### 1. 기술 스택

**핵심**:

- React 18+ (최신 기능)
- App Router를 활용한 Next.js 15 (현대적 아키텍처)
- TypeScript strict mode (타입 안전성)

**상태 관리**:

- React Query v5 (서버 상태)
- React hooks (로컬 UI 상태)

**테스팅**:

- Jest + React Testing Library
- 80% 커버리지 목표

**코드 품질**:

- ESLint + Prettier
- Husky + lint-staged

---

### 2. 아키텍처 패턴

**계층화된 아키텍처**:

1. **표현 계층**: React 컴포넌트, CSS Modules
2. **비즈니스 로직 계층**: 커스텀 hooks, 서비스
3. **데이터 계층**: React Query (캐싱, 동기화)
4. **외부 통합**: Sendbird SDK

**이점**:

- 명확한 관심사 분리
- 각 계층을 독립적으로 테스트 가능
- 확장 가능하고 유지보수 용이

---

### 3. 상태 관리 전략

**하이브리드 접근법**:

- **서버 상태**: React Query (채널, 로딩, 에러)
- **로컬 UI 상태**: React hooks (호버, 스크롤, UI 플래그)

**근거**:

- React Query는 서버 상태 관리에 탁월함
- React hooks는 간단한 UI 상태에 충분함
- 이 사용 사례에서 Redux 복잡성을 회피

---

### 4. 애니메이션 전략

**CSS Transforms** (선호):

- GPU 가속 (`translateX`)
- 부드러운 60 FPS 성능
- 레이아웃 스래싱 없음

**대안** (선택사항):

- 복잡한 애니메이션을 위한 Framer Motion
- 리스트 트랜지션을 위한 React Transition Group

**근거**:

- CSS가 가장 빠르고 성능이 좋음
- JavaScript 애니메이션은 필요한 경우에만

---

### 5. 무한 스크롤 구현

**Intersection Observer API**:

- 스크롤 이벤트보다 나은 성능
- 수동 throttling/debouncing이 필요 없음
- 내장 threshold 및 rootMargin 옵션

**대안** (선택되지 않음):

- 스크롤 이벤트 + throttle (성능 낮음)

---

### 6. 테스팅 접근법

**테스트 주도 개발 (TDD)**:

1. 테스트를 먼저 작성
2. 테스트를 통과하는 최소한의 코드 구현
3. 리팩토링
4. 반복

**커버리지 목표**: ≥80%

**테스트 타입**:

- 유닛 테스트 (유틸리티, hooks, 서비스)
- 컴포넌트 테스트 (렌더링, 상호작용, 애니메이션)
- 통합 테스트 (전체 사용자 플로우)

---

## 정의된 성공 지표

| 지표                     | 목표            | 측정 방법            |
| ------------------------ | --------------- | -------------------- |
| 애니메이션 FPS           | 60 FPS          | 성능 모니터링        |
| 테스트 커버리지          | ≥80%            | Jest 커버리지 리포트 |
| 로드 시간 (초기)         | <2s             | Lighthouse           |
| 로드 시간 (페이지네이션) | <500ms          | 네트워크 타이밍      |
| 코드 품질                | 0 ESLint 에러   | CI/CD                |
| TypeScript               | `any` 타입 없음 | tsc 컴파일러         |
| Lighthouse 점수          | ≥90             | Lighthouse 감사      |

---

## 다음 단계

### 즉시 (1주차):

1. Next.js 15 프로젝트 초기화
2. ESLint, Prettier, Husky 설정
3. Jest 및 React Testing Library 설정
4. TypeScript 타입 정의
5. 유틸리티 함수 구현 (TDD)

### 단기 (1-2주차):

6. Step 1 구현 (더미 데이터를 활용한 애니메이션 리스트)
7. Step 2 구현 (채널 생성)
8. Sendbird SDK 통합
9. React Query 설정

### 중기 (2주차):

10. Step 3 구현 (페이지네이션 + 실제 데이터)
11. Step 4 구현 (채널 업데이트)
12. 성능 최적화
13. 접근성 개선

### 최종 (3주차):

14. 포괄적인 테스팅
15. 코드 리뷰 및 리팩토링
16. 문서화 완료
17. 배포 설정 (Vercel)
18. 최종 제출 준비

---

## 미해결 질문

1. **Sendbird 사용자 ID**:
   - Q: 테스트에 사용할 사용자 ID는?
   - A: 환경 변수 `NEXT_PUBLIC_SENDBIRD_USER_ID` 사용 가능

2. **채널 제한**:
   - Q: 예상되는 최대 채널 수는?
   - A: 과제에서 지정하지 않음, 확장성을 위해 무한 스크롤 구현

3. **브라우저 테스팅**:
   - Q: 최신 Chrome만, 아니면 여러 버전?
   - A: 과제에서 "최신 Chrome"만 지정

4. **배포**:
   - Q: 앱을 어디에 배포해야 하는가?
   - A: Vercel 권장 (Next.js 네이티브 지원)

---

## 이번 세션에서 수정/생성된 파일

### 생성됨:

1. `docs/en/PRD.md` (~1,000줄)
2. `docs/ko/PRD.md` (~1,000줄)
3. `docs/en/TECH_SPEC.md` (~1,200줄)
4. `docs/ko/TECH_SPEC.md` (~1,200줄)
5. `.claude/hooks/user-prompt-submit` (bash 스크립트)
6. `docs/prompts/00_PROJECT_INITIALIZATION.md` (이 파일)

### 이동됨:

1. `docs/PRD_EN.md` → `docs/en/PRD.md`
2. `docs/PRD_KO.md` → `docs/ko/PRD.md`
3. `docs/REQUIREMENTS.md` → `docs/ko/REQUIREMENTS.md`

### 생성된 디렉토리:

1. `docs/en/`
2. `docs/ko/`
3. `docs/prompts/`
4. `.claude/hooks/`

---

## 배운 점

1. **먼저 포괄적인 분석**: 작성 전에 두 소스 문서를 철저히 읽으면 완전한 PRD를 만드는 데 도움이 됨

2. **구조화된 문서화**: 일관된 구조 (PRD 16개 섹션, TECH_SPEC 14개 섹션)를 따르면 문서 탐색이 쉬워짐

3. **이중 언어 문서화**: EN 및 KO 버전을 미리 만들면 국제 및 국내 이해를 모두 보장함

4. **자동화가 핵심**: 프롬프트 로깅을 위한 Claude hooks 설정은 수동 문서화 노력을 절약함

5. **처음부터 TDD**: PRD에 테스트 요구사항을 정의하면 품질이 나중에 추가되는 것이 아니라 내장됨

---

## 참고 자료

### 소스 문서:

- `docs/_JS__EN__Assignment_for_Messaging_Apps_(UIKit)_-_Dynamic_Channel_List.pdf`
- `docs/ko/REQUIREMENTS.md`

### 생성된 문서:

- `docs/en/PRD.md`
- `docs/ko/PRD.md`
- `docs/en/TECH_SPEC.md`
- `docs/ko/TECH_SPEC.md`

### 외부 참고 자료:

- [Sendbird Dashboard](https://dashboard.sendbird.com/)
- [Sendbird Chat SDK for JavaScript](https://sendbird.com/docs/chat/sdk/v4/javascript/overview)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Jest Documentation](https://jestjs.io/)

---

## 세션 종료

**총 소요 시간**: ~1시간
**생성된 문서**: 6개 파일
**작성된 줄 수**: ~5,000+ 줄
**상태**: ✅ 모든 초기 문서화 완료

---

**다음 세션**: 프로젝트 초기화 (Next.js 설정, 의존성 설치)

---

_이 문서는 자동 생성되며 Claude hooks를 통해 `docs/prompts/conversation_\*.md` 파일의 일일 대화 로그로 보완됩니다.\_
