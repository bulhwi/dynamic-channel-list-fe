import type { NextConfig } from 'next'

/**
 * 환경 변수 검증
 * - 빌드 타임에 필수 환경 변수 검증
 * - 명확한 에러 메시지로 빠른 실패
 */
const validateEnvironmentVariables = () => {
  // 테스트 환경에서는 검증 스킵
  if (process.env.NODE_ENV === 'test') {
    return
  }

  // MSW 모드가 활성화된 경우 Sendbird 환경 변수는 선택 사항
  const useMsw = process.env.NEXT_PUBLIC_USE_MSW === 'true'

  if (!useMsw) {
    const requiredEnvVars = [
      {
        key: 'NEXT_PUBLIC_SENDBIRD_APP_ID',
        description: 'Sendbird App ID (from https://dashboard.sendbird.com/)',
      },
    ]

    const missingEnvVars = requiredEnvVars.filter(({ key }) => !process.env[key])

    if (missingEnvVars.length > 0) {
      const errorMessage = [
        '❌ Missing required environment variables:',
        '',
        ...missingEnvVars.map(({ key, description }) => `  - ${key}: ${description}`),
        '',
        '💡 Please create a .env.local file based on .env.local.example',
        '   Or set NEXT_PUBLIC_USE_MSW=true to use Mock Service Worker for development',
      ].join('\n')

      throw new Error(errorMessage)
    }
  }
}

// 빌드 타임에 환경 변수 검증 실행
validateEnvironmentVariables()

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // styled-components SSR support
  compiler: {
    styledComponents: true,
  },

  // Experimental features for Next.js 15
  experimental: {
    // Enable if needed in the future
  },
}

export default nextConfig
