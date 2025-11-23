'use client'

import ChannelList from '@/components/ChannelList/ChannelList'
import CreateChannelButton from '@/components/CreateChannelButton/CreateChannelButton'
import { useCreateChannel } from '@/hooks/useCreateChannel'

export default function Home() {
  const { mutate, isPending, error } = useCreateChannel()

  const handleCreateChannel = () => {
    mutate()
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dynamic Channel List</h1>
        <p className="text-gray-600 mb-8">
          Sendbird UIKit implementation with dynamic channel list features
        </p>

        <div className="mb-4">
          <CreateChannelButton
            onClick={handleCreateChannel}
            isLoading={isPending}
            error={error?.message}
          />
        </div>

        <ChannelList />
      </div>
    </main>
  )
}
