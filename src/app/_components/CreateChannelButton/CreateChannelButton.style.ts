/**
 * CreateChannelButton 스타일
 */

import styled from 'styled-components'
import { colors, PrimaryButton } from '@/_styles/common.style'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Button = styled(PrimaryButton)<{ $isLoading?: boolean }>`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: ${props => (props.$isLoading ? colors.primary.light : colors.primary.main)};
  cursor: ${props => (props.$isLoading ? 'not-allowed' : 'pointer')};
`

export const LoadingContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

export const LoadingText = styled.span`
  display: inline-block;
`

export const ErrorWrapper = styled.div`
  margin-top: 4px;
`
