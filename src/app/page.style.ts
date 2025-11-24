/**
 * Home page 스타일
 */

import styled from 'styled-components'
import { colors, Container } from '@/_styles/common.style'

export const Main = styled.main`
  min-height: 100vh;
  padding: 32px;
  background-color: ${colors.gray[50]};
`

export const StyledContainer = styled(Container)``

export const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${colors.gray[900]};
`

export const Description = styled.p`
  color: ${colors.gray[700]};
  margin-bottom: 32px;
`

export const ButtonContainer = styled.div`
  margin-bottom: 16px;
`
