/**
 * ErrorTester 스타일
 */

import styled from 'styled-components'
import { colors } from '@/_styles/common.style'

export const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  background-color: ${colors.background.main};
  border: 2px solid ${colors.primary.main};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 9999;

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    bottom: 10px;
    right: 10px;
    max-height: 70vh;
  }
`

export const Header = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${colors.gray[200]};
`

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.gray[900]};
  margin: 0 0 8px 0;
`

export const Description = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  margin: 0;
  line-height: 1.5;
`

export const Section = styled.div`
  margin-bottom: 24px;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.gray[800]};
  margin: 0 0 12px 0;
`

export const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const TestButton = styled.button`
  padding: 10px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: ${colors.primary.main};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background-color: ${colors.primary.dark};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

export const ResultSection = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: ${colors.background.gray};
  border-radius: 8px;
  border: 1px solid ${colors.gray[300]};
`

export const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

export const ToggleButton = styled.button`
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.primary.main};
  background-color: transparent;
  border: 1px solid ${colors.primary.main};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.primary.main};
    color: white;
  }
`

export const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const ResultItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ResultLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.gray[600]};
  text-transform: uppercase;
`

interface ResultValueProps {
  $highlight?: boolean
}

export const ResultValue = styled.span<ResultValueProps>`
  font-size: 0.875rem;
  color: ${props => (props.$highlight ? colors.error.main : colors.gray[900])};
  font-weight: ${props => (props.$highlight ? 600 : 400)};
`

export const CodeBlock = styled.pre`
  font-size: 0.75rem;
  color: ${colors.gray[800]};
  background-color: ${colors.background.main};
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
`

export const ClearButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.gray[700]};
  background-color: ${colors.background.main};
  border: 1px solid ${colors.gray[300]};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.background.dark};
    border-color: ${colors.gray[400]};
  }
`

export const Footer = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${colors.gray[200]};
`

export const Note = styled.p`
  font-size: 0.75rem;
  color: ${colors.gray[600]};
  margin: 0;
  line-height: 1.6;

  strong {
    color: ${colors.gray[800]};
  }
`
