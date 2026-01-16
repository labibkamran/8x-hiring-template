/**
 * Footer Component
 * 
 * Simple footer with branding, product links, and legal links.
 * Consistent with the navigation menu items.
 */

"use client"

import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-background mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <Link href="/" className="font-semibold text-lg">
              <span className="text-foreground">Genify</span>
              <span className="text-primary">.ai</span>
            </Link>
            <span className="text-sm text-muted-foreground">
              © {currentYear} Genify.ai
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/generate"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Generate Video
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
