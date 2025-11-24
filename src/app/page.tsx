'use client'

import ChannelList from '@/app/_components/ChannelList/ChannelList'
import CreateChannelButton from '@/app/_components/CreateChannelButton/CreateChannelButton'
import { useCreateChannel } from '@/_hooks/useCreateChannel'
import * as S from './page.style'

export default function Home() {
  const { mutate, isPending, error, reset } = useCreateChannel()

  const handleCreateChannel = () => {
    mutate()
  }

  const handleRetry = () => {
    reset() // 에러 상태 리셋
    mutate() // 재시도
  }

  return (
    <S.Main>
      <S.StyledContainer>
        <S.Title>Dynamic Channel List</S.Title>
        <S.Description>
          Sendbird UIKit implementation with dynamic channel list features
        </S.Description>

        <S.ButtonContainer>
          <CreateChannelButton
            onClick={handleCreateChannel}
            isLoading={isPending}
            error={error?.message}
            onRetry={error ? handleRetry : undefined}
          />
        </S.ButtonContainer>

        <ChannelList />
      </S.StyledContainer>
    </S.Main>
  )
}
