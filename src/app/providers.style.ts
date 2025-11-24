/**
 * Providers 스타일
 */

import styled from 'styled-components'
import { animations, colors, CenteredContainer, Card, PrimaryButton } from '@/_styles/common.style'

export const LoadingContainer = styled(CenteredContainer)``

export const LoadingContent = styled.div`
  text-align: center;
`

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 2px solid ${colors.success.main};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${animations.spin} 1s linear infinite;
  margin: 0 auto 16px;
`

export const LoadingText = styled.p`
  color: ${colors.gray[700]};
`

export const ErrorContainer = styled(CenteredContainer)``

export const ErrorCard = styled(Card)`
  text-align: center;
  max-width: 448px;
  padding: 24px;
`

export const ErrorIcon = styled.div`
  color: ${colors.error.main};
  font-size: 36px;
  margin-bottom: 16px;
`

export const ErrorTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.gray[900]};
  margin-bottom: 8px;
`

export const ErrorMessage = styled.p`
  color: ${colors.gray[700]};
  margin-bottom: 16px;
`

export const ErrorHint = styled.p`
  font-size: 14px;
  color: ${colors.gray[500]};
`

export const RetryButton = styled(PrimaryButton)`
  margin-top: 16px;
  padding: 8px 16px;
`
