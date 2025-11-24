import type { Metadata } from 'next'
import StyledComponentsRegistry from '@/lib/registry'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dynamic Channel List',
  description: 'Sendbird UIKit implementation with dynamic channel list features',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
