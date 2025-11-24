/**
 * ErrorMessage 스타일
 */

import styled from 'styled-components'
import { colors } from '@/_styles/common.style'

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: ${colors.error.light};
  border: 1px solid ${colors.error.border};
  border-radius: 6px;
  color: ${colors.error.dark};
`

export const Icon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`

export const Message = styled.p`
  flex: 1;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
`

export const RetryButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.error.dark};
  background-color: ${colors.background.main};
  border: 1px solid ${colors.error.border2};
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 200ms ease,
    border-color 200ms ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${colors.error.light};
    border-color: ${colors.error.hover};
  }

  &:active {
    background-color: ${colors.error.active};
  }

  &:focus {
    outline: 2px solid ${colors.error.main};
    outline-offset: 2px;
  }
`
