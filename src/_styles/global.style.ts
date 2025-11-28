/**
 * 전역 스타일
 *
 * CSS Reset 및 기본 스타일을 정의합니다.
 * layout.tsx에서 한 번만 사용됩니다.
 */

import { createGlobalStyle } from 'styled-components'
import { colors } from './common.style'

export const GlobalStyle = createGlobalStyle`
  :root {
    --foreground-rgb: 0, 0, 0;
    --background-rgb: 255, 255, 255;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --foreground-rgb: 255, 255, 255;
      --background-rgb: 15, 23, 42;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    color: rgb(var(--foreground-rgb));
    background: rgb(var(--background-rgb));
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  /* 스크롤바 기본 스타일 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.gray[100]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.gray[400]};
    border-radius: 4px;
    transition: background 200ms ease;

    &:hover {
      background: ${colors.gray[600]};
    }
  }
`
