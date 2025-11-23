/**
 * ChannelList Context
 *
 * Context API for managing channel list UI state (hover state)
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
