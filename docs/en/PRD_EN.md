# Product Requirements Document (PRD)

## Dynamic Channel List with Animation

---

## 1. Document Information

| Item             | Details                    |
| ---------------- | -------------------------- |
| **Project Name** | Dynamic Channel List       |
| **Version**      | 1.0.0                      |
| **Last Updated** | 2025-11-23                 |
| **Status**       | Draft                      |
| **Author**       | Development Team           |
| **Stakeholders** | Sendbird, Development Team |

---

## 2. Executive Summary

### 2.1 Overview

Implement an interactive channel list view with smooth animations that dynamically responds to user interactions. The application will integrate with Sendbird Chat SDK to manage real-time channel data while providing an engaging user experience through animated transitions and hover effects.

### 2.2 Problem Statement

Traditional channel lists in messaging applications lack visual feedback and smooth transitions, resulting in a static and less engaging user experience. Users need a more interactive and visually appealing way to browse and manage their channels.

### 2.3 Solution

Build a React-based channel list component that:

- Provides immediate visual feedback through hover animations
- Automatically maintains alphabetical order
- Supports infinite scrolling for large channel lists
- Enables seamless channel creation and updates
- Integrates with Sendbird Chat SDK for real-time data synchronization

---

## 3. Goals & Objectives

### 3.1 Primary Goals

1. **User Experience**: Create an intuitive and visually engaging channel list interface
2. **Performance**: Ensure smooth animations and optimal rendering performance
3. **Reliability**: Maintain data consistency with Sendbird backend
4. **Code Quality**: Implement with TDD approach and maintain high test coverage (80%+)

### 3.2 Success Metrics

| Metric                 | Target          | Measurement Method     |
| ---------------------- | --------------- | ---------------------- |
| Animation Smoothness   | 60 FPS          | Performance monitoring |
| Test Coverage          | ≥ 80%           | Jest coverage report   |
| Load Time (Initial)    | < 2 seconds     | Lighthouse             |
| Load Time (Pagination) | < 500ms         | Network timing         |
| Code Quality           | 0 ESLint errors | CI/CD pipeline         |
| TypeScript Compliance  | 100% (no `any`) | TypeScript compiler    |

### 3.3 Non-Goals

- Multi-language support (English only for MVP)
- Mobile responsiveness (Desktop Chrome only)
- Real-time message handling
- User authentication/authorization
- Channel search functionality

---

## 4. User Stories

### 4.1 Core User Stories

**US-001: View Channel List**

```
As a user
I want to see a list of my channels sorted alphabetically
So that I can easily find and navigate to specific channels
```

**Acceptance Criteria:**

- Channels are displayed in alphabetical order (A-Z)
- List shows channel names clearly
- Initial load shows up to 10 channels
- Empty state is shown when no channels exist

---

**US-002: Hover Animation**

```
As a user
I want to see visual feedback when I hover over a channel
So that I know which channel I'm about to interact with
```

**Acceptance Criteria:**

- Hovered item moves 40px to the right
- Adjacent items (above and below) move 20px to the right
- Items return to original position when mouse leaves
- Animation is smooth (CSS transition)

---

**US-003: Create Channel**

```
As a user
I want to create a new channel with a random name
So that I can organize conversations
```

**Acceptance Criteria:**

- "Create new channel" button is visible at the top
- Clicking button creates a channel with random 8-letter name
- New channel appears in correct alphabetical position
- Creation happens with smooth animation
- Loading state is shown during creation

---

**US-004: Infinite Scroll**

```
As a user
I want to automatically load more channels when scrolling
So that I can browse all available channels without manual pagination
```

**Acceptance Criteria:**

- List container height is limited to 10 items
- Scrollbar appears when more than 10 channels exist
- Scrolling to bottom triggers next page load (10 channels)
- Loading indicator appears during fetch
- No duplicate channels are loaded

---

**US-005: Update Channel**

```
As a user
I want to update a channel's name by clicking on it
So that I can reorganize my channel list
```

**Acceptance Criteria:**

- Clicking a channel updates its name to a new random 8-letter string
- Updated channel moves to correct alphabetical position
- Movement happens with smooth animation
- Loading state is shown during update
- Other channels remain in correct order

---

## 5. Functional Requirements

### 5.1 Step 1: Animated List with Dummy Data

**FR-001: Dummy Data Generation**

- System shall generate an array of random 8-letter English strings
- Minimum 5 dummy items for testing
- All letters must be lowercase

**FR-002: Alphabetical Sorting**

- System shall display items sorted in alphabetical order (A-Z)
- Sorting shall be case-insensitive
- Sorting shall happen automatically on data change

**FR-003: Hover Animation**

- Hovered item shall translate 40px to the right (translateX)
- Adjacent items (±1 index) shall translate 20px to the right
- Animation duration shall be 200-300ms
- Easing function shall be ease-in-out
- Items shall return to original position on mouse leave

---

### 5.2 Step 2: Channel Creation

**FR-004: Create Channel Button**

- Button labeled "Create new channel" shall be positioned at the top
- Button shall be clearly visible and styled
- Button shall show disabled state during creation

**FR-005: Random Name Generation**

- System shall generate random 8-letter English strings (lowercase)
- Each character shall be randomly selected from a-z
- Generated names shall be unique (collision handling not required)

**FR-006: Channel Creation via SDK**

- System shall call `sendbirdChat.groupChannel.createChannel()`
- Channel name parameter shall use generated random string
- Creation shall handle success and error states
- Loading indicator shall appear during API call

**FR-007: Dynamic List Insertion**

- Created channel shall be inserted at correct alphabetical position
- Insertion shall trigger smooth transition animation
- List shall re-sort automatically
- No full list re-render (optimize with React.memo/keys)

---

### 5.3 Step 3: Pagination & Real Data

**FR-008: Container Height Limit**

- List container height shall be limited to 10 items
- Container shall show scrollbar when >10 items exist
- Each item height shall be consistent

**FR-009: Initial Data Fetch**

- System shall fetch channels via `createMyGroupChannelListQuery()`
- Query parameters:
  - `includeEmpty: true`
  - `limit: 10`
  - `order: GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL`
- Dummy data shall be replaced with fetched channels
- Loading state shall be shown during initial fetch

**FR-010: Infinite Scroll**

- System shall detect when scroll reaches bottom (threshold: 100px)
- Next page (10 channels) shall be loaded automatically
- Implementation options:
  - Scroll event listener + throttle
  - Intersection Observer API (preferred)
- Loading indicator shall appear at list bottom
- No more data state shall be handled gracefully

**FR-011: Error Handling**

- Network errors shall show user-friendly error message
- Retry mechanism shall be available
- Failed requests shall not break existing list

---

### 5.4 Step 4: Channel Update

**FR-012: Click Event Handler**

- Each list item shall be clickable
- Cursor shall change to pointer on hover
- Click shall be prevented during loading state

**FR-013: Channel Name Update**

- System shall generate new random 8-letter string
- System shall call `channel.updateChannel()` with new name
- Update shall handle success and error states
- Optimistic update shall be considered for UX

**FR-014: List Re-positioning**

- Updated channel shall move to new alphabetical position
- Movement shall use smooth transition animation
- Other channels shall maintain their positions
- Animation shall not cause layout shift

---

## 6. Technical Requirements

### 6.1 Technology Stack

**Frontend Framework:**

- React 18+ (latest stable version)
- Next.js 15 with App Router
- TypeScript (strict mode)

**State Management:**

- React Query (TanStack Query v5) for server state
- React hooks for local state

**Styling:**

- CSS Modules (primary)
- Framer Motion (optional, for complex animations)
- Pure CSS Transitions (preferred for performance)

**Testing:**

- Jest (unit testing)
- React Testing Library (component testing)
- Testing coverage target: ≥80%

**Code Quality:**

- ESLint (Airbnb config)
- Prettier (code formatting)
- Husky + lint-staged (pre-commit hooks)

**Build & Development:**

- Node.js 20+
- npm or pnpm
- Next.js dev server

---

### 6.2 Sendbird SDK Integration

**SDK Version:**

- @sendbird/chat (latest v4.x)

**Initialization Requirements:**

```typescript
SendbirdChat.init({
  appId: process.env.NEXT_PUBLIC_SENDBIRD_APP_ID,
  localCacheEnabled: false, // REQUIRED
  modules: [new GroupChannelModule()],
})
```

**Allowed SDK Functions (RESTRICTED):**

1. `SendbirdChat.init(options)`
2. `sendbirdChat.connect(userId)`
3. `sendbirdChat.groupChannel.createMyGroupChannelListQuery()`
4. `sendbirdChat.groupChannel.createChannel(params)`
5. `channel.updateChannel(params)`

**Prohibited:**

- `GroupChannelCollection` (must NOT be used)
- Any other SDK functions not listed above

---

### 6.3 Architecture & Project Structure

```
dynamic-channel-list-fe/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (channel list)
│   ├── globals.css              # Global styles
│   └── providers.tsx            # React Query provider
│
├── components/
│   ├── ChannelList/
│   │   ├── ChannelList.tsx      # Main list component
│   │   ├── ChannelList.test.tsx # Unit tests
│   │   ├── ChannelList.module.css
│   │   └── index.ts
│   │
│   ├── ChannelItem/
│   │   ├── ChannelItem.tsx      # Individual item
│   │   ├── ChannelItem.test.tsx
│   │   ├── ChannelItem.module.css
│   │   └── index.ts
│   │
│   ├── CreateChannelButton/
│   │   ├── CreateChannelButton.tsx
│   │   ├── CreateChannelButton.test.tsx
│   │   └── index.ts
│   │
│   └── UI/                       # Shared UI components
│       ├── LoadingSpinner/
│       ├── ErrorMessage/
│       └── EmptyState/
│
├── hooks/
│   ├── useSendbird.ts           # Sendbird initialization
│   ├── useSendbird.test.ts
│   ├── useChannelList.ts        # Channel CRUD operations
│   ├── useChannelList.test.ts
│   ├── useInfiniteScroll.ts     # Scroll detection
│   └── useHoverAnimation.ts     # Hover state management
│
├── services/
│   ├── sendbird/
│   │   ├── client.ts            # SDK client singleton
│   │   ├── channel.service.ts   # Channel operations
│   │   └── channel.service.test.ts
│   │
│   └── api/
│       └── queries.ts           # React Query configurations
│
├── utils/
│   ├── generateRandomName.ts    # 8-letter string generator
│   ├── generateRandomName.test.ts
│   ├── sortChannels.ts          # Sorting logic
│   ├── sortChannels.test.ts
│   └── constants.ts
│
├── types/
│   ├── channel.types.ts         # Channel interfaces
│   └── sendbird.types.ts        # Sendbird type extensions
│
├── __tests__/
│   └── integration/
│       ├── channel-creation.test.tsx
│       ├── channel-update.test.tsx
│       └── infinite-scroll.test.tsx
│
├── docs/                         # Documentation
│   ├── PRD_EN.md                # This file
│   ├── PRD_KO.md                # Korean version
│   ├── TECH_SPEC_EN.md          # Technical specifications
│   ├── TECH_SPEC_KO.md
│   ├── REQUIREMENTS.md          # Original requirements
│   └── *.pdf                    # Assignment document
│
├── .env.local.example           # Environment variables template
├── .eslintrc.json
├── .prettierrc
├── jest.config.js
├── jest.setup.js
├── next.config.js
├── tsconfig.json
└── package.json
```

---

### 6.4 Data Models

**Channel Interface:**

```typescript
interface Channel {
  url: string // Unique identifier from Sendbird
  name: string // 8-letter random string
  createdAt: number // Timestamp
  customType?: string
  data?: string
}
```

**List State Interface:**

```typescript
interface ChannelListState {
  channels: Channel[]
  isLoading: boolean
  isLoadingMore: boolean
  error: Error | null
  hasNextPage: boolean
  hoveredIndex: number | null
}
```

---

### 6.5 Performance Requirements

**Animation Performance:**

- Target: 60 FPS during hover animations
- Use CSS transforms (GPU-accelerated)
- Avoid layout thrashing
- Use `will-change` property sparingly

**Rendering Optimization:**

- Implement `React.memo` for ChannelItem
- Use stable keys (channel.url)
- Avoid unnecessary re-renders
- Debounce/throttle scroll events

**Bundle Size:**

- Initial bundle < 200KB (gzipped)
- Code splitting for heavy dependencies
- Tree-shaking enabled

**Load Performance:**

- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- Lighthouse score ≥ 90

---

## 7. Non-Functional Requirements

### 7.1 Browser Compatibility

- **Primary Target**: Latest Chrome (Desktop)
- **Minimum**: Chrome 120+
- **Not Required**: Safari, Firefox, Edge, Mobile browsers

### 7.2 Accessibility (Optional but Recommended)

- Keyboard navigation (Tab, Enter)
- ARIA labels for screen readers
- Focus indicators
- Semantic HTML

### 7.3 Code Quality Standards

- **TypeScript**: Strict mode, no `any` types
- **ESLint**: Zero errors in production
- **Test Coverage**: ≥80% for critical paths
- **Documentation**: JSDoc comments for public APIs

### 7.4 Security

- Environment variables for API keys
- Input sanitization (channel names)
- XSS prevention
- No sensitive data in client-side code

---

## 8. Constraints & Limitations

### 8.1 Technical Constraints

1. **SDK Restrictions**: Only 5 specific Sendbird functions allowed
2. **No Collection**: `GroupChannelCollection` is prohibited
3. **No Local Cache**: `localCacheEnabled` must be `false`
4. **React Version**: Must use latest React (18+)
5. **Browser**: Chrome-only (no cross-browser support needed)

### 8.2 Development Constraints

1. **TDD Required**: Write tests before implementation
2. **AI Tools**: Allowed but must document usage
3. **Documentation**: Both EN and KO versions required
4. **Prompt Tracking**: All AI prompts must be documented

### 8.3 Functional Limitations

1. **Channel Names**: Random 8-letter strings only (no custom input)
2. **Sorting**: Alphabetical only (no other sort options)
3. **Pagination**: Fixed 10 items per page
4. **Animation**: Fixed 40px/20px movement (not configurable)

---

## 9. User Interface Requirements

### 9.1 Layout Specifications

**Channel List Container:**

- Max height: 10 items × item height
- Overflow: Auto scroll (vertical)
- Width: Flexible (responsive to container)
- Background: Light color
- Border: Subtle border or shadow

**Channel Item:**

- Height: 48-60px (consistent)
- Padding: 12px 16px
- Border: Bottom border (separator)
- Background: White
- Hover state: Subtle background change + transform

**Create Button:**

- Position: Top of list (fixed or sticky)
- Padding: 12px 24px
- Border radius: 4-8px
- Primary color (e.g., blue)
- Hover state: Darker shade

### 9.2 Animation Specifications

**Hover Animation:**

- Property: `transform: translateX()`
- Duration: 250ms
- Easing: `ease-in-out`
- Hovered item: `translateX(40px)`
- Adjacent items: `translateX(20px)`

**Insert/Update Animation:**

- Property: `opacity`, `transform`
- Duration: 300ms
- Easing: `ease-out`
- Entry: Fade in + slide from left
- Movement: Smooth transition to new position

**Loading States:**

- Spinner: Centered in container
- Skeleton: Optional placeholder UI
- Opacity: 0.6 during loading

### 9.3 States & Feedback

**Empty State:**

- Message: "No channels yet. Create your first channel!"
- Icon: Optional empty state illustration
- CTA: Highlight create button

**Loading State:**

- Initial load: Full-screen spinner
- Pagination: Bottom spinner
- Button: Disabled state with spinner

**Error State:**

- Message: User-friendly error text
- Retry button: Prominent
- Color: Warning red

**Hover State:**

- Cursor: `pointer`
- Background: Subtle highlight
- Transform: As specified in animations

---

## 10. Testing Requirements

### 10.1 Test Coverage Goals

| Type              | Coverage Target | Tools                 |
| ----------------- | --------------- | --------------------- |
| Unit Tests        | ≥80%            | Jest                  |
| Component Tests   | ≥80%            | React Testing Library |
| Integration Tests | Key flows       | Jest + RTL            |
| E2E Tests         | Optional        | Playwright (future)   |

### 10.2 Test Cases (TDD Approach)

**Utility Functions:**

- ✅ `generateRandomName()`: Returns 8-letter string
- ✅ `generateRandomName()`: Only lowercase letters
- ✅ `sortChannels()`: Sorts alphabetically
- ✅ `sortChannels()`: Case-insensitive sorting

**Components:**

- ✅ `ChannelItem`: Renders channel name
- ✅ `ChannelItem`: Applies hover animation class
- ✅ `ChannelItem`: Handles click events
- ✅ `ChannelList`: Renders list of channels
- ✅ `ChannelList`: Renders empty state
- ✅ `CreateChannelButton`: Triggers creation

**Hooks:**

- ✅ `useSendbird`: Initializes SDK correctly
- ✅ `useSendbird`: Connects user
- ✅ `useChannelList`: Fetches initial channels
- ✅ `useChannelList`: Creates new channel
- ✅ `useChannelList`: Updates channel
- ✅ `useChannelList`: Loads next page

**Integration:**

- ✅ Full creation flow: Button → API → List update
- ✅ Full update flow: Click → API → Re-sort
- ✅ Infinite scroll: Scroll → Load → Append
- ✅ Animation: Hover → Transform → Reset

---

## 11. Development Phases

### 11.1 Phase 1: Foundation (Week 1)

**Setup & Configuration:**

- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Configure ESLint, Prettier, Husky
- [ ] Setup Jest and React Testing Library
- [ ] Create project structure
- [ ] Configure environment variables

**Base Implementation:**

- [ ] Define TypeScript types and interfaces
- [ ] Implement `generateRandomName()` utility (TDD)
- [ ] Implement `sortChannels()` utility (TDD)
- [ ] Create Sendbird client service
- [ ] Write unit tests for utilities

---

### 11.2 Phase 2: Step 1 - Animated List (Week 1)

**Deliverables:**

- [ ] `ChannelItem` component with hover animation
- [ ] `ChannelList` component with dummy data
- [ ] CSS animations (40px/20px translateX)
- [ ] Hover state management hook
- [ ] Component tests

**Acceptance:**

- ✅ List displays dummy 8-letter strings
- ✅ Items sorted alphabetically
- ✅ Hover animation works smoothly
- ✅ Adjacent items move correctly
- ✅ All tests pass

---

### 11.3 Phase 3: Step 2 - Channel Creation (Week 1-2)

**Deliverables:**

- [ ] `CreateChannelButton` component
- [ ] Sendbird channel creation integration
- [ ] React Query mutation setup
- [ ] Dynamic list insertion logic
- [ ] Loading and error states
- [ ] Integration tests

**Acceptance:**

- ✅ Button creates channel via SDK
- ✅ New channel appears in correct position
- ✅ List re-sorts automatically
- ✅ Loading state displays during creation
- ✅ Error handling works

---

### 11.4 Phase 4: Step 3 - Pagination (Week 2)

**Deliverables:**

- [ ] Replace dummy data with real Sendbird data
- [ ] Implement `useInfiniteScroll` hook
- [ ] React Query infinite query setup
- [ ] Container height limitation (10 items)
- [ ] Loading indicator for pagination
- [ ] Integration tests

**Acceptance:**

- ✅ Real channels load from Sendbird
- ✅ Container height limited to 10 items
- ✅ Scroll to bottom loads next page
- ✅ No duplicate channels
- ✅ Loading indicator appears
- ✅ All tests pass

---

### 11.5 Phase 5: Step 4 - Channel Update (Week 2)

**Deliverables:**

- [ ] Click event handlers on items
- [ ] Channel update mutation
- [ ] Re-positioning animation
- [ ] Optimistic update (optional)
- [ ] Integration tests

**Acceptance:**

- ✅ Click updates channel name
- ✅ Updated channel moves to new position
- ✅ Animation is smooth
- ✅ Other channels maintain order
- ✅ All tests pass

---

### 11.6 Phase 6: Polish & Documentation (Week 3)

**Deliverables:**

- [ ] Code refactoring and optimization
- [ ] Performance testing (Lighthouse)
- [ ] Accessibility improvements
- [ ] README.md (EN + KO)
- [ ] TECH_SPEC.md (EN + KO)
- [ ] CLAUDE.md (AI usage documentation)
- [ ] Environment setup guide

**Acceptance:**

- ✅ Code coverage ≥80%
- ✅ Lighthouse score ≥90
- ✅ Zero ESLint errors
- ✅ All documentation complete
- ✅ Project ready for submission

---

## 12. Risks & Mitigations

| Risk                         | Impact | Probability | Mitigation                                      |
| ---------------------------- | ------ | ----------- | ----------------------------------------------- |
| Sendbird API rate limits     | High   | Medium      | Implement request debouncing, error handling    |
| Animation performance issues | Medium | Low         | Use CSS transforms, GPU acceleration, profiling |
| Test coverage below 80%      | Medium | Medium      | TDD approach, regular coverage checks           |
| SDK breaking changes         | High   | Low         | Pin SDK version, test before upgrading          |
| Infinite scroll bugs         | Medium | Medium      | Thorough testing, intersection observer         |
| TypeScript complexity        | Low    | Medium      | Team training, clear type definitions           |

---

## 13. Success Criteria

### 13.1 Functional Success

- ✅ All 4 steps implemented and working
- ✅ Animations smooth and responsive
- ✅ Channels sorted alphabetically at all times
- ✅ Infinite scroll loads all channels
- ✅ Create and update operations successful

### 13.2 Technical Success

- ✅ Test coverage ≥80%
- ✅ Zero ESLint/TypeScript errors
- ✅ Lighthouse performance score ≥90
- ✅ Only allowed Sendbird functions used
- ✅ No `GroupChannelCollection` usage

### 13.3 Documentation Success

- ✅ PRD complete (EN + KO)
- ✅ Tech spec complete (EN + KO)
- ✅ README with setup instructions
- ✅ CLAUDE.md with AI usage details
- ✅ Code comments and JSDoc

---

## 14. Deliverables Checklist

### 14.1 Code Deliverables

- [ ] Working Next.js application
- [ ] All source code with tests
- [ ] Configuration files (ESLint, Jest, etc.)
- [ ] Environment variable template
- [ ] Git repository with clean history

### 14.2 Documentation Deliverables

- [ ] PRD (EN + KO) - This document
- [ ] Technical Specification (EN + KO)
- [ ] README.md (setup + usage)
- [ ] CLAUDE.md (AI tool usage)
- [ ] All prompts used (automated via hooks)

### 14.3 Test Deliverables

- [ ] Unit tests for all utilities
- [ ] Component tests for all components
- [ ] Integration tests for key flows
- [ ] Test coverage report (≥80%)

---

## 15. Appendices

### 15.1 Glossary

| Term                | Definition                                                    |
| ------------------- | ------------------------------------------------------------- |
| **Channel**         | A Sendbird group channel entity with a unique URL and name    |
| **Hover Animation** | CSS transform animation triggered by mouse hover              |
| **Infinite Scroll** | Automatic loading of next page when scrolling to bottom       |
| **TDD**             | Test-Driven Development - writing tests before implementation |
| **SDK**             | Software Development Kit (Sendbird Chat SDK)                  |
| **React Query**     | TanStack Query - server state management library              |

### 15.2 References

**Sendbird Documentation:**

- [Sendbird Dashboard](https://dashboard.sendbird.com/)
- [Chat SDK for JavaScript](https://sendbird.com/docs/chat/sdk/v4/javascript/overview)
- [GroupChannel API Reference](https://sendbird.com/docs/chat/sdk/v4/javascript/channel/group-channel/overview)

**Technical Documentation:**

- [React 18 Documentation](https://react.dev/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Jest Documentation](https://jestjs.io/)

**Related Documents:**

- `docs/REQUIREMENTS.md` - Extended requirements
- `docs/TECH_SPEC_EN.md` - Technical specifications
- `docs/_JS__EN__Assignment_for_Messaging_Apps_(UIKit)_-_Dynamic_Channel_List.pdf` - Original assignment

---

## 16. Approval & Sign-off

| Role          | Name | Signature | Date |
| ------------- | ---- | --------- | ---- |
| Product Owner | -    | -         | -    |
| Tech Lead     | -    | -         | -    |
| QA Lead       | -    | -         | -    |
| Stakeholder   | -    | -         | -    |

---

**Document Version History:**

| Version | Date       | Author           | Changes              |
| ------- | ---------- | ---------------- | -------------------- |
| 1.0.0   | 2025-11-23 | Development Team | Initial PRD creation |

---

**End of Document**
