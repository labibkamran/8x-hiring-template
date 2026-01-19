/*
  Video generation UI layout with controls and preview area.
*/
"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, ShieldCheck, Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { PreviewPanel } from "@/components/generate/PreviewPanel"

export function GenerateClient() {
  const { tier } = useSubscription()
  const [model, setModel] = useState<"veo" | "sora">("veo")
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("9:16")
  const [quality, setQuality] = useState<"1080" | "720" | "480">("480")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isFreeTier = tier === "free"
  const isRestrictedSelection = isFreeTier && (model === "sora" || aspectRatio === "16:9" || quality === "1080")

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_-10%,rgba(129,140,248,0.25),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_90%_20%,rgba(99,102,241,0.2),transparent_60%)]" />
        <div className="container relative mx-auto px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Generate Video</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Craft cinematic clips with the latest models and creative controls.
              </p>
            </div>
            <Button
              className="rounded-full border border-border/60 bg-card/60 text-foreground hover:bg-card/80 cursor-pointer"
              onClick={() => startTransition(() => router.push("/generate/history"))}
              disabled={isPending}
            >
              {isPending ? "Loading history..." : "View history"}
            </Button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
            <Card className="border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
              <div className="space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Video model</div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      className={`cursor-pointer rounded-full ${model === "veo" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                      size="sm"
                      onClick={() => setModel("veo")}
                    >
                      Google Veo 3.1
                    </Button>
                    <Button
                      className={`cursor-pointer rounded-full ${model === "sora" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                      size="sm"
                      onClick={() => setModel("sora")}
                    >
                      OpenAI Sora 2
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Prompt</div>
                  <textarea
                    className="mt-3 h-28 w-full rounded-xl border border-border/60 bg-background/60 p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="A cinematic drone shot of a neon-lit futuristic city, bioluminescent sea life..."
                  />
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Wand2 className="h-3.5 w-3.5 text-primary" />
                    Use clear lighting, subject, and motion cues.
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Aspect ratio</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      className={`cursor-pointer rounded-xl ${aspectRatio === "16:9" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                      onClick={() => setAspectRatio("16:9")}
                    >
                      16:9 Landscape
                    </Button>
                    <Button
                      className={`cursor-pointer rounded-xl ${aspectRatio === "9:16" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                      onClick={() => setAspectRatio("9:16")}
                    >
                      9:16 Portrait
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Quality</div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Button
                        className={`cursor-pointer rounded-lg ${quality === "1080" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                        size="sm"
                        onClick={() => setQuality("1080")}
                      >
                        1080p
                      </Button>
                      <Button
                        className={`cursor-pointer rounded-lg ${quality === "720" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                        size="sm"
                        onClick={() => setQuality("720")}
                      >
                        720p
                      </Button>
                      <Button
                        className={`cursor-pointer rounded-lg ${quality === "480" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                        size="sm"
                        onClick={() => setQuality("480")}
                      >
                        480p
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isRestrictedSelection}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate video
                </Button>
                <div className="text-xs text-muted-foreground">Estimated cost: 30 credits</div>
              </div>
            </Card>

            <PreviewPanel
              isRestricted={isRestrictedSelection}
              onUpgrade={() => router.push("/pricing")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
