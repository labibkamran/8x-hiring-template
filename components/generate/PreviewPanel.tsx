/*
  Preview panel router that renders a specific state component.
*/
"use client"

import { IdleState } from "@/components/generate/PreviewPanels/Idle"
import { RestrictedState } from "@/components/generate/PreviewPanels/Restricted"
import { OutOfCreditsState } from "@/components/generate/PreviewPanels/OurOfCredits"
import { GeneratingState } from "@/components/generate/PreviewPanels/Generating"
import { ReadyState } from "@/components/generate/PreviewPanels/Ready"
import { FailedState } from "@/components/generate/PreviewPanels/failed"

type PreviewPanelProps = {
  state: "idle" | "restricted" | "out_of_credits" | "generating" | "ready" | "failed"
  progress: number
  etaSeconds: number
  videoUrl: string | null
  downloadUrl: string | null
  isFreeTier: boolean
  onUpgrade: () => void
}

export function PreviewPanel({ state, progress, etaSeconds, videoUrl, downloadUrl, isFreeTier, onUpgrade }: PreviewPanelProps) {
  if (state === "out_of_credits") return <OutOfCreditsState isFreeTier={isFreeTier} onUpgrade={onUpgrade} />
  if (state === "restricted") return <RestrictedState onUpgrade={onUpgrade} />
  if (state === "failed") return <FailedState />
  if (state === "generating") return <GeneratingState progress={progress} etaSeconds={etaSeconds} />
  if (state === "ready") {
    return <ReadyState videoUrl={videoUrl} downloadUrl={downloadUrl} isFreeTier={isFreeTier} onUpgrade={onUpgrade} />
  }
  return <IdleState />
}
