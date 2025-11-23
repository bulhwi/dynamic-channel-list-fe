# Prompt Documentation Index

이 디렉토리는 Claude Code와의 모든 대화를 세션별로 문서화합니다.

---

## 📁 디렉토리 구조

```
prompts/
├── sessions/          # 세션별 대화 문서 (모든 프롬프트와 응답 포함)
│   ├── 00_PROJECT_INITIALIZATION.md
│   ├── 01_GITHUB_ISSUES_SETUP.md
│   ├── 02_PROJECT_SETUP.md
│   ├── 03_STEP1_IMPLEMENTATION.md
│   └── ...
│
├── SESSION_TEMPLATE.md  # 새 세션 작성 시 사용할 템플릿
└── README.md            # 이 파일
```

---

## 📝 문서화 정책

### 세션별 문서화 (Session-Based Documentation)

**중요**: 모든 프롬프트와 응답은 세션별로 문서화됩니다. 자동 로깅은 사용하지 않습니다.

- **목적**: 주제별로 체계적으로 정리된 완전한 대화 기록
- **작성 시점**: 각 개발 세션 진행 중 및 완료 시
- **내용**:
  - 세션의 목표 및 계획
  - 모든 사용자 프롬프트 (원문 그대로)
  - Claude의 주요 응답
  - 기술적 결정사항과 근거
  - 구현된 코드 및 파일
  - 발생한 문제와 해결 방법
  - 배운 점 및 개선사항
  - 다음 단계

- **파일 네이밍**: `NN_TOPIC_NAME.md`
  - 예: `00_PROJECT_INITIALIZATION.md`, `01_GITHUB_ISSUES_SETUP.md`

---

## 📋 세션 목록

### ✅ 완료된 세션

| 번호 | 파일명 | 주제 | 날짜 | 상태 |
|------|--------|------|------|------|
| 00 | `sessions/00_PROJECT_INITIALIZATION.md` | 프로젝트 초기화, PRD/Tech Spec 작성 | 2025-11-23 | ✅ 완료 |
| 01 | `sessions/01_GITHUB_ISSUES_SETUP.md` | GitHub Issues, Milestones, Labels 설정 | 2025-11-23 | ✅ 완료 |

### 🔄 진행 예정

| 번호 | 주제 | 예상 내용 |
|------|------|----------|
| 02 | Project Setup | Next.js 초기화, 의존성 설치, 환경 설정 |
| 03 | Step 1: Dummy Data & Animation | 더미 데이터, 호버 애니메이션 구현 |
| 04 | Step 2: Channel Creation | Sendbird SDK 통합, 채널 생성 |
| 05 | Step 3: Pagination | 무한 스크롤, 실제 데이터 교체 |
| 06 | Step 4: Channel Update | 채널 업데이트, 재정렬 애니메이션 |
| 07 | Testing & Refinement | 통합 테스트, 버그 수정 |
| 08 | Deployment & Documentation | 배포, 최종 문서 정리 |

---

## 🔍 검색 가이드

### 특정 주제 찾기
```bash
# 세션 파일에서 키워드 검색
grep -r "animation" sessions/

# 특정 기술 스택 관련 대화 찾기
grep -r "Sendbird" sessions/

# 특정 컴포넌트 구현 찾기
grep -r "ChannelList" sessions/
```

### 특정 날짜의 세션 찾기
```bash
# 세션 목록 확인
ls -la sessions/

# 특정 세션 읽기
cat sessions/00_PROJECT_INITIALIZATION.md
```

---

## 📊 통계

### 현재 문서 현황
- **완료된 세션**: 2개 (00_PROJECT_INITIALIZATION, 01_GITHUB_ISSUES_SETUP)
- **총 문서 라인**: ~1,200줄
- **작성된 PRD/Tech Spec**: ~5,400줄 (EN + KO)
- **생성된 GitHub Issues**: 35개

### 파일 크기 가이드라인
- **세션 파일**: 400-800줄 권장 (너무 길면 읽기 어려움)
- **총 프로젝트**: ~5,000-8,000줄 예상

### 권장 사항
- 세션 파일이 1,000줄 초과 시 분리 고려
- 복잡한 주제는 여러 세션으로 나누기
- 각 세션은 하나의 명확한 목표에 집중
- 모든 프롬프트를 원문 그대로 기록

---

## 🎯 제출 시

### AI 도구 사용 문서
프로젝트 루트의 `CLAUDE.md` 파일에 모든 AI 사용 내역이 정리되어 있습니다:
- 사용한 도구 정보 (Claude Sonnet 4.5)
- 세션별 작업 요약
- 주요 기술적 결정사항과 근거
- 통계 및 성과

### 제출 패키지
```
docs/
├── CLAUDE.md                  # AI 도구 사용 종합 문서 ⭐
├── prompts/                   # 전체 프롬프트 문서
│   ├── sessions/              # 세션별 상세 문서
│   │   ├── 00_PROJECT_INITIALIZATION.md
│   │   ├── 01_GITHUB_ISSUES_SETUP.md
│   │   └── ...
│   └── README.md              # 프롬프트 문서 인덱스
├── en/                        # 영문 문서
│   ├── PRD_EN.md
│   └── TECH_SPEC.md
└── ko/                        # 한글 문서
    ├── PRD_KO.md
    └── TECH_SPEC.md
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
