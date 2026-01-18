/*
  Profile header with user identity and summary.
*/
import React from "react"
import { Card } from "@/components/ui/card"

interface ProfileHeaderProps {
  user: {
    id: string
    email: string
  }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Your Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </Card>
  )
}
