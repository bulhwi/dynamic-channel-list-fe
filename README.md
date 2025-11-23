# Dynamic Channel List with Animation

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![Sendbird](https://img.shields.io/badge/Sendbird-4.20.2-purple)](https://sendbird.com/)
[![License](https://img.shields.io/badge/License-Assignment-green)](LICENSE)

A modern, animated channel list implementation using Sendbird UIKit and Next.js 15, featuring smooth animations, infinite scrolling, and real-time updates.

## 📋 Project Overview

This project implements a dynamic channel list with four progressive enhancement steps:

- **Step 1**: Basic list with hover animations (translate + scale effects)
- **Step 2**: Item insertion with staggered animations
- **Step 3**: Dynamic sorting with smooth transitions
- **Step 4**: Real-time updates with auto-positioning

Built with **Test-Driven Development (TDD)** methodology and comprehensive documentation.

## 🚀 Features

- ✅ **Modern Tech Stack**: Next.js 15 with TypeScript, React 19, Tailwind CSS
- ✅ **Smooth Animations**: GPU-accelerated CSS transforms (60 FPS)
- ✅ **Infinite Scrolling**: Load more channels on scroll with React Query
- ✅ **Real-time Updates**: Sendbird SDK integration for live channel updates
- ✅ **Type Safety**: Strict TypeScript with comprehensive type definitions
- ✅ **Testing**: Jest + React Testing Library with 80% coverage target
- ✅ **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- ✅ **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation
- ✅ **Bilingual Docs**: English and Korean documentation

## 📊 Project Status

**Current Phase**: Phase 1 Complete ✅ (5/35 issues, 14.3%)

| Phase   | Status            | Issues     | Progress |
| ------- | ----------------- | ---------- | -------- |
| Phase 1 | ✅ Complete       | #1-5 (5)   | 5/5 100% |
| Phase 2 | 🎯 Ready to Start | #6-13 (8)  | 0/8 0%   |
| Phase 3 | ⏳ Pending        | #14-19 (6) | 0/6 0%   |
| Phase 4 | ⏳ Pending        | #20-25 (6) | 0/6 0%   |
| Phase 5 | ⏳ Pending        | #26-29 (4) | 0/4 0%   |
| Phase 6 | ⏳ Pending        | #30-35 (6) | 0/6 0%   |

**Phase 1 Completed**:

- ✅ Next.js 15.5.6 initialized with TypeScript
- ✅ Core dependencies installed (Sendbird SDK, React Query)
- ✅ Development tools configured (ESLint, Prettier, Husky)
- ✅ Testing environment set up (Jest, React Testing Library)
- ✅ TypeScript types defined (Channel, Sendbird, Component types)

See [GitHub Issues](https://github.com/bulhwi/dynamic-channel-list-fe/issues) for detailed progress tracking.

## 🛠️ Tech Stack

### Core

- **Framework**: Next.js 15.5.6 (App Router)
- **Runtime**: React 19.0.0
- **Language**: TypeScript 5.x (Strict Mode)
- **Styling**: Tailwind CSS 3.4.14

### State Management

- **Server State**: TanStack React Query 5.90.10
- **UI State**: React Hooks (useState, useReducer)

### Backend Integration

- **Chat SDK**: Sendbird Chat SDK 4.20.2

### Testing

- **Framework**: Jest 30.2.0
- **Testing Library**: React Testing Library 16.3.0
- **Coverage Target**: 80% (lines, functions, branches, statements)

### Development Tools

- **Linting**: ESLint 9 + eslint-config-next
- **Formatting**: Prettier 3.6.2
- **Git Hooks**: Husky 9.1.7 + lint-staged

## 📦 Installation

### Prerequisites

- Node.js >= 18.17.0
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/bulhwi/dynamic-channel-list-fe.git
cd dynamic-channel-list-fe

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Sendbird App ID and API Token

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📁 Project Structure

```
dynamic-channel-list-fe/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components (TBD in Phase 2)
├── hooks/                   # Custom React hooks (TBD in Phase 2)
├── services/                # Sendbird service layer (TBD in Phase 2)
├── lib/                     # Utilities (TBD in Phase 2)
├── types/                   # TypeScript type definitions
│   ├── channel.types.ts     # Channel domain types
│   ├── sendbird.types.ts    # Sendbird integration types
│   ├── component.types.ts   # Component props types
│   └── index.ts             # Type exports
├── docs/                    # Documentation
│   ├── en/                  # English documentation
│   │   ├── PRD_EN.md        # Product Requirements Document
│   │   └── TECH_SPEC.md     # Technical Specification
│   ├── ko/                  # Korean documentation
│   │   ├── PRD_KO.md        # 제품 요구사항 문서
│   │   ├── TECH_SPEC.md     # 기술 사양서
│   │   └── REQUIREMENTS.md  # 추가 요구사항
│   └── prompts/             # AI session documentation
│       └── sessions/        # Session-by-session logs
├── __tests__/               # Test files
├── public/                  # Static assets
├── .husky/                  # Git hooks
├── CLAUDE.md                # AI usage documentation
├── jest.config.js           # Jest configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 📚 Documentation

### For Developers

- **[Product Requirements (EN)](docs/en/PRD_EN.md)** - Detailed requirements and user stories
- **[Technical Specification (EN)](docs/en/TECH_SPEC.md)** - Architecture and implementation details
- **[한국어 PRD](docs/ko/PRD_KO.md)** - 제품 요구사항 (한국어)
- **[한국어 기술 사양서](docs/ko/TECH_SPEC.md)** - 기술 사양 (한국어)

### For Evaluators

- **[CLAUDE.md](CLAUDE.md)** - Complete AI usage documentation (required by assignment)
- **[Session Logs](docs/prompts/sessions/)** - Detailed conversation logs with Claude Code
- **[GitHub Issues](https://github.com/bulhwi/dynamic-channel-list-fe/issues)** - Task tracking and progress

### Key Documentation

- **PRD**: 2,000+ lines (EN + KO)
- **Tech Spec**: 2,400+ lines (EN + KO)
- **Session Logs**: 2,700+ lines (4 sessions)
- **AI Documentation**: 8,600+ total lines

## 🧪 Testing

This project follows **Test-Driven Development (TDD)**:

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Coverage Requirements**:

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

Current Status: Phase 1 Complete - 2/2 tests passing ✅

## 🤖 AI Tool Usage

This project was developed with assistance from **Claude Code** (claude-sonnet-4.5) by Anthropic.

All AI interactions are transparently documented:

- **[CLAUDE.md](CLAUDE.md)**: Complete AI usage documentation
- **[Session Logs](docs/prompts/sessions/)**: Detailed conversation logs

**What Claude Code did**:

- ✅ Documentation generation (PRD, Tech Spec)
- ✅ Project planning and task breakdown
- ✅ Architecture design and best practices guidance
- ✅ GitHub Issues creation automation
- ✅ TypeScript type definitions

**What the developer did**:

- ✅ All final decisions and approvals
- ✅ Requirements analysis and clarification
- ✅ Code review and understanding
- ✅ Testing and validation
- ✅ Git commits and project management

All commits include co-authorship:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```

## 🎯 Roadmap

### Phase 1: Foundation & Setup ✅ (100% Complete)

- ✅ Next.js initialization
- ✅ Dependencies installation
- ✅ Development tools setup
- ✅ Testing environment
- ✅ Type definitions

### Phase 2: Step 1 - Animated List (0% Complete)

- ⏳ Utility functions
- ⏳ Sendbird service layer
- ⏳ Basic components with animations
- ⏳ Hover effects implementation

### Phase 3: Step 2 - Item Insertion (Pending)

- ⏳ Insert animation logic
- ⏳ Staggered animations
- ⏳ Position calculation

### Phase 4: Step 3 - Dynamic Sorting (Pending)

- ⏳ Sorting logic
- ⏳ Transition animations
- ⏳ Performance optimization

### Phase 5: Step 4 - Real-time Updates (Pending)

- ⏳ Sendbird event handlers
- ⏳ Auto-positioning logic
- ⏳ Real-time synchronization

### Phase 6: Polish & Deployment (Pending)

- ⏳ Accessibility improvements
- ⏳ Performance optimization
- ⏳ Production build
- ⏳ Deployment setup

See [GitHub Projects](https://github.com/bulhwi/dynamic-channel-list-fe/projects) for detailed roadmap.

## 📝 Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```env
# Sendbird Configuration
NEXT_PUBLIC_SENDBIRD_APP_ID=your_app_id_here
NEXT_PUBLIC_SENDBIRD_API_TOKEN=your_api_token_here

# Optional: User Configuration
NEXT_PUBLIC_DEFAULT_USER_ID=test_user
```

Get your Sendbird credentials at [Sendbird Dashboard](https://dashboard.sendbird.com/).

## 🤝 Contributing

This is an assignment project, but feedback and suggestions are welcome!

1. Check [GitHub Issues](https://github.com/bulhwi/dynamic-channel-list-fe/issues) for current tasks
2. Review [Technical Specification](docs/en/TECH_SPEC.md) for architecture
3. Follow TDD methodology (write tests first)
4. Ensure all tests pass and coverage is maintained

## 📄 License

This project is part of a coding assignment submission.

## 👤 Author

**Park Bulhwi** ([@bulhwi](https://github.com/bulhwi))

Developed with assistance from:

- **Claude Code** (claude-sonnet-4.5) by Anthropic

## 🙏 Acknowledgments

- **Sendbird** - Chat SDK and documentation
- **Vercel** - Next.js framework and hosting
- **Anthropic** - Claude Code AI assistance
- **Open Source Community** - Amazing tools and libraries

---

**Last Updated**: 2025-11-23
**Version**: 0.1.0
**Status**: Phase 1 Complete ✅

---

For detailed AI usage documentation, see [CLAUDE.md](CLAUDE.md).
For session-by-session conversation logs, see [docs/prompts/sessions/](docs/prompts/sessions/).
