/**
 * ChannelItem 스타일
 */

import styled from 'styled-components'
import { animations, colors } from '@/_styles/common.style'

export const StyledChannelItem = styled.div<{ $clickable: boolean; $isUpdating: boolean }>`
  padding: 16px;
  border-bottom: 1px solid ${colors.gray[200]};
  background-color: ${colors.background.main};
  transition:
    transform 250ms ease-in-out,
    background-color 200ms ease;
  transform: translateX(0);
  will-change: transform;
  backface-visibility: hidden;
  animation: ${animations.fadeSlideIn} 300ms ease-out;
  cursor: ${props => (props.$clickable ? 'pointer' : 'default')};
  position: relative;
  opacity: ${props => (props.$isUpdating ? 0.6 : 1)};
  pointer-events: ${props => (props.$isUpdating ? 'none' : 'auto')};
  user-select: ${props => (props.$clickable ? 'none' : 'auto')};

  &:hover {
    transform: translateX(40px);
    background-color: ${colors.background.light};
  }

  &:hover + & {
    transform: translateX(20px);
  }

  &:has(+ &:hover) {
    transform: translateX(20px);
  }

  ${props =>
    props.$clickable &&
    `
    &:active {
      background-color: ${colors.background.hover};
      transform: translateX(38px) scale(0.99);
    }

    &:focus {
      outline: 2px solid ${colors.primary.main};
      outline-offset: -2px;
    }
  `}
`

export const ChannelInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ChannelName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.gray[800]};
  margin: 0;
`

export const ChannelUrl = styled.p`
  font-size: 14px;
  color: ${colors.gray[500]};
  margin: 0;
  font-family: monospace;
`

export const ChannelDate = styled.time`
  font-size: 12px;
  color: ${colors.gray[300]};
`

export const CustomType = styled.span`
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  color: ${colors.primary.main};
  background-color: ${colors.primary.lightest};
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
`

export const LoadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  font-size: 12px;
  color: ${colors.gray[500]};
  font-weight: 500;
  padding: 4px 8px;
  background-color: ${colors.background.dark};
  border-radius: 4px;
  animation: ${animations.pulse} 1.5s ease-in-out infinite;
`
