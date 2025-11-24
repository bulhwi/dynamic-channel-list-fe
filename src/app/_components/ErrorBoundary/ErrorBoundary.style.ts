/**
 * ErrorBoundary 스타일
 */

import styled from 'styled-components'
import { colors } from '@/_styles/common.style'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
`

export const Icon = styled.div`
  font-size: 64px;
  margin-bottom: 1.5rem;
`

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin: 0 0 1rem 0;
`

export const Message = styled.p`
  font-size: 1rem;
  color: ${colors.gray[600]};
  margin: 0 0 2rem 0;
  max-width: 500px;
  line-height: 1.6;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`

interface ButtonProps {
  $variant?: 'primary' | 'secondary'
}

export const Button = styled.button<ButtonProps>`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props =>
    props.$variant === 'secondary'
      ? `
    background-color: ${colors.background.gray};
    color: ${colors.gray[900]};

    &:hover {
      background-color: ${colors.background.dark};
    }
  `
      : `
    background-color: ${colors.primary.main};
    color: white;

    &:hover {
      background-color: ${colors.primary.dark};
    }
  `}

  &:active {
    transform: scale(0.98);
  }
`

export const DebugInfo = styled.details`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${colors.background.gray};
  border-radius: 0.5rem;
  max-width: 800px;
  text-align: left;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: ${colors.gray[600]};
    margin-bottom: 0.5rem;
  }

  pre {
    margin: 0.5rem 0 0 0;
    padding: 1rem;
    background-color: ${colors.background.main};
    border-radius: 0.25rem;
    overflow-x: auto;
    font-size: 0.875rem;
    color: ${colors.error.main};
    white-space: pre-wrap;
    word-break: break-all;
  }
`
