/*
  Profile page client layout composed from profile subcomponents.
*/
"use client"

import { Navigation } from "@/components/navigation"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { SubscriptionSection } from "@/components/profile/SubscriptionSection"
import { AccountActions } from "@/components/profile/AccountActions"

interface ProfileClientProps {
  user: {
    id: string
    email?: string
  }
}

export function ProfileClient({ user }: ProfileClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(129,140,248,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_80%_10%,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="container relative mx-auto px-6 py-12">
          <div className="mx-auto max-w-4xl space-y-8">
            <ProfileHeader user={user} />
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <SubscriptionSection />
              <AccountActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
