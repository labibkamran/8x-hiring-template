/**
 * Hero Section Component
 * 
 * Main landing section for Genify.ai homepage featuring headline,
 * tagline, and call-to-action buttons. Includes animated badge
 * and gradient text effects.
 */

"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, LayoutGrid, ChevronDown } from "lucide-react"

export function HeroSection() {
  const scrollToGallery = () => {
    const gallery = document.getElementById("gallery")
    if (gallery) {
      gallery.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          NEXT-GEN AI MODELS LIVE
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
          Turn Imagination into
          <br />
          <span className="text-primary">Cinematic Reality</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
          The elite creative suite for AI video generation, wardrobe manipulation,
          and actor replacement. High-end storytelling for modern creators.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="px-8 py-6 text-base sm:text-lg gap-2" asChild>
            <Link href="/generate">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-base sm:text-lg gap-2 bg-surface/50 border-border hover:bg-surface"
            onClick={scrollToGallery}
          >
            <LayoutGrid className="w-5 h-5" />
            View Gallery
          </Button>
        </div>
      </div>

      <button 
        onClick={scrollToGallery}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        aria-label="Scroll to gallery"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  )
}
