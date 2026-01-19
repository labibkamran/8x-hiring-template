/*
  Generation detail view with read-only controls and preview.
*/
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { GenerateLayout } from "@/components/generate/GenerateLayout"
import { GenerateControls } from "@/components/generate/GenerateControls"
import { PreviewPanel } from "@/components/generate/PreviewPanel"
import { useSubscription } from "@/contexts/subscription-context"

type Generation = {
  id: string
  prompt: string | null
  model: "veo" | "sora"
  aspect_ratio: "16:9" | "9:16"
  quality: "1080" | "720" | "480"
  preview_url: string | null
  result_url: string | null
}

export function GenerationDetailClient() {
  const router = useRouter()
  const params = useParams()
  const { tier } = useSubscription()
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGeneration = async () => {
      try {
        const id = typeof params.id === "string" ? params.id : ""
        if (!id) return
        const res = await fetch(`/api/generations/${id}`, { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load generation")
        setGeneration(json?.generation ?? null)
      } finally {
        setIsLoading(false)
      }
    }

    loadGeneration()
  }, [params.id])

  const previewUrl = useMemo(() => {
    if (!generation) return null
    return generation.preview_url ?? generation.result_url ?? null
  }, [generation])

  const previewState = useMemo(() => {
    if (isLoading) return "ready"
    if (previewUrl) return "ready"
    return "failed"
  }, [isLoading, previewUrl])

  const isFreeTier = tier === "free"

  return (
    <GenerateLayout
      title="Generation Details"
      subtitle="Review your generated video and prompt settings."
      showHistoryButton
      onHistoryClick={() => router.push("/generate/history")}
    >
      <GenerateControls
        model={generation?.model ?? "veo"}
        aspectRatio={generation?.aspect_ratio ?? "9:16"}
        quality={generation?.quality ?? "480"}
        prompt={generation?.prompt ?? ""}
        onModelChange={() => {}}
        onAspectRatioChange={() => {}}
        onQualityChange={() => {}}
        onPromptChange={() => {}}
        onGenerate={undefined}
        isGenerateDisabled={true}
        isGenerating={false}
        showGenerate={false}
        disabled
      />
      <PreviewPanel
        state={previewState}
        progress={100}
        etaSeconds={0}
        videoUrl={previewUrl}
        downloadUrl={generation?.result_url ?? null}
        isFreeTier={isFreeTier}
        onUpgrade={() => router.push("/pricing")}
      />
    </GenerateLayout>
  )
}
