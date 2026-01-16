/**
 * Gallery Section Component
 * 
 * Displays example AI-generated videos in a masonry-style grid layout.
 * Videos are loaded from public/example-videos directory.
 */

"use client"

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

function GalleryCard({ item }: { item: GalleryItem }) {
  const aspectClasses = {
    portrait: "row-span-2",
    landscape: "col-span-2",
    square: "",
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-surface border border-border/50 ${aspectClasses[item.aspectRatio]}`}
    >
      <video
        src={item.src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          minHeight: item.aspectRatio === "portrait" ? "400px" : "200px",
        }}
      />
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
