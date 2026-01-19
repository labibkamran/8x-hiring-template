/*
  Generating preview panel with progress and ETA.
*/
"use client"

import { Card } from "@/components/ui/card"
import { Video } from "lucide-react"

type GeneratingStateProps = {
  progress: number
  etaSeconds: number
}

export function GeneratingState({ progress, etaSeconds }: GeneratingStateProps) {
  return (
    <div>
      <Card className="relative min-h-[460px] border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">Preview</div>
          <div className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">Rendering</div>
        </div>

        <div className="mt-6 flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/40">
          <div className="text-center">
            <Video className="mx-auto h-10 w-10 text-primary" />
            <div className="mt-4 text-lg font-semibold text-foreground">Generating a quality video...</div>
            <div className="mt-2 text-xs text-muted-foreground">
              MVP demo: we simulate a 30-second render. In production this is powered by SSE, webhooks, or polling.
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progress}% complete</span>
          <span>ETA: {etaSeconds}s</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-background/60">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
