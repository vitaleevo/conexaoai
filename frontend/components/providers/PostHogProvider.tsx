'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (key && host && typeof window !== 'undefined') {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false // We can handle this manually or let posthog do it
      })
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
