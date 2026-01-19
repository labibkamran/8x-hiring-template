/*
  Generation history UI with filters and card grid.
*/
"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Image as ImageIcon, Sparkles, Video, Trash2 } from "lucide-react"

const historyItems = [
  {
    id: "VID-90218",
    type: "video",
    title: "Hyper-realistic drone shot of Icelandic mountains at golden hour.",
    credits: 12,
  },
  {
    id: "IMG-44231",
    type: "image",
    title: "Cyberpunk city street, neon pink and blue lighting, rainy night.",
    credits: 1,
  },
  {
    id: "VID-90255",
    type: "video",
    title: "Abstract liquid gold flow, macro cinematography, 120fps slow motion.",
    credits: 12,
  },
  {
    id: "IMG-44199",
    type: "image",
    title: "Abstract vibrant gradient waves, colorful fluid motion, organic shapes.",
    credits: 1,
  },
  {
    id: "IMG-44312",
    type: "image",
    title: "Close up shot of a biological computer chip, neural pathways, dark lab.",
    credits: 3,
  },
  {
    id: "VID-90299",
    type: "video",
    title: "First person walk through an enchanted forest, sunrays through fog.",
    credits: 12,
  },
  {
    id: "IMG-46335",
    type: "image",
    title: "Minimalist black geometry on white background, sharp edges.",
    credits: 1,
  },
  {
    id: "IMG-44404",
    type: "image",
    title: "Mystical library with floating glowing books, particles in the air.",
    credits: 3,
  },
]

export function HistoryClient() {
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
            <Button variant="outline" className="rounded-full text-muted-foreground">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear history
            </Button>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search prompts or IDs..."
                className="w-full lg:w-72 rounded-full bg-background/60"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {historyItems.map((item) => (
              <Card key={item.id} className="border-border/60 bg-card/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-2 py-1">
                    {item.type === "video" ? (
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
                    {item.credits} credits
                  </span>
                </div>

                <div className="mt-4 h-32 rounded-xl bg-background/40" />

                <div className="mt-4 text-sm text-foreground line-clamp-3">{item.title}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.id}</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Ready
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button variant="outline" className="rounded-full">
              Load more history
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
