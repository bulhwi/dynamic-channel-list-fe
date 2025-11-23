#!/bin/bash

# GitHub Issues Creation Script
# This script creates milestones, labels, and issues for the project

set -e

echo "🚀 Creating GitHub Project Structure..."

# ============================================================================
# 1. Create Labels
# ============================================================================
echo ""
echo "📌 Creating Labels..."

gh label create "setup" --description "Project setup and configuration" --color "0E8A16" --force || true
gh label create "feature" --description "New feature implementation" --color "1D76DB" --force || true
gh label create "test" --description "Testing related tasks" --color "FBCA04" --force || true
gh label create "docs" --description "Documentation" --color "0075CA" --force || true
gh label create "enhancement" --description "Enhancement to existing feature" --color "A2EEEF" --force || true
gh label create "step-1" --description "Step 1: Animated List" --color "D93F0B" --force || true
gh label create "step-2" --description "Step 2: Channel Creation" --color "D93F0B" --force || true
gh label create "step-3" --description "Step 3: Pagination" --color "D93F0B" --force || true
gh label create "step-4" --description "Step 4: Channel Update" --color "D93F0B" --force || true
gh label create "tdd" --description "Test-Driven Development" --color "5319E7" --force || true

echo "✅ Labels created"

# ============================================================================
# 2. Create Milestones
# ============================================================================
echo ""
echo "🎯 Creating Milestones..."

gh api repos/:owner/:repo/milestones -f title="Phase 1: Foundation & Setup" \
  -f description="Project initialization, dependencies, and foundation utilities" \
  -f due_on="2025-12-01T00:00:00Z" || true

gh api repos/:owner/:repo/milestones -f title="Phase 2: Step 1 - Animated List" \
  -f description="Implement dummy data list with hover animations" \
  -f due_on="2025-12-05T00:00:00Z" || true

gh api repos/:owner/:repo/milestones -f title="Phase 3: Step 2 - Channel Creation" \
  -f description="Integrate Sendbird SDK and implement channel creation" \
  -f due_on="2025-12-10T00:00:00Z" || true

gh api repos/:owner/:repo/milestones -f title="Phase 4: Step 3 - Pagination" \
  -f description="Replace dummy data and implement infinite scroll" \
  -f due_on="2025-12-15T00:00:00Z" || true

gh api repos/:owner/:repo/milestones -f title="Phase 5: Step 4 - Channel Update" \
  -f description="Implement channel update and re-positioning" \
  -f due_on="2025-12-20T00:00:00Z" || true

gh api repos/:owner/:repo/milestones -f title="Phase 6: Polish & Deployment" \
  -f description="Code refinement, testing, documentation, and deployment" \
  -f due_on="2025-12-25T00:00:00Z" || true

echo "✅ Milestones created"

# ============================================================================
# 3. Create Issues
# ============================================================================
echo ""
echo "📝 Creating Issues..."

# Phase 1: Foundation & Setup (Milestone 1)
# ----------------------------------------------------------------------------

gh issue create --title "Initialize Next.js 15 project with TypeScript" \
  --milestone "Phase 1: Foundation & Setup" \
  --label "setup,feature" \
  --body "## Objective
Initialize a new Next.js 15 project with TypeScript, App Router, and essential configurations.

## Tasks
- [ ] Run \`npx create-next-app@latest\` with TypeScript
- [ ] Configure App Router structure
- [ ] Setup \`tsconfig.json\` with strict mode
- [ ] Configure \`next.config.js\`
- [ ] Create basic directory structure (\`components/\`, \`hooks/\`, \`services/\`, etc.)

## Acceptance Criteria
- [x] Next.js 15+ installed
- [x] TypeScript strict mode enabled
- [x] App Router structure in place
- [x] Development server runs without errors

## Reference
- PRD: Phase 1, Section 6.1
- Tech Spec: Section 2 (Technology Stack)"

gh issue create --title "Install and configure core dependencies" \
  --milestone "Phase 1: Foundation & Setup" \
  --label "setup" \
  --body "## Objective
Install Sendbird SDK, React Query, and other core dependencies.

## Tasks
- [ ] Install \`@sendbird/chat\`
- [ ] Install \`@tanstack/react-query\` and devtools
- [ ] Install development dependencies (types, etc.)
- [ ] Configure package.json scripts
- [ ] Create \`.env.local.example\`

## Dependencies
\`\`\`json
{
  \"@sendbird/chat\": \"^4.13.0\",
  \"@tanstack/react-query\": \"^5.0.0\",
  \"@tanstack/react-query-devtools\": \"^5.0.0\"
}
\`\`\`

## Acceptance Criteria
- [x] All dependencies installed
- [x] No version conflicts
- [x] Environment variables template created

## Reference
- Tech Spec: Section 2.1"

gh issue create --title "Configure ESLint, Prettier, and Husky" \
  --milestone "Phase 1: Foundation & Setup" \
  --label "setup" \
  --body "## Objective
Setup code quality tools for consistent code style and automated checks.

## Tasks
- [ ] Configure ESLint with Airbnb config
- [ ] Setup Prettier with integration
- [ ] Install and configure Husky for git hooks
- [ ] Setup lint-staged for pre-commit checks
- [ ] Add npm scripts for linting and formatting

## Acceptance Criteria
- [x] ESLint shows no errors on sample code
- [x] Prettier formats code correctly
- [x] Pre-commit hooks run automatically
- [x] \`npm run lint\` and \`npm run format\` work

## Reference
- Tech Spec: Section 13.1 (Code Style)"

gh issue create --title "Setup Jest and React Testing Library" \
  --milestone "Phase 1: Foundation & Setup" \
  --label "setup,test" \
  --body "## Objective
Configure testing environment with Jest and React Testing Library.

## Tasks
- [ ] Install Jest and jsdom environment
- [ ] Install React Testing Library and jest-dom
- [ ] Create \`jest.config.js\`
- [ ] Create \`jest.setup.js\` with mocks
- [ ] Configure coverage thresholds (80%)
- [ ] Add test scripts to package.json

## Acceptance Criteria
- [x] Sample test runs successfully
- [x] Coverage report generates
- [x] Sendbird SDK mocked properly
- [x] IntersectionObserver mocked

## Reference
- Tech Spec: Section 9 (Testing Strategy)
- Coverage target: ≥80%"

gh issue create --title "Define TypeScript types and interfaces" \
  --milestone "Phase 1: Foundation & Setup" \
  --label "setup,tdd" \
  --body "## Objective
Create comprehensive TypeScript type definitions for the project.

## Tasks
- [ ] Create \`types/channel.types.ts\`
- [ ] Create \`types/sendbird.types.ts\`
- [ ] Define Channel interface
- [ ] Define ChannelListResponse interface
- [ ] Define component prop types
- [ ] Document all types with JSDoc

## Types to Define
\`\`\`typescript
interface Channel {
  url: string;
  name: string;
  createdAt: number;
  customType?: string;
  data?: string;
}
\`\`\`

## Acceptance Criteria
- [x] All interfaces defined
- [x] Strict mode compliance
- [x] No \`any\` types used
- [x] JSDoc comments added

## Reference
- Tech Spec: Section 14.2"

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

gh issue create --title "Implement sortChannels() utility (TDD)" \
  --milestone "Phase 1: Foundation & Setup" \
  --label "feature,tdd,test" \
  --body "## Objective
Implement utility function to sort channels alphabetically by name using TDD approach.

## Tasks
- [ ] Write test: sorts alphabetically
- [ ] Write test: case-insensitive sorting
- [ ] Write test: doesn't mutate original array
- [ ] Implement function to pass tests
- [ ] Add JSDoc documentation

## Test Cases
\`\`\`typescript
describe('sortChannels', () => {
  it('should sort channels alphabetically', () => {
    const channels = [
      { name: 'zebra', ... },
      { name: 'apple', ... }
    ];
    const sorted = sortChannels(channels);
    expect(sorted[0].name).toBe('apple');
  });

  it('should be case-insensitive', () => {
    // Test implementation
  });

  it('should not mutate original array', () => {
    // Test implementation
  });
});
\`\`\`

## Acceptance Criteria
- [x] All tests pass
- [x] 100% code coverage
- [x] Immutable implementation

## Reference
- PRD: FR-002 (Alphabetical Sorting)
- Tech Spec: Section 14.1"

gh issue create --title "Create Sendbird client service" \
  --milestone "Phase 1: Foundation & Setup" \
  --label "feature,tdd" \
  --body "## Objective
Create Sendbird SDK client service with initialization and connection logic.

## Tasks
- [ ] Create \`services/sendbird/client.ts\`
- [ ] Implement \`initializeSendbird()\`
- [ ] Implement \`connectUser()\`
- [ ] Implement \`getSendbirdInstance()\`
- [ ] Add error handling
- [ ] Write unit tests

## SDK Configuration (REQUIRED)
\`\`\`typescript
SendbirdChat.init({
  appId: process.env.NEXT_PUBLIC_SENDBIRD_APP_ID,
  localCacheEnabled: false, // REQUIRED by assignment
  modules: [new GroupChannelModule()]
})
\`\`\`

## Acceptance Criteria
- [x] Singleton pattern implemented
- [x] \`localCacheEnabled: false\` enforced
- [x] Environment variable validation
- [x] Error handling for failed init/connect
- [x] Unit tests pass

## Reference
- Tech Spec: Section 5.1
- Assignment: SDK constraints"

# Phase 2: Step 1 - Animated List (Milestone 2)
# ----------------------------------------------------------------------------

gh issue create --title "[Step 1] Create ChannelItem component with hover animation" \
  --milestone "Phase 2: Step 1 - Animated List" \
  --label "feature,step-1,tdd" \
  --body "## Objective
Create ChannelItem component with hover animations (40px for hovered, 20px for adjacent).

## Tasks
- [ ] Create \`components/ChannelItem/ChannelItem.tsx\`
- [ ] Create \`ChannelItem.module.css\`
- [ ] Implement hover state props (isHovered, isAdjacent)
- [ ] Apply CSS transforms (translateX)
- [ ] Add transitions (250ms ease-in-out)
- [ ] Write component tests

## Animation Specifications
- Hovered item: \`translateX(40px)\`
- Adjacent items: \`translateX(20px)\`
- Duration: 250ms
- Easing: ease-in-out

## Acceptance Criteria
- [x] Component renders channel name
- [x] Hover animation works smoothly
- [x] Adjacent items move 20px
- [x] 60 FPS performance
- [x] Component tests pass

## Reference
- PRD: Step 1, FR-003
- Tech Spec: Section 3.2.2"

gh issue create --title "[Step 1] Create ChannelList component with dummy data" \
  --milestone "Phase 2: Step 1 - Animated List" \
  --label "feature,step-1" \
  --body "## Objective
Create ChannelList component that displays dummy data in alphabetical order.

## Tasks
- [ ] Create \`components/ChannelList/ChannelList.tsx\`
- [ ] Create \`ChannelList.module.css\`
- [ ] Generate dummy 8-letter strings (5+ items)
- [ ] Sort dummy data alphabetically
- [ ] Render ChannelItem components
- [ ] Manage hover state
- [ ] Write component tests

## Dummy Data Example
\`\`\`typescript
const dummyChannels = [
  { url: '1', name: 'aaabsdfc', createdAt: Date.now() },
  { url: '2', name: 'abcileps', createdAt: Date.now() },
  { url: '3', name: 'bsoijdkf', createdAt: Date.now() },
  { url: '4', name: 'cmbkmeya', createdAt: Date.now() },
  { url: '5', name: 'dmnvluye', createdAt: Date.now() },
];
\`\`\`

## Acceptance Criteria
- [x] List displays dummy channels
- [x] Channels sorted alphabetically
- [x] Hover state managed correctly
- [x] Component tests pass

## Reference
- PRD: Step 1, FR-001, FR-002
- Tech Spec: Section 3.2.1"

gh issue create --title "[Step 1] Implement CSS animations for hover effects" \
  --milestone "Phase 2: Step 1 - Animated List" \
  --label "feature,step-1,enhancement" \
  --body "## Objective
Implement smooth CSS animations with GPU acceleration.

## Tasks
- [ ] Add \`transform\` and \`transition\` properties
- [ ] Implement \`will-change\` optimization
- [ ] Add \`backface-visibility: hidden\`
- [ ] Test 60 FPS performance
- [ ] Add fallback for older browsers (if needed)

## CSS Implementation
\`\`\`css
.item {
  transform: translateX(0);
  transition: transform 250ms ease-in-out;
  will-change: transform;
  backface-visibility: hidden;
}
\`\`\`

## Acceptance Criteria
- [x] Animations run at 60 FPS
- [x] GPU acceleration enabled
- [x] No layout thrashing
- [x] Smooth on Chrome latest

## Reference
- Tech Spec: Section 6.1"

gh issue create --title "[Step 1] Create useHoverAnimation hook" \
  --milestone "Phase 2: Step 1 - Animated List" \
  --label "feature,step-1,tdd" \
  --body "## Objective
Create custom hook to manage hover animation state.

## Tasks
- [ ] Create \`hooks/useHoverAnimation.ts\`
- [ ] Implement \`hoveredIndex\` state
- [ ] Implement \`handleHover\` callback
- [ ] Implement \`handleLeave\` callback
- [ ] Write hook tests

## Hook Interface
\`\`\`typescript
interface UseHoverAnimationReturn {
  hoveredIndex: number | null;
  handleHover: (index: number) => void;
  handleLeave: () => void;
}
\`\`\`

## Acceptance Criteria
- [x] Hook manages state correctly
- [x] Callbacks are memoized
- [x] Hook tests pass
- [x] TypeScript types defined

## Reference
- Tech Spec: Section 6.2"

gh issue create --title "[Step 1] Write comprehensive component tests" \
  --milestone "Phase 2: Step 1 - Animated List" \
  --label "test,step-1,tdd" \
  --body "## Objective
Write comprehensive tests for Step 1 components.

## Tasks
- [ ] Test ChannelItem rendering
- [ ] Test hover animations
- [ ] Test adjacent item detection
- [ ] Test ChannelList rendering
- [ ] Test alphabetical sorting
- [ ] Integration test: full hover flow

## Coverage Target
- ≥80% for all Step 1 components

## Acceptance Criteria
- [x] All component tests pass
- [x] Coverage ≥80%
- [x] Animation tests verify transforms
- [x] Integration test passes

## Reference
- Tech Spec: Section 9"

# Phase 3: Step 2 - Channel Creation (Milestone 3)
# ----------------------------------------------------------------------------

gh issue create --title "[Step 2] Create CreateChannelButton component" \
  --milestone "Phase 3: Step 2 - Channel Creation" \
  --label "feature,step-2" \
  --body "## Objective
Create button component to trigger channel creation.

## Tasks
- [ ] Create \`components/CreateChannelButton/CreateChannelButton.tsx\`
- [ ] Implement click handler
- [ ] Show loading state during creation
- [ ] Show error state on failure
- [ ] Write component tests

## Acceptance Criteria
- [x] Button triggers channel creation
- [x] Loading spinner shows during API call
- [x] Button disabled during loading
- [x] Error message displays on failure
- [x] Component tests pass

## Reference
- PRD: Step 2, FR-004
- Tech Spec: Section 3.2.3"

gh issue create --title "[Step 2] Integrate Sendbird channel creation API" \
  --milestone "Phase 3: Step 2 - Channel Creation" \
  --label "feature,step-2" \
  --body "## Objective
Integrate Sendbird SDK to create channels with random names.

## Tasks
- [ ] Create \`services/sendbird/channel.service.ts\`
- [ ] Implement \`createChannel()\` function
- [ ] Use \`generateRandomName()\` for channel name
- [ ] Transform Sendbird GroupChannel to Channel type
- [ ] Add error handling
- [ ] Write service tests

## SDK Function (ALLOWED)
\`\`\`typescript
await sendbirdChat.groupChannel.createChannel({
  name: generateRandomName() // Random 8-letter string
});
\`\`\`

## Acceptance Criteria
- [x] Channel created successfully
- [x] Random name generated
- [x] Error handling works
- [x] Service tests pass

## Reference
- Tech Spec: Section 5.2
- Assignment: Allowed SDK functions"

gh issue create --title "[Step 2] Setup React Query mutation for channel creation" \
  --milestone "Phase 3: Step 2 - Channel Creation" \
  --label "feature,step-2" \
  --body "## Objective
Setup React Query mutation with cache updates for channel creation.

## Tasks
- [ ] Create \`hooks/useCreateChannel.ts\`
- [ ] Implement mutation with \`createChannel\`
- [ ] Update cache on success (insert + sort)
- [ ] Invalidate queries if needed
- [ ] Add optimistic updates (optional)
- [ ] Write hook tests

## Cache Update Logic
\`\`\`typescript
onSuccess: (newChannel) => {
  queryClient.setQueryData(['channels'], (old) => {
    return sortChannels([...old.channels, newChannel]);
  });
}
\`\`\`

## Acceptance Criteria
- [x] Mutation creates channel
- [x] Cache updated automatically
- [x] New channel appears in correct position
- [x] Hook tests pass

## Reference
- Tech Spec: Section 4.4.2"

gh issue create --title "[Step 2] Implement dynamic list insertion with sorting" \
  --milestone "Phase 3: Step 2 - Channel Creation" \
  --label "feature,step-2,enhancement" \
  --body "## Objective
Insert newly created channel in correct alphabetical position with animation.

## Tasks
- [ ] Integrate mutation with ChannelList
- [ ] Use \`sortChannels()\` after insertion
- [ ] Add insertion animation
- [ ] Prevent unnecessary re-renders
- [ ] Test with React.memo

## Acceptance Criteria
- [x] New channel inserted correctly
- [x] List re-sorts automatically
- [x] Animation is smooth
- [x] No full list re-render

## Reference
- PRD: FR-007"

gh issue create --title "[Step 2] Add loading and error states" \
  --milestone "Phase 3: Step 2 - Channel Creation" \
  --label "feature,step-2" \
  --body "## Objective
Implement comprehensive loading and error state UI.

## Tasks
- [ ] Create LoadingSpinner component
- [ ] Create ErrorMessage component
- [ ] Show loading during channel creation
- [ ] Display error message on failure
- [ ] Add retry mechanism
- [ ] Write UI tests

## Acceptance Criteria
- [x] Loading spinner displays
- [x] Error message is user-friendly
- [x] Retry button works
- [x] UI tests pass

## Reference
- Tech Spec: Section 10"

gh issue create --title "[Step 2] Write integration tests for creation flow" \
  --milestone "Phase 3: Step 2 - Channel Creation" \
  --label "test,step-2" \
  --body "## Objective
Write end-to-end integration test for channel creation.

## Tasks
- [ ] Test: Click button → API called
- [ ] Test: New channel appears in list
- [ ] Test: Channel inserted in correct position
- [ ] Test: Error handling flow
- [ ] Test: Loading states

## Test Scenario
1. User clicks 'Create new channel'
2. Loading spinner appears
3. API creates channel
4. Channel appears in alphabetical position
5. List re-renders with animation

## Acceptance Criteria
- [x] Full flow test passes
- [x] Covers success and error cases
- [x] Mocks Sendbird SDK properly

## Reference
- Tech Spec: Section 9.3"

# Phase 4: Step 3 - Pagination (Milestone 4)
# ----------------------------------------------------------------------------

gh issue create --title "[Step 3] Replace dummy data with Sendbird SDK data" \
  --milestone "Phase 4: Step 3 - Pagination" \
  --label "feature,step-3" \
  --body "## Objective
Fetch real channel data from Sendbird SDK and replace dummy data.

## Tasks
- [ ] Implement \`fetchChannels()\` in channel.service
- [ ] Use \`createMyGroupChannelListQuery()\` with required params
- [ ] Transform GroupChannel[] to Channel[]
- [ ] Handle pagination token
- [ ] Write service tests

## SDK Query (REQUIRED PARAMS)
\`\`\`typescript
sendbirdChat.groupChannel.createMyGroupChannelListQuery({
  includeEmpty: true,
  limit: 10,
  order: GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL
});
\`\`\`

## Acceptance Criteria
- [x] Real channels fetched from Sendbird
- [x] Required params used
- [x] Pagination token handled
- [x] Service tests pass

## Reference
- PRD: Step 3, FR-009
- Tech Spec: Section 5.2"

gh issue create --title "[Step 3] Implement useInfiniteScroll hook" \
  --milestone "Phase 4: Step 3 - Pagination" \
  --label "feature,step-3" \
  --body "## Objective
Create hook to detect scroll bottom using Intersection Observer.

## Tasks
- [ ] Create \`hooks/useInfiniteScroll.ts\`
- [ ] Implement Intersection Observer
- [ ] Add container and sentinel refs
- [ ] Configure threshold and rootMargin
- [ ] Call onLoadMore when bottom reached
- [ ] Write hook tests

## Implementation
\`\`\`typescript
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      onLoadMore();
    }
  },
  { rootMargin: '100px', threshold: 1.0 }
);
\`\`\`

## Acceptance Criteria
- [x] Detects scroll to bottom
- [x] Calls onLoadMore callback
- [x] Cleanup on unmount
- [x] Hook tests pass

## Reference
- Tech Spec: Section 7.1"

gh issue create --title "[Step 3] Setup React Query infinite query" \
  --milestone "Phase 4: Step 3 - Pagination" \
  --label "feature,step-3" \
  --body "## Objective
Setup React Query infinite query for paginated channel data.

## Tasks
- [ ] Create \`hooks/useChannelList.ts\`
- [ ] Use \`useInfiniteQuery\`
- [ ] Configure \`getNextPageParam\`
- [ ] Flatten paginated data
- [ ] Integrate with useInfiniteScroll
- [ ] Write hook tests

## Query Configuration
\`\`\`typescript
useInfiniteQuery({
  queryKey: ['channels', 'alphabetical'],
  queryFn: ({ pageParam }) => fetchChannels({ limit: 10, token: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextToken,
});
\`\`\`

## Acceptance Criteria
- [x] Initial 10 channels loaded
- [x] Next page loads on scroll
- [x] No duplicate channels
- [x] Hook tests pass

## Reference
- Tech Spec: Section 4.4.1"

gh issue create --title "[Step 3] Implement container height limitation (10 items)" \
  --milestone "Phase 4: Step 3 - Pagination" \
  --label "feature,step-3" \
  --body "## Objective
Limit list container height to 10 items with scrollbar.

## Tasks
- [ ] Set max-height in CSS
- [ ] Add overflow-y: auto
- [ ] Style scrollbar (webkit)
- [ ] Test with >10 channels
- [ ] Ensure animations work within scroll

## CSS Implementation
\`\`\`css
.container {
  max-height: calc(60px * 10); /* 10 items × 60px */
  overflow-y: auto;
}
\`\`\`

## Acceptance Criteria
- [x] Container limited to 10 items height
- [x] Scrollbar appears when >10 items
- [x] Animations work smoothly
- [x] Custom scrollbar styled

## Reference
- PRD: FR-008
- Tech Spec: Section 7.2"

gh issue create --title "[Step 3] Add pagination loading indicator" \
  --milestone "Phase 4: Step 3 - Pagination" \
  --label "feature,step-3,enhancement" \
  --body "## Objective
Show loading indicator at bottom when loading next page.

## Tasks
- [ ] Use \`isFetchingNextPage\` from React Query
- [ ] Show small spinner at bottom
- [ ] Position after last channel item
- [ ] Hide when loading complete
- [ ] Test loading state

## Acceptance Criteria
- [x] Loading indicator appears
- [x] Positioned correctly
- [x] Disappears after load
- [x] Doesn't cause layout shift

## Reference
- Tech Spec: Section 9.3"

gh issue create --title "[Step 3] Write integration tests for infinite scroll" \
  --milestone "Phase 4: Step 3 - Pagination" \
  --label "test,step-3" \
  --body "## Objective
Write comprehensive tests for infinite scroll functionality.

## Tasks
- [ ] Test: Initial 10 channels load
- [ ] Test: Scroll to bottom triggers next page
- [ ] Test: No duplicate channels
- [ ] Test: Loading indicator appears/disappears
- [ ] Test: Handles end of list (no more pages)

## Test Scenario
1. List loads with 10 channels
2. User scrolls to bottom
3. Next 10 channels load
4. Process repeats until no more channels

## Acceptance Criteria
- [x] All scroll tests pass
- [x] Intersection Observer mocked
- [x] React Query mocked properly

## Reference
- Tech Spec: Section 9"

# Phase 5: Step 4 - Channel Update (Milestone 5)
# ----------------------------------------------------------------------------

gh issue create --title "[Step 4] Add click event handlers to channel items" \
  --milestone "Phase 5: Step 4 - Channel Update" \
  --label "feature,step-4" \
  --body "## Objective
Add click handlers to channel items to trigger update.

## Tasks
- [ ] Add onClick prop to ChannelItem
- [ ] Change cursor to pointer on hover
- [ ] Prevent click during loading
- [ ] Add visual feedback on click
- [ ] Write component tests

## Acceptance Criteria
- [x] Click handler attached
- [x] Cursor changes to pointer
- [x] Click disabled during loading
- [x] Component tests pass

## Reference
- PRD: Step 4, FR-012
- Tech Spec: Section 3.2.2"

gh issue create --title "[Step 4] Implement channel update mutation" \
  --milestone "Phase 5: Step 4 - Channel Update" \
  --label "feature,step-4" \
  --body "## Objective
Implement React Query mutation for channel name update.

## Tasks
- [ ] Create \`hooks/useUpdateChannel.ts\`
- [ ] Implement \`updateChannel()\` in service
- [ ] Generate new random name
- [ ] Update cache with new name + re-sort
- [ ] Add optimistic update (optional)
- [ ] Write hook and service tests

## SDK Function (ALLOWED)
\`\`\`typescript
await channel.updateChannel({
  name: generateRandomName() // New random 8-letter string
});
\`\`\`

## Acceptance Criteria
- [x] Channel name updates
- [x] Cache updated and re-sorted
- [x] Hook tests pass
- [x] Service tests pass

## Reference
- Tech Spec: Section 4.4.3, 5.2"

gh issue create --title "[Step 4] Add re-positioning animation" \
  --milestone "Phase 5: Step 4 - Channel Update" \
  --label "feature,step-4,enhancement" \
  --body "## Objective
Implement smooth animation when updated channel moves to new position.

## Tasks
- [ ] Use CSS transitions for position change
- [ ] Consider React Transition Group or auto-animate
- [ ] Ensure 60 FPS performance
- [ ] Test with various name changes
- [ ] Prevent layout shift

## Implementation Options
1. CSS-only: \`transition: transform 400ms\`
2. auto-animate library
3. React Transition Group

## Acceptance Criteria
- [x] Channel moves smoothly to new position
- [x] 60 FPS animation
- [x] Other channels maintain position
- [x] No jarring layout shifts

## Reference
- Tech Spec: Section 6.3"

gh issue create --title "[Step 4] Write integration tests for update flow" \
  --milestone "Phase 5: Step 4 - Channel Update" \
  --label "test,step-4" \
  --body "## Objective
Write end-to-end tests for channel update flow.

## Tasks
- [ ] Test: Click channel → name updates
- [ ] Test: Channel moves to new position
- [ ] Test: List re-sorts correctly
- [ ] Test: Animation is smooth
- [ ] Test: Error handling

## Test Scenario
1. User clicks channel 'cmbkmeya'
2. Name updates to 'lovidjkw'
3. Channel moves from position 4 to position 6
4. List re-renders with animation
5. Alphabetical order maintained

## Acceptance Criteria
- [x] Full update flow tested
- [x] Sorting verified
- [x] Animation tested
- [x] Error cases covered

## Reference
- Tech Spec: Section 9"

# Phase 6: Polish & Deployment (Milestone 6)
# ----------------------------------------------------------------------------

gh issue create --title "Code refactoring and optimization" \
  --milestone "Phase 6: Polish & Deployment" \
  --label "enhancement" \
  --body "## Objective
Refactor code for better maintainability and performance.

## Tasks
- [ ] Apply React.memo to all list items
- [ ] Optimize with useMemo/useCallback
- [ ] Extract reusable logic to hooks
- [ ] Remove console.logs
- [ ] Fix all TypeScript warnings
- [ ] Run ESLint and fix all issues

## Acceptance Criteria
- [x] No unnecessary re-renders
- [x] ESLint shows 0 errors
- [x] TypeScript compiles without warnings
- [x] Code follows style guide

## Reference
- Tech Spec: Section 8, 13"

gh issue create --title "Performance testing with Lighthouse" \
  --milestone "Phase 6: Polish & Deployment" \
  --label "test,enhancement" \
  --body "## Objective
Run Lighthouse audit and optimize to achieve ≥90 score.

## Tasks
- [ ] Run Lighthouse audit
- [ ] Optimize bundle size
- [ ] Optimize images (if any)
- [ ] Reduce unused JavaScript
- [ ] Improve FCP and TTI
- [ ] Achieve 60 FPS animations

## Performance Targets
- Lighthouse Score: ≥90
- FCP: <1.5s
- TTI: <3s
- Animation: 60 FPS

## Acceptance Criteria
- [x] Lighthouse score ≥90
- [x] All metrics meet targets
- [x] Bundle size optimized

## Reference
- PRD: Success Metrics
- Tech Spec: Section 8"

gh issue create --title "Accessibility improvements (ARIA, keyboard nav)" \
  --milestone "Phase 6: Polish & Deployment" \
  --label "enhancement,a11y" \
  --body "## Objective
Improve accessibility with ARIA labels and keyboard navigation.

## Tasks
- [ ] Add ARIA labels to all interactive elements
- [ ] Implement keyboard navigation (Tab, Enter)
- [ ] Add focus indicators
- [ ] Test with screen reader
- [ ] Add semantic HTML
- [ ] Run accessibility audit

## Acceptance Criteria
- [x] All buttons have ARIA labels
- [x] Keyboard navigation works
- [x] Focus indicators visible
- [x] Screen reader compatible

## Reference
- Tech Spec: Section 7.2
- PRD: UI/UX considerations"

gh issue create --title "Write comprehensive README.md (EN + KO)" \
  --milestone "Phase 6: Polish & Deployment" \
  --label "docs" \
  --body "## Objective
Create detailed README with setup instructions in both English and Korean.

## Tasks
- [ ] Write README_EN.md
- [ ] Write README_KO.md
- [ ] Add installation instructions
- [ ] Add usage guide
- [ ] Add environment variables guide
- [ ] Add screenshots/GIFs
- [ ] Add tech stack section
- [ ] Add project structure

## Sections to Include
1. Project Overview
2. Features
3. Tech Stack
4. Prerequisites
5. Installation
6. Environment Setup
7. Development
8. Testing
9. Deployment
10. License

## Acceptance Criteria
- [x] Both EN and KO versions complete
- [x] All sections filled
- [x] Clear and concise
- [x] Screenshots included

## Reference
- PRD: Deliverables checklist"

gh issue create --title "Create deployment configuration (Vercel)" \
  --milestone "Phase 6: Polish & Deployment" \
  --label "setup,docs" \
  --body "## Objective
Setup deployment configuration for Vercel.

## Tasks
- [ ] Create \`vercel.json\`
- [ ] Configure environment variables
- [ ] Setup automatic deployments
- [ ] Configure preview deployments
- [ ] Add deployment guide to README
- [ ] Test deployment

## vercel.json Configuration
\`\`\`json
{
  \"framework\": \"nextjs\",
  \"buildCommand\": \"npm run build\",
  \"env\": {
    \"NEXT_PUBLIC_SENDBIRD_APP_ID\": \"@sendbird-app-id\"
  }
}
\`\`\`

## Acceptance Criteria
- [x] App deploys successfully
- [x] Environment variables work
- [x] Auto-deployment on push
- [x] Preview URLs work

## Reference
- Tech Spec: Section 11.4"

gh issue create --title "Final testing and bug fixes" \
  --milestone "Phase 6: Polish & Deployment" \
  --label "test" \
  --body "## Objective
Run comprehensive testing and fix all remaining bugs.

## Tasks
- [ ] Run all unit tests
- [ ] Run all integration tests
- [ ] Manual testing of all features
- [ ] Cross-browser testing (Chrome)
- [ ] Fix all failing tests
- [ ] Fix all bugs found
- [ ] Verify test coverage ≥80%

## Testing Checklist
- [ ] Step 1: Animated list works
- [ ] Step 2: Channel creation works
- [ ] Step 3: Infinite scroll works
- [ ] Step 4: Channel update works
- [ ] All animations smooth (60 FPS)
- [ ] No console errors
- [ ] Alphabetical sorting always correct

## Acceptance Criteria
- [x] All tests pass (100%)
- [x] Coverage ≥80%
- [x] No known bugs
- [x] Ready for submission

## Reference
- PRD: Success criteria
- Tech Spec: Testing strategy"

echo ""
echo "✅ All issues created successfully!"
echo ""
echo "📊 Summary:"
echo "  - Milestones: 6"
echo "  - Labels: 10"
echo "  - Issues: 35"
echo ""
echo "🔗 View on GitHub: https://github.com/bulhwi/dynamic-channel-list-fe/issues"
