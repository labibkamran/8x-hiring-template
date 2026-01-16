/**
 * Gallery Section Component
 * 
 * Displays example AI-generated videos in a masonry-style grid layout.
 * Videos are loaded from public/example-videos directory with lazy loading
 * and skeleton states for better performance.
 */

"use client"

import { useState, useRef, useEffect } from "react"

interface GalleryItem {
  id: number
  src: string
  aspectRatio: "portrait" | "landscape" | "square"
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, src: "/example-videos/vhs-fisheye.mp4", aspectRatio: "portrait" },
  { id: 2, src: "/example-videos/running-man.mp4", aspectRatio: "square" },
  { id: 3, src: "/example-videos/timelapse-people.mp4", aspectRatio: "square" },
  { id: 4, src: "/example-videos/couple-cafe.mp4", aspectRatio: "portrait" },
  { id: 5, src: "/example-videos/bgvideo.mp4", aspectRatio: "portrait" },
  { id: 6, src: "/example-videos/vintage-woman.mp4", aspectRatio: "portrait" },
  { id: 7, src: "/example-videos/girl-porsche.mp4", aspectRatio: "square" },
  { id: 8, src: "/example-videos/80s-man.mp4", aspectRatio: "square" },
]

function VideoSkeleton({ aspectRatio }: { aspectRatio: string }) {
  return (
    <div 
      className="absolute inset-0 bg-surface animate-pulse flex items-center justify-center"
      style={{ minHeight: aspectRatio === "portrait" ? "400px" : "200px" }}
    >
      <div className="w-12 h-12 rounded-full bg-border/50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
      </div>
    </div>
  )
}

function GalleryCard({ item }: { item: GalleryItem }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const aspectClasses = {
    portrait: "row-span-2",
    landscape: "col-span-2",
    square: "",
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isInView, isLoaded])

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden bg-surface border border-border/50 ${aspectClasses[item.aspectRatio]}`}
      style={{ minHeight: item.aspectRatio === "portrait" ? "400px" : "200px" }}
    >
      {!isLoaded && <VideoSkeleton aspectRatio={item.aspectRatio} />}
      
      {isInView && (
        <video
          ref={videoRef}
          src={item.src}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ minHeight: item.aspectRatio === "portrait" ? "400px" : "200px" }}
        />
      )}
    </div>
  )
}

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Example Gallery</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            See what creators are building with Genify.ai
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {GALLERY_ITEMS.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
