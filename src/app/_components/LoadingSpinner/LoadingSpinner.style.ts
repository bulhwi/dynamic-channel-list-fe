/**
 * LoadingSpinner 스타일
 */

import styled from 'styled-components'
import { animations, colors, sizeMap, type Size } from '@/_styles/common.style'

export const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

export const Circle = styled.div<{ $size: Size }>`
  width: ${props => sizeMap[props.$size].width};
  height: ${props => sizeMap[props.$size].height};
  border-radius: 50%;
  border-style: solid;
  border-width: ${props => sizeMap[props.$size].borderWidth};
  border-color: ${colors.primary.main} ${colors.gray[200]} ${colors.gray[200]} ${colors.gray[200]};
  animation: ${animations.spin} 0.8s linear infinite;
`
