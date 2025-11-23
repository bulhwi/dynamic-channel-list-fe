/**
 * ChannelList 컨텍스트
 *
 * 채널 리스트 UI 상태(호버 상태)를 관리하는 Context API
 */

'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface ChannelListContextValue {
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}

const ChannelListContext = createContext<ChannelListContextValue | undefined>(undefined)

interface ChannelListProviderProps {
  children: ReactNode
}

export const ChannelListProvider = ({ children }: ChannelListProviderProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <ChannelListContext.Provider value={{ hoveredIndex, setHoveredIndex }}>
      {children}
    </ChannelListContext.Provider>
  )
}

export const useChannelListContext = () => {
  const context = useContext(ChannelListContext)
  if (!context) {
    throw new Error('useChannelListContext must be used within ChannelListProvider')
  }
  return context
}
