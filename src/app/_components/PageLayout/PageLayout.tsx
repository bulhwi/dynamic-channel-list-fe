/**
 * PageLayout 클라이언트 컴포넌트
 *
 * styled-components를 사용하는 페이지 레이아웃
 * Server Component인 page.tsx에서 사용
 */

'use client'

import styled from 'styled-components'
import { colors, Container } from '@/_styles/common.style'

const Main = styled.main`
  min-height: 100vh;
  padding: 32px;
  background-color: ${colors.gray[50]};
`

const StyledContainer = styled(Container)``

const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${colors.gray[900]};
`

const ButtonContainer = styled.div`
  margin-bottom: 16px;
`

interface PageLayoutProps {
  title: string
  actions: React.ReactNode
  children: React.ReactNode
}

export default function PageLayout({ title, actions, children }: PageLayoutProps) {
  return (
    <Main>
      <StyledContainer>
        <Title>{title}</Title>
        <ButtonContainer>{actions}</ButtonContainer>
        {children}
      </StyledContainer>
    </Main>
  )
}
