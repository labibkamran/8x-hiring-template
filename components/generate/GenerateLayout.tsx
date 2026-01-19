/*
  Shared layout wrapper for generation pages with header and background.
*/
"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

type GenerateLayoutProps = {
  title: string
  subtitle: string
  showHistoryButton?: boolean
  isHistoryLoading?: boolean
  onHistoryClick?: () => void
  children: React.ReactNode
}

export function GenerateLayout({
  title,
  subtitle,
  showHistoryButton = true,
  isHistoryLoading = false,
  onHistoryClick,
  children,
}: GenerateLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_-10%,rgba(129,140,248,0.25),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_90%_20%,rgba(99,102,241,0.2),transparent_60%)]" />
        <div className="container relative mx-auto px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {showHistoryButton ? (
              onHistoryClick ? (
                <Button
                  className="rounded-full border border-border/60 bg-card/60 text-foreground hover:bg-card/80 cursor-pointer"
                  onClick={onHistoryClick}
                  disabled={isHistoryLoading}
                >
                  {isHistoryLoading ? "Loading history..." : "View history"}
                </Button>
              ) : (
                <Link href="/generate/history">
                  <Button className="rounded-full border border-border/60 bg-card/60 text-foreground hover:bg-card/80 cursor-pointer">
                    View history
                  </Button>
                </Link>
              )
            ) : null}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
