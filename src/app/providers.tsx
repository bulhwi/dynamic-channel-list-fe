/**
 * App Providers
 *
 * Initializes MSW and React Query for the application
 */

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, type ReactNode } from 'react'

/**
 * Initialize MSW in development mode
 */
const initMocks = async () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    initMocks().then(() => {
      setMswReady(true)
    })
  }, [])

  // Wait for MSW to be ready in development
  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return null
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
