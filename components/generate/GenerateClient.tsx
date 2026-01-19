/*
  Video generation UI layout with controls and preview area.
*/
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { PreviewPanel } from "@/components/generate/PreviewPanel"
import { GenerateLayout } from "@/components/generate/GenerateLayout"
import { GenerateControls } from "@/components/generate/GenerateControls"

export function GenerateClient() {
  const { tier, credits, refresh } = useSubscription()
  const [model, setModel] = useState<"veo" | "sora">("veo")
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("9:16")
  const [quality, setQuality] = useState<"1080" | "720" | "480">("480")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isFreeTier = tier === "free"
  const isRestrictedSelection = isFreeTier && (model === "sora" || aspectRatio === "16:9" || quality === "1080")
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const generationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const generationStartRef = useRef<number | null>(null)

  const isOutOfCredits = credits !== null && credits < 30

  const previewState = useMemo(() => {
    if (isReady) return "ready"
    if (isOutOfCredits) return "out_of_credits"
    if (isRestrictedSelection) return "restricted"
    if (isGenerating) return "generating"
    if (videoUrl) return "ready"
    return "idle"
  }, [isGenerating, isOutOfCredits, isRestrictedSelection, isReady, videoUrl])

  const etaSeconds = Math.max(0, Math.round((100 - progress) * 0.3))

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
      if (generationTimerRef.current) {
        clearTimeout(generationTimerRef.current)
      }
    }
  }, [])

  const isCreditsLoading = credits === null

  useEffect(() => {
    if (!isReady || !generationId) return
    router.push(`/generate/${generationId}`)
  }, [generationId, isReady, router])

  const handleGenerate = async () => {
    if (!prompt.trim() || isRestrictedSelection || isOutOfCredits || isGenerating) return
    setIsGenerating(true)
    setIsReady(false)
    setProgress(0)
    setVideoUrl(null)
    setDownloadUrl(null)
    setGenerationId(null)
    generationStartRef.current = Date.now()

    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
    }
    if (generationTimerRef.current) {
      clearTimeout(generationTimerRef.current)
    }

    progressTimerRef.current = setInterval(() => {
      if (!generationStartRef.current) return
      const elapsed = Date.now() - generationStartRef.current
      const nextProgress = Math.min(100, Math.round((elapsed / 30000) * 100))
      setProgress(nextProgress)
      if (nextProgress >= 100) {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current)
        }
      }
    }, 500)

    generationTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/generations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            model,
            aspect_ratio: aspectRatio,
            quality,
            required_credits: 30,
          }),
        })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json?.error || "Failed to generate")
        }

        const id = json?.generation_id as string | undefined
        if (id) {
          setGenerationId(id)
          setIsReady(true)
        }
        setIsGenerating(false)
        await refresh()
      } catch {
        setIsGenerating(false)
      }
    }, 30000)
  }

  return (
    <GenerateLayout
      title="Generate Video"
      subtitle="Craft cinematic clips with the latest models and creative controls."
      showHistoryButton
      isHistoryLoading={isPending}
      onHistoryClick={() => startTransition(() => router.push("/generate/history"))}
    >
      <GenerateControls
        model={model}
        aspectRatio={aspectRatio}
        quality={quality}
        prompt={prompt}
        onModelChange={setModel}
        onAspectRatioChange={setAspectRatio}
        onQualityChange={setQuality}
        onPromptChange={setPrompt}
        onGenerate={handleGenerate}
        isGenerateDisabled={!prompt.trim() || isRestrictedSelection || isOutOfCredits || isGenerating || isCreditsLoading}
        isGenerating={isGenerating}
      />
      <PreviewPanel
        state={previewState}
        progress={progress}
        etaSeconds={etaSeconds}
        videoUrl={videoUrl}
        downloadUrl={downloadUrl}
        isFreeTier={isFreeTier}
        onUpgrade={() => router.push("/pricing")}
      />
    </GenerateLayout>
  )
}
