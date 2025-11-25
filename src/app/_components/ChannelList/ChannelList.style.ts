/**
 * ChannelList 스타일
 */

import styled from 'styled-components'
import { colors, Card, mixins } from '@/_styles/common.style'

export const StyledChannelList = styled(Card)`
  ${mixins.flexColumn}
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  max-height: calc(60px * 10);
  overflow-y: auto;
  overflow-x: hidden;
  ${mixins.scrollbar}
`

export const Loading = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${colors.gray[500]};
  font-size: 14px;
`

export const Error = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${colors.error.main};
  font-size: 14px;
  background-color: ${colors.error.light};
`

export const ErrorContainer = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`

export const Empty = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${colors.gray[300]};
  font-size: 14px;
`

export const Sentinel = styled.div`
  height: 1px;
  width: 100%;
  pointer-events: none;
`

export const LoadingMore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: ${colors.background.gray};
  border-top: 1px solid ${colors.gray[200]};
  color: ${colors.gray[500]};
  font-size: 14px;
`
