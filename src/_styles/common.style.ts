/**
 * 공통 스타일 유틸리티
 *
 * 프로젝트 전체에서 재사용되는 색상, keyframes, 스타일 컴포넌트를 정의합니다.
 */

import styled, { keyframes, css } from 'styled-components'

/**
 * 색상 팔레트
 */
export const colors = {
  // Primary colors
  primary: {
    main: '#5856d6',
    dark: '#4745b8',
    darker: '#3a399a',
    light: '#a5a5c7',
    lightest: '#ededff',
  },
  // Gray scale
  gray: {
    50: '#f9fafb',
    100: '#f1f1f1',
    200: '#e0e0e0',
    300: '#999999',
    400: '#888888',
    500: '#666666',
    600: '#555555',
    700: '#4b5563',
    800: '#333333',
    900: '#111827',
  },
  // Semantic colors
  error: {
    main: '#dc2626',
    light: '#fef2f2',
    border: '#fecaca',
    dark: '#991b1b',
    hover: '#f87171',
    active: '#fee2e2',
    border2: '#fca5a5',
  },
  success: {
    main: '#3b82f6',
    dark: '#2563eb',
  },
  // Backgrounds
  background: {
    main: '#ffffff',
    gray: '#fafafa',
    dark: '#f0f0f0',
    light: '#f9f9f9',
    hover: '#e8e8e8',
  },
} as const

/**
 * 공통 Keyframes
 */
export const animations = {
  spin: keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `,

  fadeSlideIn: keyframes`
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,

  pulse: keyframes`
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  `,
}

/**
 * 공통 스타일 믹스인
 */
export const mixins = {
  // Flexbox 중앙 정렬
  flexCenter: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  // 컬럼 플렉스
  flexColumn: css`
    display: flex;
    flex-direction: column;
  `,

  // 전체 화면 높이
  fullHeight: css`
    min-height: 100vh;
  `,

  // 스크롤바 스타일링
  scrollbar: css`
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: ${colors.gray[100]};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${colors.gray[400]};
      border-radius: 4px;
      transition: background 200ms ease;

      &:hover {
        background: ${colors.gray[600]};
      }
    }
  `,

  // 스크롤바 숨기기 (스크롤 기능은 유지)
  hideScrollbar: css`
    /* Chrome, Safari, Edge */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Firefox */
    scrollbar-width: none;

    /* IE, Legacy Edge */
    -ms-overflow-style: none;
  `,

  // 부드러운 전환
  transition: css`
    transition: all 200ms ease;
  `,
}

/**
 * 공통 타입
 */
export type Size = 'small' | 'medium' | 'large'

export const sizeMap = {
  small: { width: '16px', height: '16px', borderWidth: '2px' },
  medium: { width: '24px', height: '24px', borderWidth: '3px' },
  large: { width: '32px', height: '32px', borderWidth: '4px' },
} as const

/**
 * 공통 스타일 컴포넌트
 */

// 기본 버튼
export const BaseButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 200ms ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

// Primary 버튼
export const PrimaryButton = styled(BaseButton)`
  color: ${colors.background.main};
  background-color: ${colors.primary.main};

  &:hover:not(:disabled) {
    background-color: ${colors.primary.dark};
  }

  &:active:not(:disabled) {
    background-color: ${colors.primary.darker};
  }

  &:disabled {
    background-color: ${colors.primary.light};
  }
`

// 컨테이너
export const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`

// 중앙 정렬 컨테이너
export const CenteredContainer = styled.div`
  ${mixins.flexCenter}
  ${mixins.fullHeight}
  background-color: ${colors.gray[50]};
`

// 카드
export const Card = styled.div`
  background-color: ${colors.background.main};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`
