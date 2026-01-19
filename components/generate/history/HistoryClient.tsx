/*
  Generation history UI with filters and card grid.
*/
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Image as ImageIcon, Sparkles, Video } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type GenerationItem = {
  id: string
  tool_type: string
  prompt: string | null
  status: string
  preview_url: string | null
}

export function HistoryClient() {
  const [generations, setGenerations] = useState<GenerationItem[]>([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGenerations = async () => {
      try {
        const res = await fetch("/api/generations", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load history")
        }
        setGenerations(json?.generations ?? [])
      } finally {
        setIsLoading(false)
      }
    }

    loadGenerations()
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return generations
    const lower = query.toLowerCase()
    return generations.filter((item) => {
      return (
        item.id.toLowerCase().includes(lower) ||
        (item.prompt ?? "").toLowerCase().includes(lower)
      )
    })
  }, [generations, query])

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_-10%,rgba(129,140,248,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_90%_20%,rgba(99,102,241,0.2),transparent_60%)]" />
        <div className="container relative mx-auto px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Generation History</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage and refine your past AI-generated assets.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search prompts or IDs..."
                className="w-full lg:w-72 rounded-full bg-background/60"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {isLoading ? (
              <Card className="border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
                <div className="text-sm text-muted-foreground">Loading history...</div>
              </Card>
            ) : filtered.length === 0 ? (
              <Card className="border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
                <div className="text-sm text-muted-foreground">No generations found.</div>
              </Card>
            ) : (
              filtered.map((item) => (
                <Link key={item.id} href={`/generate/${item.id}`} className="block">
                  <Card className="border-border/60 bg-card/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)] transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-2 py-1">
                        {item.tool_type === "video" ? (
                          <>
                            <Video className="h-3.5 w-3.5 text-primary" />
                            Video gen
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-3.5 w-3.5 text-primary" />
                            Image gen
                          </>
                        )}
                      </div>
                      <span className="rounded-full bg-accent px-2 py-1 text-[10px] text-accent-foreground">
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 h-32 rounded-xl bg-background/40 overflow-hidden">
                      {item.preview_url ? (
                        <video src={item.preview_url} muted className="h-full w-full object-cover" />
                      ) : null}
                    </div>

                    <div className="mt-4 text-sm text-foreground line-clamp-3">{item.prompt || "No prompt provided."}</div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.id}</span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Ready
                      </span>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
