/*
  Generation control panel for model, prompt, aspect ratio, quality, and submit.
*/
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, ShieldCheck, Wand2 } from "lucide-react"

type GenerateControlsProps = {
  model: "veo" | "sora"
  aspectRatio: "16:9" | "9:16"
  quality: "1080" | "720" | "480"
  prompt: string
  onModelChange: (value: "veo" | "sora") => void
  onAspectRatioChange: (value: "16:9" | "9:16") => void
  onQualityChange: (value: "1080" | "720" | "480") => void
  onPromptChange: (value: string) => void
  onGenerate?: () => void
  isGenerateDisabled: boolean
  isGenerating: boolean
  showGenerate?: boolean
  disabled?: boolean
}

export function GenerateControls({
  model,
  aspectRatio,
  quality,
  prompt,
  onModelChange,
  onAspectRatioChange,
  onQualityChange,
  onPromptChange,
  onGenerate,
  isGenerateDisabled,
  isGenerating,
  showGenerate = true,
  disabled = false,
}: GenerateControlsProps) {
  return (
    <Card className="border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <div className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Video model</div>
          <div className="mt-3 flex gap-2">
            <Button
              className={`cursor-pointer rounded-full ${model === "veo" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              size="sm"
              onClick={() => onModelChange("veo")}
              disabled={disabled}
            >
              Google Veo 3.1
            </Button>
            <Button
              className={`cursor-pointer rounded-full ${model === "sora" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              size="sm"
              onClick={() => onModelChange("sora")}
              disabled={disabled}
            >
              OpenAI Sora 2
            </Button>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Prompt</div>
          <textarea
            className="mt-3 h-28 w-full rounded-xl border border-border/60 bg-background/60 p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
            placeholder="A cinematic drone shot of a neon-lit futuristic city, bioluminescent sea life..."
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            disabled={disabled}
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
              onClick={() => onAspectRatioChange("16:9")}
              disabled={disabled}
            >
              16:9 Landscape
            </Button>
            <Button
              className={`cursor-pointer rounded-xl ${aspectRatio === "9:16" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              onClick={() => onAspectRatioChange("9:16")}
              disabled={disabled}
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
                onClick={() => onQualityChange("1080")}
                disabled={disabled}
              >
                1080p
              </Button>
              <Button
                className={`cursor-pointer rounded-lg ${quality === "720" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                size="sm"
                onClick={() => onQualityChange("720")}
                disabled={disabled}
              >
                720p
              </Button>
              <Button
                className={`cursor-pointer rounded-lg ${quality === "480" ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                size="sm"
                onClick={() => onQualityChange("480")}
                disabled={disabled}
              >
                480p
              </Button>
            </div>
          </div>
        </div>

        {showGenerate ? (
          <>
            <Button
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isGenerateDisabled || disabled || !onGenerate}
              onClick={onGenerate}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate video"}
            </Button>
            <div className="text-xs text-muted-foreground">Estimated cost: 30 credits</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Credit usage applies after your request is validated.
            </div>
          </>
        ) : null}
      </div>
    </Card>
  )
}
