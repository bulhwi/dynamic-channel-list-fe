/**
 * Home 페이지 (Server Component)
 *
 * SSR 최적화:
 * - Server Component로 정적 콘텐츠 렌더링
 * - Interactive 부분만 Client Component로 분리
 * - 초기 HTML에 콘텐츠 포함 (SEO, 빠른 FCP)
 */

import ChannelList from '@/app/_components/ChannelList/ChannelList'
import ChannelActions from '@/app/_components/ChannelActions/ChannelActions'
import PageLayout from '@/app/_components/PageLayout/PageLayout'

export default function Home() {
  return (
    <PageLayout title="Dynamic Channel List" actions={<ChannelActions />}>
      <ChannelList />
    </PageLayout>
  )
}
