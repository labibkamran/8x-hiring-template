/**
 * Navigation Component
 * 
 * Main header navigation for Genify application. Handles both mobile and desktop
 * layouts with responsive design. Displays different states based on user
 * authentication status and subscription tier (Free vs Pro).
 * 
 * Nav Items: Generate Video, Pricing, Privacy Policy
 * States: Logged Out (Sign In/Up) | Free (Credits, Upgrade, Avatar) | Pro (Credits, Avatar)
 */

"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Coins, Moon, Sun, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { useTheme } from "@/contexts/theme-context"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()
  const { tier } = useSubscription()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [planName, setPlanName] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAvatarDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setAvatarDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) {
        setCredits(null)
        setPlanName(null)
        return
      }
      try {
        const res = await fetch("/api/profile/dashboard", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load dashboard")
        setCredits(json?.dashboard?.credits_balance ?? 0)
        setPlanName(json?.dashboard?.plan_name ?? null)
      } catch {
        setCredits(null)
        setPlanName(null)
      }
    }

    loadDashboard()
  }, [user, tier])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      setAvatarDropdownOpen(false)
      toast.success("Signed out successfully")
      router.push("/")
    } catch {
      toast.error("Failed to sign out. Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="font-semibold text-xl">
                <span className="text-foreground">Genify</span>
                <span className="text-primary">.ai</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/generate"
                className={`text-sm transition-colors ${
                  pathname === "/generate" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Generate Video
              </Link>
              <Link
                href="/pricing"
                className={`text-sm transition-colors ${
                  pathname === "/pricing" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/privacy"
                className={`text-sm transition-colors ${
                  pathname === "/privacy" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
                      <Coins className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium">
                        {credits === null ? "Credits" : `${credits} Credits`}
                      </span>
                    </div>
                    {tier === "free" ? (
                      <Link href="/pricing">
                        <Button size="sm" className="text-sm">
                          Upgrade
                        </Button>
                      </Link>
                    ) : (
                      <div className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                        {planName ?? tier.toUpperCase()}
                      </div>
                    )}
                    {/* Avatar with dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-expanded={avatarDropdownOpen}
                        aria-haspopup="true"
                      >
                        <span className="text-sm font-medium text-primary-foreground">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </button>
                      
                      {/* Dropdown menu */}
                      {avatarDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface transition-colors"
                            onClick={() => setAvatarDropdownOpen(false)}
                          >
                            <User className="w-4 h-4 text-muted-foreground" />
                            Account
                          </Link>
                          <div className="border-t border-border my-1" />
                          <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          >
                            <LogOut className="w-4 h-4" />
                            {isSigningOut ? "Signing out..." : "Sign out"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm" className="text-sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button size="sm" className="text-sm">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 px-6 py-4 space-y-4">
          <Link
            href="/generate"
            className={`block py-2 transition-colors ${
              pathname === "/generate" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Generate Video
          </Link>
          <Link
            href="/pricing"
            className={`block py-2 transition-colors ${
              pathname === "/pricing" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/privacy"
            className={`block py-2 transition-colors ${
              pathname === "/privacy" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Privacy Policy
          </Link>
          
          <div className="pt-4 border-t border-border/50 space-y-3">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      <Coins className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium">
                        {credits === null ? "Credits" : `${credits} Credits`}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 py-2 text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Account
                    </Link>
                    {tier === "free" ? (
                      <Link
                        href="/pricing"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full">Upgrade</Button>
                      </Link>
                    ) : (
                      <div className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                        {planName ?? tier.toUpperCase()}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleSignOut()
                      }}
                      disabled={isSigningOut}
                      className="flex items-center gap-3 w-full py-2 text-destructive disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4" />
                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
