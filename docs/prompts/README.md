# Prompt Documentation Index

이 디렉토리는 Claude Code와의 모든 대화를 문서화합니다.

---

## 📁 디렉토리 구조

```
prompts/
├── sessions/          # 주제별 세션 정리 (수동 작성)
│   ├── 00_PROJECT_INITIALIZATION.md
│   ├── 01_PROJECT_SETUP.md
│   ├── 02_STEP1_IMPLEMENTATION.md
│   └── ...
│
├── daily/            # 날짜별 자동 로그 (.claude hooks)
│   ├── 2025-11-23.md
│   ├── 2025-11-24.md
│   └── ...
│
└── README.md         # 이 파일
```

---

## 📝 문서화 정책

### 1. 세션별 문서 (sessions/)
- **목적**: 주제별로 깔끔하게 정리된 대화 기록
- **작성 시점**: 각 개발 단계(Step) 시작/완료 시
- **내용**:
  - 목표 및 계획
  - 주요 대화 내용
  - 기술적 결정사항
  - 구현 결과
  - 배운 점

- **파일 네이밍**: `NN_TOPIC_NAME.md`
  - 예: `01_PROJECT_SETUP.md`, `02_STEP1_IMPLEMENTATION.md`

### 2. 날짜별 로그 (daily/)
- **목적**: 모든 프롬프트의 완전한 원본 기록
- **작성 시점**: 자동 (.claude hooks)
- **내용**: 타임스탬프 + 원본 프롬프트
- **파일 네이밍**: `YYYY-MM-DD.md`

---

## 📋 세션 목록

### ✅ 완료된 세션

| 번호 | 파일명 | 주제 | 날짜 | 상태 |
|------|--------|------|------|------|
| 00 | `sessions/00_PROJECT_INITIALIZATION.md` | 프로젝트 초기화, PRD/Tech Spec 작성 | 2025-11-23 | ✅ 완료 |

### 🔄 진행 예정

| 번호 | 주제 | 예상 내용 |
|------|------|----------|
| 01 | Project Setup | Next.js 초기화, 의존성 설치, 환경 설정 |
| 02 | Step 1: Dummy Data & Animation | 더미 데이터, 호버 애니메이션 구현 |
| 03 | Step 2: Channel Creation | Sendbird SDK 통합, 채널 생성 |
| 04 | Step 3: Pagination | 무한 스크롤, 실제 데이터 교체 |
| 05 | Step 4: Channel Update | 채널 업데이트, 재정렬 애니메이션 |
| 06 | Testing & Refinement | 통합 테스트, 버그 수정 |
| 07 | Deployment & Documentation | 배포, 최종 문서 정리 |

---

## 🔍 검색 가이드

### 특정 주제 찾기
```bash
# 세션 파일에서 검색
grep -r "animation" sessions/

# 날짜별 로그에서 검색
grep -r "createChannel" daily/
```

### 특정 날짜의 대화 찾기
```bash
# 2025-11-23의 모든 대화
cat daily/2025-11-23.md

# 특정 시간대
grep "14:30" daily/2025-11-23.md
```

---

## 📊 통계

### 파일 크기 가이드라인
- **세션 파일**: 500-1,500줄 권장
- **일일 로그**: 제한 없음 (자동 생성)
- **총 프로젝트**: ~10,000-15,000줄 예상

### 권장 사항
- 세션 파일이 2,000줄 초과 시 분리 고려
- 복잡한 주제는 여러 세션으로 나누기
- 각 세션은 하나의 명확한 목표에 집중

---

## 🎯 제출 시

### 통합 문서 생성
```bash
# 모든 세션을 하나의 파일로 병합
cat sessions/*.md > ../CLAUDE_SESSIONS.md

# 모든 원본 로그도 별도로 제공
cat daily/*.md > ../CLAUDE_DAILY_LOGS.md
```

### 제출 패키지
```
docs/
├── CLAUDE_SESSIONS.md        # 세션 정리본 (읽기 쉬움)
├── CLAUDE_DAILY_LOGS.md      # 원본 로그 (완전한 기록)
└── prompts/                   # 전체 디렉토리
    ├── sessions/
    ├── daily/
    └── README.md
```

---

## 🔧 유지보수

### 새 세션 시작 시
1. `sessions/` 디렉토리에 새 파일 생성
2. 템플릿 사용 (아래 참조)
3. 대화 진행하며 내용 채우기
4. 완료 후 이 README의 테이블 업데이트

### 세션 템플릿
```markdown
# Session NN: [TOPIC_NAME]

**Date**: YYYY-MM-DD
**Duration**: ~X hours
**Status**: [진행중 / 완료]

---

## 목표

- [ ] 목표 1
- [ ] 목표 2

---

## 대화 요약

### User Request
...

### Claude Response
...

---

## 기술적 결정사항

1. ...

---

## 구현 결과

- ✅ 파일 1
- ✅ 파일 2

---

## 배운 점

...

---

## 다음 단계

...
```

---

## 📚 참고 자료

- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Project README](../../README.md)
- [PRD](../en/PRD.md) | [PRD 한글](../ko/PRD.md)
- [Tech Spec](../en/TECH_SPEC.md) | [Tech Spec 한글](../ko/TECH_SPEC.md)

---

**Last Updated**: 2025-11-23
