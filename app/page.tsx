/**
 * Home Page
 * 
 * Main landing page for Genify.ai featuring hero section with CTA
 * and example gallery showcasing AI-generated video outputs.
 */

import { Navigation } from "@/components/navigation"
import { HeroSection, GallerySection, HowItWorksSection } from "@/components/home"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <HowItWorksSection />
      <GallerySection />
    </div>
  )
}
