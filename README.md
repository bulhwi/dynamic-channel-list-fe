# 애니메이션을 활용한 동적 채널 리스트

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![Sendbird](https://img.shields.io/badge/Sendbird-4.20.2-purple)](https://sendbird.com/)
[![License](https://img.shields.io/badge/License-Assignment-green)](LICENSE)

Sendbird UIKit과 Next.js 15를 활용한 현대적인 애니메이션 채널 리스트 구현체입니다. 부드러운 애니메이션, 무한 스크롤, 실시간 업데이트 기능을 제공합니다.

## 📋 프로젝트 개요

이 프로젝트는 점진적으로 향상되는 4단계의 동적 채널 리스트를 구현합니다:

- **Step 1**: 호버 애니메이션이 적용된 기본 리스트 (translate + scale 효과)
- **Step 2**: 순차적 애니메이션을 활용한 아이템 추가
- **Step 3**: 부드러운 전환 효과를 가진 동적 정렬
- **Step 4**: 자동 위치 조정이 가능한 실시간 업데이트

**테스트 주도 개발(TDD)** 방법론과 포괄적인 문서화를 통해 구축되었습니다.

## 🚀 주요 기능

- ✅ **최신 기술 스택**: TypeScript를 활용한 Next.js 15, React 19, Tailwind CSS
- ✅ **부드러운 애니메이션**: GPU 가속 CSS 변환 (60 FPS)
- ✅ **무한 스크롤**: React Query를 활용한 스크롤 시 추가 로딩
- ✅ **실시간 업데이트**: Sendbird SDK 통합을 통한 실시간 채널 업데이트
- ✅ **타입 안정성**: 포괄적인 타입 정의가 적용된 엄격한 TypeScript
- ✅ **테스팅**: 80% 커버리지 목표의 Jest + React Testing Library
- ✅ **코드 품질**: ESLint, Prettier, Husky 프리커밋 훅
- ✅ **접근성**: 키보드 네비게이션을 지원하는 WCAG 2.1 AA 준수
- ✅ **이중 언어 문서**: 영어 및 한국어 문서

## 📊 프로젝트 상태

**현재 단계**: Phase 1 완료 ✅ (5/35 이슈, 14.3%)

| Phase   | 상태              | 이슈       | 진행률   |
| ------- | ----------------- | ---------- | -------- |
| Phase 1 | ✅ 완료           | #1-5 (5)   | 5/5 100% |
| Phase 2 | 🎯 시작 준비 완료 | #6-13 (8)  | 0/8 0%   |
| Phase 3 | ⏳ 대기 중        | #14-19 (6) | 0/6 0%   |
| Phase 4 | ⏳ 대기 중        | #20-25 (6) | 0/6 0%   |
| Phase 5 | ⏳ 대기 중        | #26-29 (4) | 0/4 0%   |
| Phase 6 | ⏳ 대기 중        | #30-35 (6) | 0/6 0%   |

**Phase 1 완료 내역**:

- ✅ TypeScript를 활용한 Next.js 15.5.6 초기화
- ✅ 핵심 의존성 설치 (Sendbird SDK, React Query)
- ✅ 개발 도구 설정 (ESLint, Prettier, Husky)
- ✅ 테스팅 환경 구축 (Jest, React Testing Library)
- ✅ TypeScript 타입 정의 (Channel, Sendbird, Component 타입)

자세한 진행 상황은 [GitHub Issues](https://github.com/bulhwi/dynamic-channel-list-fe/issues)를 참조하세요.

## 🛠️ 기술 스택

### 핵심 기술

- **프레임워크**: Next.js 15.5.6 (App Router)
- **런타임**: React 19.0.0
- **언어**: TypeScript 5.x (Strict Mode)
- **스타일링**: Tailwind CSS 3.4.14

### 상태 관리

- **서버 상태**: TanStack React Query 5.90.10
- **UI 상태**: React Hooks (useState, useReducer)

### 백엔드 통합

- **채팅 SDK**: Sendbird Chat SDK 4.20.2

### 테스팅

- **프레임워크**: Jest 30.2.0
- **테스팅 라이브러리**: React Testing Library 16.3.0
- **커버리지 목표**: 80% (lines, functions, branches, statements)

### 개발 도구

- **린팅**: ESLint 9 + eslint-config-next
- **포맷팅**: Prettier 3.6.2
- **Git 훅**: Husky 9.1.7 + lint-staged

## 📦 설치 방법

### 사전 요구사항

- Node.js >= 18.17.0
- npm 또는 yarn
- Git

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/bulhwi/dynamic-channel-list-fe.git
cd dynamic-channel-list-fe

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 편집하여 Sendbird App ID와 API Token을 추가하세요

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 🔧 사용 가능한 스크립트

```bash
# 개발
npm run dev          # 개발 서버 시작 (http://localhost:3000)

# 프로덕션
npm run build        # 프로덕션 빌드 생성
npm run start        # 프로덕션 서버 시작

# 코드 품질
npm run lint         # ESLint 실행
npm run lint:fix     # ESLint 에러 자동 수정
npm run format       # Prettier로 코드 포맷팅
npm run format:check # 코드 포맷팅 검사

# 테스팅
npm test             # 테스트 실행
npm run test:watch   # 테스트 watch 모드 실행
npm run test:coverage # 커버리지 리포트 생성
```

## 📁 프로젝트 구조

```
dynamic-channel-list-fe/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── _components/          # React 컴포넌트 (private, 라우팅 제외)
│   │   │   ├── ChannelItem/      # 채널 아이템 컴포넌트
│   │   │   ├── ChannelList/      # 채널 리스트 컴포넌트
│   │   │   ├── CreateChannelButton/  # 채널 생성 버튼
│   │   │   ├── ErrorMessage/     # 에러 메시지 컴포넌트
│   │   │   └── LoadingSpinner/   # 로딩 스피너
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 홈 페이지
│   │   ├── providers.tsx         # React Query & MSW 프로바이더
│   │   └── globals.css           # 글로벌 스타일
│   ├── _hooks/                   # 커스텀 React 훅 (private)
│   │   ├── useChannels.ts        # 채널 목록 조회 훅
│   │   └── useCreateChannel.ts   # 채널 생성 훅
│   ├── _lib/                     # 유틸리티 함수 (private)
│   │   └── utils.ts              # 공통 유틸리티
│   ├── _types/                   # TypeScript 타입 정의 (private)
│   │   ├── channel.types.ts      # 채널 도메인 타입
│   │   ├── sendbird.types.ts     # Sendbird 통합 타입
│   │   ├── component.types.ts    # 컴포넌트 props 타입
│   │   └── index.ts              # 타입 내보내기
│   ├── services/                 # 서비스 레이어
│   │   ├── api/                  # API 서비스
│   │   │   └── channels.ts       # 채널 API
│   │   └── sendbird/             # Sendbird 서비스
│   │       ├── client.ts         # Sendbird 클라이언트
│   │       └── channel.service.ts # 채널 서비스
│   ├── mocks/                    # MSW 목업
│   │   ├── browser.ts            # 브라우저용 MSW
│   │   ├── handlers.ts           # API 핸들러
│   │   └── server.ts             # 서버용 MSW
│   ├── contexts/                 # React Context
│   └── __tests__/                # 테스트 파일
│       ├── _components/          # 컴포넌트 테스트
│       ├── _hooks/               # 훅 테스트
│       ├── services/             # 서비스 테스트
│       └── lib/                  # 유틸리티 테스트
├── docs/                         # 문서
│   ├── en/                       # 영어 문서
│   │   ├── PRD_EN.md             # 제품 요구사항 문서
│   │   └── TECH_SPEC.md          # 기술 사양서
│   ├── ko/                       # 한국어 문서
│   │   ├── PRD_KO.md             # 제품 요구사항 문서
│   │   ├── TECH_SPEC.md          # 기술 사양서
│   │   └── REQUIREMENTS.md       # 추가 요구사항
│   └── prompts/                  # AI 세션 문서
│       └── sessions/             # 세션별 로그
├── public/                       # 정적 에셋
├── .husky/                       # Git 훅
├── CLAUDE.md                     # AI 사용 문서
├── jest.config.js                # Jest 설정
├── tailwind.config.ts            # Tailwind 설정
├── tsconfig.json                 # TypeScript 설정
└── package.json                  # 의존성 및 스크립트
```

**참고**: `_`로 시작하는 디렉토리(\_components, \_hooks, \_types, \_lib)는 Next.js 라우팅에서 제외되는 private 폴더입니다.

## 📚 문서

### 개발자용

- **[제품 요구사항 (EN)](docs/en/PRD_EN.md)** - 상세 요구사항 및 사용자 스토리
- **[기술 사양서 (EN)](docs/en/TECH_SPEC.md)** - 아키텍처 및 구현 세부사항
- **[한국어 PRD](docs/ko/PRD_KO.md)** - 제품 요구사항 (한국어)
- **[한국어 기술 사양서](docs/ko/TECH_SPEC.md)** - 기술 사양 (한국어)

### 평가자용

- **[CLAUDE.md](CLAUDE.md)** - 전체 AI 사용 문서 (과제 제출 필수)
- **[세션 로그](docs/prompts/sessions/)** - Claude Code와의 상세 대화 로그
- **[GitHub Issues](https://github.com/bulhwi/dynamic-channel-list-fe/issues)** - 작업 추적 및 진행 상황

### 주요 문서 통계

- **PRD**: 2,000+ 줄 (EN + KO)
- **Tech Spec**: 2,400+ 줄 (EN + KO)
- **세션 로그**: 2,700+ 줄 (4 세션)
- **AI 문서**: 총 8,600+ 줄

## 🧪 테스팅

이 프로젝트는 **테스트 주도 개발(TDD)** 을 따릅니다:

```bash
# 모든 테스트 실행
npm test

# watch 모드로 테스트 실행 (개발 중 권장)
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage
```

**커버리지 요구사항**:

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

현재 상태: Phase 1 완료 - 2/2 테스트 통과 ✅

## 🤖 AI 도구 사용

이 프로젝트는 Anthropic의 **Claude Code** (claude-sonnet-4.5) 지원을 받아 개발되었습니다.

모든 AI 상호작용은 투명하게 문서화되었습니다:

- **[CLAUDE.md](CLAUDE.md)**: 전체 AI 사용 문서
- **[세션 로그](docs/prompts/sessions/)**: 상세 대화 로그

**Claude Code가 수행한 작업**:

- ✅ 문서 생성 (PRD, Tech Spec)
- ✅ 프로젝트 계획 및 작업 분해
- ✅ 아키텍처 설계 및 모범 사례 가이드
- ✅ GitHub Issues 생성 자동화
- ✅ TypeScript 타입 정의

**개발자가 수행한 작업**:

- ✅ 모든 최종 의사결정 및 승인
- ✅ 요구사항 분석 및 명확화
- ✅ 코드 리뷰 및 이해
- ✅ 테스팅 및 검증
- ✅ Git 커밋 및 프로젝트 관리

모든 커밋에는 공동 저자 표시가 포함됩니다:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```

## 🎯 로드맵

### Phase 1: 기반 구축 및 설정 ✅ (100% 완료)

- ✅ Next.js 초기화
- ✅ 의존성 설치
- ✅ 개발 도구 설정
- ✅ 테스팅 환경
- ✅ 타입 정의

### Phase 2: Step 1 - 애니메이션 리스트 (0% 완료)

- ⏳ 유틸리티 함수
- ⏳ Sendbird 서비스 레이어
- ⏳ 애니메이션이 적용된 기본 컴포넌트
- ⏳ 호버 효과 구현

### Phase 3: Step 2 - 아이템 삽입 (대기 중)

- ⏳ 삽입 애니메이션 로직
- ⏳ 순차적 애니메이션
- ⏳ 위치 계산

### Phase 4: Step 3 - 동적 정렬 (대기 중)

- ⏳ 정렬 로직
- ⏳ 전환 애니메이션
- ⏳ 성능 최적화

### Phase 5: Step 4 - 실시간 업데이트 (대기 중)

- ⏳ Sendbird 이벤트 핸들러
- ⏳ 자동 위치 조정 로직
- ⏳ 실시간 동기화

### Phase 6: 마무리 및 배포 (대기 중)

- ⏳ 접근성 개선
- ⏳ 성능 최적화
- ⏳ 프로덕션 빌드
- ⏳ 배포 설정

자세한 로드맵은 [GitHub Projects](https://github.com/bulhwi/dynamic-channel-list-fe/projects)를 참조하세요.

## 📝 환경 변수

`.env.local.example` 파일을 `.env.local`로 복사하여 설정하세요:

```env
# Sendbird 설정
NEXT_PUBLIC_SENDBIRD_APP_ID=your_app_id_here
NEXT_PUBLIC_SENDBIRD_API_TOKEN=your_api_token_here

# 옵션: 사용자 설정
NEXT_PUBLIC_DEFAULT_USER_ID=test_user
```

Sendbird 인증 정보는 [Sendbird Dashboard](https://dashboard.sendbird.com/)에서 발급받을 수 있습니다.

## 🤝 기여

이 프로젝트는 과제 제출용이지만, 피드백과 제안은 환영합니다!

1. 현재 작업은 [GitHub Issues](https://github.com/bulhwi/dynamic-channel-list-fe/issues)에서 확인하세요
2. 아키텍처는 [기술 사양서](docs/en/TECH_SPEC.md)를 검토하세요
3. TDD 방법론을 따라주세요 (테스트를 먼저 작성)
4. 모든 테스트가 통과하고 커버리지가 유지되는지 확인하세요

## 📄 라이선스

이 프로젝트는 코딩 과제 제출의 일부입니다.

## 👤 작성자

**Park Bulhwi** ([@bulhwi](https://github.com/bulhwi))

다음의 지원을 받아 개발되었습니다:

- **Claude Code** (claude-sonnet-4.5) by Anthropic

## 🙏 감사의 말

- **Sendbird** - 채팅 SDK 및 문서
- **Vercel** - Next.js 프레임워크 및 호스팅
- **Anthropic** - Claude Code AI 지원
- **오픈소스 커뮤니티** - 훌륭한 도구와 라이브러리

---

**최종 업데이트**: 2025-11-23
**버전**: 0.1.0
**상태**: Phase 1 완료 ✅

---

자세한 AI 사용 문서는 [CLAUDE.md](CLAUDE.md)를 참조하세요.
세션별 대화 로그는 [docs/prompts/sessions/](docs/prompts/sessions/)를 참조하세요.
