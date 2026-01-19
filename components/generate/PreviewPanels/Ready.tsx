/*
  Ready preview panel with video and download/upgrade action.
*/
"use client"

import { Card } from "@/components/ui/card"
import { Video } from "lucide-react"
import { useState } from "react"

type ReadyStateProps = {
  videoUrl: string | null
  downloadUrl: string | null
  isFreeTier: boolean
  onUpgrade: () => void
}

export function ReadyState({ videoUrl, downloadUrl, isFreeTier, onUpgrade }: ReadyStateProps) {
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  return (
    <Card className="relative min-h-[460px] border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">Preview</div>
        <div className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">Ready</div>
      </div>

      <div className="mt-6 flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/40 overflow-hidden relative">
        {videoUrl ? (
          <>
            <video
              src={videoUrl}
              controls
              className="h-full w-full rounded-2xl object-cover"
              onLoadStart={() => setIsVideoLoading(true)}
              onLoadedData={() => setIsVideoLoading(false)}
              onError={() => setIsVideoLoading(false)}
            />
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Loading preview...</div>
                  <div className="mt-3 h-2 w-40 rounded-full bg-background/60">
                    <div className="h-2 w-2/3 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      <div className="mt-6">
        {isFreeTier ? (
          <button
            onClick={onUpgrade}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover cursor-pointer"
          >
            Upgrade to download
          </button>
        ) : downloadUrl ? (
          <a
            href={downloadUrl}
            className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Download video
          </a>
        ) : (
          <button
            className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground opacity-60"
            disabled
          >
            Download video
          </button>
        )}
      </div>
    </Card>
  )
}
