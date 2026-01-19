/*
  Failed preview panel when preview URL is unavailable.
*/
"use client"

import { Card } from "@/components/ui/card"
import { Video } from "lucide-react"

export function FailedState() {
  return (
    <Card className="relative min-h-[460px] border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">Preview</div>
        <div className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">Failed</div>
      </div>

      <div className="mt-6 flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/40">
        <div className="text-center">
          <Video className="mx-auto h-10 w-10 text-primary" />
          <div className="mt-4 text-lg font-semibold text-foreground">Failed to load video</div>
          <div className="mt-2 text-xs text-muted-foreground">
            The preview link is missing or unavailable. Please try again later.
          </div>
        </div>
      </div>
    </Card>
  )
}
