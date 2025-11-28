# Session 06: 프로젝트 구조 리팩토링 - Private 폴더

**날짜**: 2025-11-24
**소요 시간**: ~30분
**상태**: ✅ 완료

---

## 🎯 세션 목표

Next.js private 폴더 규칙을 사용하도록 프로젝트 구조 리팩토링:

- [x] `components/`를 `app/_components/`로 이름 변경
- [x] `hooks/`를 `_hooks/`로 이름 변경
- [x] `types/`를 `_types/`로 이름 변경
- [x] `lib/`를 `_lib/`로 이름 변경
- [x] 코드베이스 전체에서 모든 import 경로 업데이트
- [x] 새로운 구조를 반영하도록 문서 업데이트
- [x] 빌드 및 테스트 통과 확인

---

## 📝 세션 개요

이 세션은 Next.js의 private 폴더 규칙을 채택하여 프로젝트 구조를 개선하는 데 초점을 맞췄습니다. `_`로 시작하는 폴더는 라우팅에서 제외되어 코드베이스가 더욱 체계적으로 관리되고 의도하지 않은 라우트 생성을 방지할 수 있습니다.

**주요 초점**:

- 디렉토리 재구조화
- Import 경로 업데이트
- 문서 업데이트
- Next.js 라우팅 모범 사례

---

## 💬 사용자 프롬프트 및 작업

### Prompt #1: components 디렉토리 이름 변경

**사용자**:

```
componets 디렉토리 경로 변경햇어, 확인해보고
components디렉토리의 이름을 _components로 변경해줘
```

**Claude의 작업**:

1. `git mv`를 사용하여 디렉토리 이름 변경:
   - `src/components` → `src/app/_components`
   - `src/__tests__/components` → `src/__tests__/_components`

2. 8개 파일에서 import 경로 업데이트:
   - `src/app/page.tsx`
   - `src/app/_components/ChannelList/ChannelList.tsx`
   - `src/app/_components/CreateChannelButton/CreateChannelButton.tsx`
   - 모든 테스트 파일 (ChannelItem, ChannelList, CreateChannelButton, ErrorMessage, LoadingSpinner)

3. 검증:
   - ✅ 빌드 성공 (1.3초)
   - ✅ 모든 테스트 통과 (105/105)

**결과**: 컴포넌트가 private 폴더 구조로 성공적으로 이동됨

---

### Prompt #2: hooks와 types도 확장

**사용자**:

```
동일하게 hooks와 types도 옮겨보자
```

**Claude의 작업**:

1. 디렉토리 이름 변경:
   - `src/hooks` → `src/_hooks`
   - `src/types` → `src/_types`
   - `src/__tests__/hooks` → `src/__tests__/_hooks`

2. 13개 파일에서 import 경로 업데이트:
   - 컴포넌트 파일 (ChannelList, ChannelItem, page.tsx)
   - 서비스 파일 (channels.ts, channel.service.ts, utils.ts, handlers.ts)
   - 테스트 파일 (모든 컴포넌트 및 훅 테스트)
   - 타입 정의 (\_types/index.ts)

3. import 패턴 변경:
   - `@/hooks/` → `@/_hooks/`
   - `@/types/` → `@/_types/`

4. 검증:
   - ✅ 빌드 성공 (804ms)
   - ✅ 모든 테스트 통과 (105/105)

**결과**: 모든 private 폴더가 성공적으로 이름 변경됨

---

### Prompt #3: lib 디렉토리 포함

**사용자**:

```
lib 도 옮기는게 좋을거 같아
```

**Claude의 작업**:

1. 디렉토리 이름 변경:
   - `src/lib` → `src/_lib`

2. 5개 파일에서 import 경로 업데이트:
   - `src/app/_components/ChannelList/ChannelList.tsx`
   - `src/services/sendbird/channel.service.ts`
   - `src/mocks/handlers.ts`
   - `src/__tests__/lib/utils.test.ts`
   - `src/__tests__/services/sendbird/channel.service.test.ts`

3. import 패턴 변경:
   - `@/lib/` → `@/_lib/`

4. 검증:
   - ✅ 빌드 성공 (874ms)
   - ✅ 모든 테스트 통과 (105/105)

**결과**: 완전한 private 폴더 구조 달성

---

### Prompt #4: 커밋 및 문서 업데이트

**사용자**:

```
좋아 이상태로 푸시하고 프로젝트 구조가 바뀌었으니 문서 업데이트가 필요할거야 확인해서 최신화 해줘
```

**Claude의 작업**:

1. **변경사항 커밋**:

   ```bash
   git commit -m "refactor: rename directories to private folders with underscore prefix"
   ```

   - 30개 파일 변경 (이름 변경 및 import 업데이트)
   - lint-staged 및 prettier 훅을 통해 실행됨
   - Claude와 공동 저작자 추가

2. **원격 저장소로 푸시**:

   ```bash
   git push
   ```

   - main 브랜치로 성공적으로 푸시됨

3. **문서 업데이트**:
   - `README.md`: 상세한 폴더 트리로 프로젝트 구조 섹션 업데이트
   - `docs/en/TECH_SPEC.md`: 모든 경로 참조 업데이트
   - `docs/ko/TECH_SPEC.md`: 모든 경로 참조 업데이트
   - `docs/prompts/sessions/*.md`: 모든 세션 파일의 경로 참조 업데이트

4. **이 세션 문서 생성**: 리팩토링 프로세스 문서화

**결과**: 새로운 구조를 반영하도록 문서가 완전히 업데이트됨

---

## 📊 결과 요약

### 수정된 파일

**총**: 30개 파일 변경, 31줄 추가(+), 31줄 삭제(-)

**디렉토리 이름 변경**:

- ✅ `src/components` → `src/app/_components`
- ✅ `src/hooks` → `src/_hooks`
- ✅ `src/types` → `src/_types`
- ✅ `src/lib` → `src/_lib`
- ✅ `src/__tests__/components` → `src/__tests__/_components`
- ✅ `src/__tests__/hooks` → `src/__tests__/_hooks`

**Import 경로 업데이트**: 18개 파일

**문서 업데이트**:

- README.md (상세한 프로젝트 구조)
- docs/en/TECH_SPEC.md
- docs/ko/TECH_SPEC.md
- 모든 세션 문서

### 최종 프로젝트 구조

```
src/
├── _hooks/          ← private (라우팅에서 제외)
├── _lib/            ← private (라우팅에서 제외)
├── _types/          ← private (라우팅에서 제외)
├── app/
│   └── _components/ ← private (라우팅에서 제외)
├── __tests__/
│   ├── _components/
│   └── _hooks/
├── contexts/
├── mocks/
└── services/
```

### 검증

- ✅ 빌드: 성공 (874ms)
- ✅ 테스트: 105/105 통과
- ✅ Lint: 통과
- ✅ 포맷: lint-staged를 통해 적용됨
- ✅ Git: 커밋 및 푸시 완료
- ✅ 문서: 업데이트 완료

---

## 🎓 주요 학습 내용

### Next.js Private 폴더 규칙

1. **언더스코어 접두사**:
   - `_`로 시작하는 폴더는 Next.js 라우팅에서 제외됨
   - 의도하지 않은 라우트 생성을 방지
   - 내부/private 코드임을 명확히 표시

2. **장점**:
   - 더 나은 구성
   - 라우팅 가능한 코드와 그렇지 않은 코드의 명확한 분리
   - Next.js 프로젝트의 업계 모범 사례

3. **사용 시기**:
   - 페이지가 아닌 컴포넌트
   - 유틸리티 함수 및 헬퍼
   - 타입 정의
   - 커스텀 훅
   - URL을 통해 접근할 수 없어야 하는 모든 내부 코드

### Import 경로 패턴

**변경 전**:

```typescript
import { useChannels } from '@/hooks/useChannels'
import type { Channel } from '@/types/channel.types'
import { sortChannels } from '@/lib/utils'
import ChannelItem from '@/app/components/ChannelItem/ChannelItem'
```

**변경 후**:

```typescript
import { useChannels } from '@/_hooks/useChannels'
import type { Channel } from '@/_types/channel.types'
import { sortChannels } from '@/_lib/utils'
import ChannelItem from '@/app/_components/ChannelItem/ChannelItem'
```

### Git 모범 사례

1. **`git mv` 사용**:
   - 파일 히스토리 보존
   - Git이 이름 변경을 올바르게 추적
   - 삭제 + 추가보다 나음

2. **원자적 커밋**:
   - 전체 리팩토링을 위한 단일 커밋
   - 모든 관련 변경사항을 함께
   - 명확한 커밋 메시지

3. **커밋 전 검증**:
   - 빌드 실행
   - 테스트 실행
   - import 경로 확인
   - 끊어진 참조가 없는지 확인

---

## 📋 관련 이슈

- N/A (프로젝트 유지보수 작업)

---

## ⏭️ 다음 단계

1. Phase 2 구현 계속하기
2. import 경로 문제 모니터링
3. 외부 문서 참조 업데이트
4. 필요시 경로 별칭 추가 고려

---

## 🔗 관련 문서

- [README.md](../../README.md) - 업데이트된 프로젝트 구조
- [TECH_SPEC.md (EN)](../en/TECH_SPEC.md) - 업데이트된 경로 참조
- [TECH_SPEC.md (KO)](../ko/TECH_SPEC.md) - 업데이트된 경로 참조

---

**세션 성공적으로 완료** ✅

모든 디렉토리가 Next.js private 폴더 규칙을 사용하도록 재구조화되고, import가 업데이트되었으며, 문서가 동기화되었습니다.
