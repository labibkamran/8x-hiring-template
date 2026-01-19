/*
  Preview panel for the video generation view with multiple UI states.
*/
"use client"

import { Video } from "lucide-react"
import { Card } from "@/components/ui/card"

type PreviewPanelProps = {
  isRestricted: boolean
  onUpgrade: () => void
}

function RestrictedState({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <Card className="relative min-h-[460px] border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">Preview</div>
        <div className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
          Restricted
        </div>
      </div>

      <div className="mt-6 flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/40">
        <div className="text-center">
          <Video className="mx-auto h-10 w-10 text-primary" />
          <div className="mt-4 text-lg font-semibold text-foreground">Upgrade to generate with these settings</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Selected model or quality requires a higher plan. Upgrade to continue.
          </div>
          <button
            onClick={onUpgrade}
            className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </Card>
  )
}

function PreviewState() {
  return (
    <div>
      <Card className="relative min-h-[460px] border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">Preview</div>
          <div className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            Rendering
          </div>
        </div>

        <div className="mt-6 flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/40">
          <div className="text-center">
            <Video className="mx-auto h-10 w-10 text-primary" />
            <div className="mt-4 text-lg font-semibold text-foreground">Generating masterpiece...</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Veo 3.1 is weaving your prompt into cinematic reality.
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>42% complete</span>
          <span>ETA: 74s</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-background/60">
          <div className="h-2 w-[42%] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}

export function PreviewPanel({ isRestricted, onUpgrade }: PreviewPanelProps) {
  return isRestricted ? <RestrictedState onUpgrade={onUpgrade} /> : <PreviewState />
}
