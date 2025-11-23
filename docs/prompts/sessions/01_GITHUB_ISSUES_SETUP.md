# Session 01: GitHub Issues & Project Management Setup

**Date**: 2025-11-23
**Duration**: ~1 hour
**Status**: ✅ Completed

---

## 📋 Session Overview

**Goal**: Set up comprehensive project management structure using GitHub Issues, Milestones, and Labels for tracking all development tasks.

**Scope**:

- Create detailed task breakdown for all 6 development phases
- Generate GitHub Issues with proper categorization
- Setup Milestones with due dates
- Configure Labels for task categorization
- Automate issue creation with shell script

---

## ✅ Objectives

- [x] Analyze PRD and create comprehensive task list (35 tasks)
- [x] Create GitHub Issues creation script
- [x] Generate 6 Milestones for development phases
- [x] Create 11 Labels for task categorization
- [x] Generate 35 detailed GitHub Issues
- [x] Link Issues to Milestones and Labels
- [x] Commit and push to repository

---

## 💬 Conversation Summary

### Initial Request

**User**:

```
실제 구현 작업을 진행하기 이전에 작업을 진행할 플랜별로 태스크를 구성하고, 태스크로 github 이슈로 등록하여 관리하자!
todo리스트 한번 뽑아보고 이슈등록해줘
```

**Translation**: "Before starting actual implementation, let's organize tasks by plan and register them as GitHub issues for management. Create a todo list and register issues."

**Claude's Understanding**:

- Need to break down PRD's 6 phases into actionable tasks
- Create GitHub Issues for project management
- Use Milestones to track phases
- Use Labels to categorize tasks

---

### Task Breakdown Process

**Step 1: Todo List Creation**

Created 35 tasks using TodoWrite tool, organized by 6 phases:

```
Phase 1: Foundation & Setup (8 tasks)
├── Initialize Next.js 15 with TypeScript
├── Install core dependencies (Sendbird, React Query)
├── Configure ESLint, Prettier, Husky
├── Setup Jest and React Testing Library
├── Define TypeScript types and interfaces
├── Implement generateRandomName() utility (TDD)
├── Implement sortChannels() utility (TDD)
└── Create Sendbird client service

Phase 2: Step 1 - Animated List (5 tasks)
├── Create ChannelItem component with hover animation
├── Create ChannelList component with dummy data
├── Implement CSS animations (40px/20px translateX)
├── Create useHoverAnimation hook
└── Write component tests for animations

Phase 3: Step 2 - Channel Creation (6 tasks)
├── Create CreateChannelButton component
├── Integrate Sendbird channel creation API
├── Setup React Query mutation for creation
├── Implement dynamic list insertion with sorting
├── Add loading and error states
└── Write integration tests for creation flow

Phase 4: Step 3 - Pagination (6 tasks)
├── Replace dummy data with Sendbird SDK data
├── Implement useInfiniteScroll hook
├── Setup React Query infinite query
├── Implement container height limitation (10 items)
├── Add pagination loading indicator
└── Write integration tests for infinite scroll

Phase 5: Step 4 - Channel Update (4 tasks)
├── Add click event handlers to channel items
├── Implement channel update mutation
├── Add re-positioning animation
└── Write integration tests for update flow

Phase 6: Polish & Deployment (6 tasks)
├── Code refactoring and optimization
├── Performance testing with Lighthouse
├── Accessibility improvements (ARIA, keyboard nav)
├── Write comprehensive README.md (EN + KO)
├── Create deployment configuration (Vercel)
└── Final testing and bug fixes
```

**Total**: 35 tasks across 6 phases

---

**Step 2: GitHub Issues Script Creation**

Created comprehensive bash script: `scripts/create-github-issues.sh`

**Script Features**:

1. Creates 11 Labels with colors and descriptions
2. Creates 6 Milestones with due dates
3. Generates 35 detailed Issues with:
   - Title
   - Description (Objective, Tasks, Acceptance Criteria)
   - Milestone assignment
   - Label assignment
   - Reference to PRD/Tech Spec sections

**Script Size**: 1,130 lines

---

**Step 3: Execution**

Executed script using GitHub CLI (`gh`):

```bash
./scripts/create-github-issues.sh
```

**Results**:

- ✅ 11 Labels created
- ✅ 6 Milestones created
- ✅ 35 Issues created (#1-#35)

**Minor Issue**:

- Initial run failed on last issue due to missing 'a11y' label
- Fixed by creating 'a11y' label manually
- Completed remaining 4 issues manually

---

## 🔧 Technical Decisions

### Decision 1: Task Granularity

**Context**: Need to decide how detailed each task should be.

**Options Considered**:

1. **High-level tasks** (e.g., "Implement Step 1")
   - Pros: Fewer issues to manage
   - Cons: Difficult to track progress, unclear scope

2. **Medium granularity** (e.g., "Create ChannelItem component")
   - Pros: Clear scope, trackable, not overwhelming
   - Cons: Still some ambiguity

3. **Very detailed tasks** (e.g., "Add hover state to ChannelItem")
   - Pros: Crystal clear, easy to check off
   - Cons: Too many issues, management overhead

**Chosen**: Option 2 - Medium granularity

**Rationale**:

- Each task is a clear deliverable
- Can be completed in 2-4 hours
- Easy to track without overwhelming number of issues
- Detailed enough for acceptance criteria

---

### Decision 2: Milestone Structure

**Context**: How to organize tasks into milestones.

**Options Considered**:

1. **By feature** (e.g., "Animation", "API Integration")
2. **By time** (e.g., "Week 1", "Week 2")
3. **By assignment steps** (e.g., "Step 1", "Step 2")

**Chosen**: Option 3 - By assignment steps (6 phases)

**Rationale**:

- Aligns with PRD structure
- Matches assignment requirements (Step 1-4)
- Clear progression: Setup → Step 1 → Step 2 → Step 3 → Step 4 → Polish
- Evaluators can easily track progress

---

### Decision 3: Label System

**Context**: What labels to use for categorization.

**Labels Created**:

| Label         | Purpose                    | Color      | Usage         |
| ------------- | -------------------------- | ---------- | ------------- |
| `setup`       | Project setup tasks        | Green      | Phase 1       |
| `feature`     | New feature implementation | Blue       | All phases    |
| `test`        | Testing related tasks      | Yellow     | All phases    |
| `docs`        | Documentation              | Light Blue | Phase 6       |
| `enhancement` | Enhancement to existing    | Cyan       | Improvements  |
| `step-1`      | Step 1 specific            | Red        | Phase 2       |
| `step-2`      | Step 2 specific            | Red        | Phase 3       |
| `step-3`      | Step 3 specific            | Red        | Phase 4       |
| `step-4`      | Step 4 specific            | Red        | Phase 5       |
| `tdd`         | TDD approach               | Purple     | TDD tasks     |
| `a11y`        | Accessibility              | Purple     | Accessibility |

**Rationale**:

- Clear categorization by type and step
- Easy filtering in GitHub UI
- Color-coded for visual scanning
- Supports both functional and technical categorization

---

### Decision 4: Issue Detail Level

**Context**: How much detail to include in each issue.

**Chosen Structure**:

```markdown
## Objective

[Clear, concise goal statement]

## Tasks

- [ ] Specific task 1
- [ ] Specific task 2
- [ ] Specific task 3

## Acceptance Criteria

- [x] Criterion 1
- [x] Criterion 2

## Reference

- PRD: Section X
- Tech Spec: Section Y
```

**Rationale**:

- **Objective**: Provides context and motivation
- **Tasks**: Actionable checklist for implementation
- **Acceptance Criteria**: Clear definition of "done"
- **Reference**: Links to detailed documentation

---

## 💻 Implementation Details

### Files Created

```
scripts/
└── create-github-issues.sh (1,130 lines)
    ├── Label creation (11 labels)
    ├── Milestone creation (6 milestones)
    └── Issue creation (35 issues)
```

### GitHub Resources Created

**Milestones (6)**:

| #   | Title                              | Issues | Due Date   |
| --- | ---------------------------------- | ------ | ---------- |
| 1   | Phase 1: Foundation & Setup        | 8      | 2025-12-01 |
| 2   | Phase 2: Step 1 - Animated List    | 5      | 2025-12-05 |
| 3   | Phase 3: Step 2 - Channel Creation | 6      | 2025-12-10 |
| 4   | Phase 4: Step 3 - Pagination       | 6      | 2025-12-15 |
| 5   | Phase 5: Step 4 - Channel Update   | 4      | 2025-12-20 |
| 6   | Phase 6: Polish & Deployment       | 6      | 2025-12-25 |

**Issues (35)**:

All issues created with:

- Clear titles
- Detailed descriptions
- Task checklists
- Acceptance criteria
- Milestone assignments
- Label assignments
- PRD/Tech Spec references

**GitHub URLs**:

- Issues: https://github.com/bulhwi/dynamic-channel-list-fe/issues
- Milestones: https://github.com/bulhwi/dynamic-channel-list-fe/milestones

---

### Code Snippet: Issue Creation Example

**Issue #6**: Implement generateRandomName() utility (TDD)

```bash
gh issue create --title "Implement generateRandomName() utility (TDD)" \
  --milestone "Phase 1: Foundation & Setup" \
  --label "feature,tdd,test" \
  --body "## Objective
Implement utility function to generate random 8-letter lowercase English strings using TDD approach.

## Tasks
- [ ] Write test: returns 8-letter string
- [ ] Write test: only lowercase letters
- [ ] Write test: generates different names
- [ ] Implement function to pass tests
- [ ] Add JSDoc documentation

## Test Cases
\`\`\`typescript
describe('generateRandomName', () => {
  it('should return string of length 8', () => {
    expect(generateRandomName()).toHaveLength(8);
  });

  it('should contain only lowercase letters', () => {
    expect(generateRandomName()).toMatch(/^[a-z]{8}$/);
  });

  it('should generate different names', () => {
    const name1 = generateRandomName();
    const name2 = generateRandomName();
    expect(name1).not.toBe(name2);
  });
});
\`\`\`

## Acceptance Criteria
- [x] All tests pass
- [x] 100% code coverage
- [x] Function follows TDD process

## Reference
- PRD: FR-005 (Random Name Generation)
- Tech Spec: Section 14.1"
```

---

## 📊 Results

### Deliverables

1. ✅ **Script**: `scripts/create-github-issues.sh` (1,130 lines)
2. ✅ **Labels**: 11 labels created
3. ✅ **Milestones**: 6 milestones created
4. ✅ **Issues**: 35 issues created (#1-#35)
5. ✅ **Git Commit**: Script committed and pushed

### Metrics

| Metric                   | Value    |
| ------------------------ | -------- |
| Total Tasks              | 35       |
| Milestones               | 6        |
| Labels                   | 11       |
| Script Lines             | 1,130    |
| Average Tasks per Phase  | 5.8      |
| Estimated Total Duration | ~3 weeks |

### GitHub Activity

```bash
# Commits
git log --oneline -2
9af7145 chore: add GitHub issues creation script
b483fe6 docs: initial project documentation and setup

# Issues Summary
- Phase 1: 8 issues
- Phase 2: 5 issues
- Phase 3: 6 issues
- Phase 4: 6 issues
- Phase 5: 4 issues
- Phase 6: 6 issues
```

---

## 🐛 Issues Encountered

### Issue 1: Missing 'a11y' Label

**Problem**: Initial script execution failed on issue #32 due to missing 'a11y' label.

**Error Message**:

```
could not add label: 'a11y' not found
```

**Root Cause**: Forgot to create 'a11y' label in the label creation section of the script.

**Solution**:

1. Manually created 'a11y' label using `gh label create`
2. Manually created remaining 4 issues (#32-#35)
3. All issues created successfully

**Lesson Learned**: Test script with dry-run or validate all labels exist before issue creation.

---

### Issue 2: Hook Not Working

**Problem**: Claude Code hooks (`user-prompt-submit`) not executing as expected for automatic prompt logging.

**Investigation**:

- Created `.claude/hooks/user-prompt-submit` script
- Added debug logging
- Hook never executed (no debug log file created)

**Root Cause**: Hooks may not be supported in current Claude Code version, or require different configuration.

**Solution**:

- Decided to use **manual session documentation** instead
- Create session files after each major phase
- More reliable and produces higher quality documentation

**Lesson Learned**: Manual documentation is more reliable and produces better results than automated logging for this use case.

---

## 💡 Lessons Learned

### 1. Task Breakdown is Critical

Breaking down PRD into 35 actionable tasks provided:

- Clear roadmap for implementation
- Easy progress tracking
- Realistic time estimation
- Reduced cognitive load

**Application**: Always break large projects into small, manageable tasks (2-4 hours each).

---

### 2. GitHub Issues as Single Source of Truth

Using GitHub Issues provides:

- Central location for all task information
- Built-in tracking and assignment
- Discussion threads for each task
- Integration with commits and PRs
- Visibility for stakeholders

**Application**: Use GitHub Issues from project start, not as afterthought.

---

### 3. Automation Saves Time

1,130-line script created 35 detailed issues in ~2 minutes.

**Manual alternative**: Would take 2-3 hours to create each issue individually.

**Time saved**: ~2.5 hours

**Application**: Invest time in automation scripts for repetitive tasks.

---

### 4. Detailed Acceptance Criteria Prevents Ambiguity

Each issue includes:

- Objective (why)
- Tasks (what)
- Acceptance criteria (definition of done)
- References (where to find details)

**Benefit**: No ambiguity about when task is complete.

**Application**: Always define clear acceptance criteria before starting work.

---

### 5. Manual Documentation > Automatic Logging

Attempted automatic prompt logging via hooks failed.

**Discovery**: Manual session documentation:

- Higher quality (curated, structured)
- More useful for submission
- Better for learning/review
- Less noise

**Application**: Focus on quality documentation over quantity of logs.

---

## 🔗 References

### Internal Documents

- [PRD (EN)](../en/PRD.md)
- [PRD (KO)](../ko/PRD.md)
- [Tech Spec (EN)](../en/TECH_SPEC.md)
- [Tech Spec (KO)](../ko/TECH_SPEC.md)
- [Previous Session](./00_PROJECT_INITIALIZATION.md)

### External Resources

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub Issues Guide](https://docs.github.com/en/issues)
- [GitHub Milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones)

### Code References

- `scripts/create-github-issues.sh` - Issue creation automation

---

## ➡️ Next Steps

### Immediate (Next Session)

1. **Start Phase 1 Implementation**
   - Begin with Issue #1: Initialize Next.js 15 project
   - Follow TDD approach from the start
   - Create session document for Phase 1

2. **Project Initialization**

   ```bash
   npx create-next-app@latest . --typescript --app
   npm install @sendbird/chat @tanstack/react-query
   npm install -D jest @testing-library/react eslint prettier husky
   ```

3. **Environment Setup**
   - Create `.env.local` with Sendbird App ID
   - Configure ESLint and Prettier
   - Setup Jest configuration

---

### Future Sessions

- **Session 02**: Phase 1 - Foundation & Setup (Issues #1-#8)
- **Session 03**: Phase 2 - Step 1 Implementation (Issues #9-#13)
- **Session 04**: Phase 3 - Step 2 Implementation (Issues #14-#19)
- **Session 05**: Phase 4 - Step 3 Implementation (Issues #20-#25)
- **Session 06**: Phase 5 - Step 4 Implementation (Issues #26-#29)
- **Session 07**: Phase 6 - Polish & Deployment (Issues #30-#35)

---

## 📎 Appendices

### Appendix A: Full Issue List

**Phase 1: Foundation & Setup**

1. #1 - Initialize Next.js 15 project with TypeScript
2. #2 - Install and configure core dependencies
3. #3 - Configure ESLint, Prettier, and Husky
4. #4 - Setup Jest and React Testing Library
5. #5 - Define TypeScript types and interfaces
6. #6 - Implement generateRandomName() utility (TDD)
7. #7 - Implement sortChannels() utility (TDD)
8. #8 - Create Sendbird client service

**Phase 2: Step 1 - Animated List** 9. #9 - [Step 1] Create ChannelItem component with hover animation 10. #10 - [Step 1] Create ChannelList component with dummy data 11. #11 - [Step 1] Implement CSS animations for hover effects 12. #12 - [Step 1] Create useHoverAnimation hook 13. #13 - [Step 1] Write comprehensive component tests

**Phase 3: Step 2 - Channel Creation** 14. #14 - [Step 2] Create CreateChannelButton component 15. #15 - [Step 2] Integrate Sendbird channel creation API 16. #16 - [Step 2] Setup React Query mutation for channel creation 17. #17 - [Step 2] Implement dynamic list insertion with sorting 18. #18 - [Step 2] Add loading and error states 19. #19 - [Step 2] Write integration tests for creation flow

**Phase 4: Step 3 - Pagination** 20. #20 - [Step 3] Replace dummy data with Sendbird SDK data 21. #21 - [Step 3] Implement useInfiniteScroll hook 22. #22 - [Step 3] Setup React Query infinite query 23. #23 - [Step 3] Implement container height limitation (10 items) 24. #24 - [Step 3] Add pagination loading indicator 25. #25 - [Step 3] Write integration tests for infinite scroll

**Phase 5: Step 4 - Channel Update** 26. #26 - [Step 4] Add click event handlers to channel items 27. #27 - [Step 4] Implement channel update mutation 28. #28 - [Step 4] Add re-positioning animation 29. #29 - [Step 4] Write integration tests for update flow

**Phase 6: Polish & Deployment** 30. #30 - Code refactoring and optimization 31. #31 - Performance testing with Lighthouse 32. #32 - Accessibility improvements (ARIA, keyboard nav) 33. #33 - Write comprehensive README.md (EN + KO) 34. #34 - Create deployment configuration (Vercel) 35. #35 - Final testing and bug fixes

---

### Appendix B: Milestone Timeline

```
2025-11-23  ●──────────────────────────────────────────────> 2025-12-25
            │                                                  │
            ▼                                                  ▼
         Today                                            Deadline
            │
            ├─ 2025-12-01: Phase 1 Complete (8 issues)
            │
            ├─ 2025-12-05: Phase 2 Complete (5 issues)
            │
            ├─ 2025-12-10: Phase 3 Complete (6 issues)
            │
            ├─ 2025-12-15: Phase 4 Complete (6 issues)
            │
            ├─ 2025-12-20: Phase 5 Complete (4 issues)
            │
            └─ 2025-12-25: Phase 6 Complete (6 issues) ✅
```

**Total Duration**: ~1 month (32 days)

---

## 📝 Session Metadata

| Field                    | Value                                     |
| ------------------------ | ----------------------------------------- |
| **Session Number**       | 01                                        |
| **Date Started**         | 2025-11-23 15:00                          |
| **Date Completed**       | 2025-11-23 16:00                          |
| **Total Duration**       | ~1 hour                                   |
| **Files Created**        | 1 (script)                                |
| **Lines Added**          | +1,130                                    |
| **GitHub Items Created** | 52 (6 milestones + 11 labels + 35 issues) |
| **Commits**              | 1                                         |

---

**Session Status**: ✅ COMPLETED

**Next Session**: 02_PROJECT_SETUP.md (Phase 1 Implementation)

---

_Session documented on 2025-11-23_
