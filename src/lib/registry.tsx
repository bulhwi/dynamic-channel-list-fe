/**
 * styled-components SSR Registry
 *
 * Next.js 15 App Router에서 styled-components SSR 지원
 * ServerStyleSheet을 사용하여 서버에서 스타일 수집 및 주입
 * FOUC (Flash of Unstyled Content) 방지
 * GlobalStyle을 포함하여 전역 스타일도 SSR 지원
 */

'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { GlobalStyle } from '@/_styles/global.style'

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // 한 번만 생성되도록 lazy initialization 사용
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') {
    return (
      <>
        <GlobalStyle />
        {children}
      </>
    )
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <GlobalStyle />
      {children}
    </StyleSheetManager>
  )
}
