/**
 * Sign Up Page
 * Account registration with email and password
 * Uses client-side Supabase for proper session management
 */
"use client"

import type React from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Mail, Lock, ArrowRight, Gift } from "lucide-react"
import { toast } from "sonner"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorField, setErrorField] = useState<"email" | "password" | "confirmPassword" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [returnUrl, setReturnUrl] = useState<string | null>(null)
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setReturnUrl(params.get("returnUrl"))
    }
  }, [])

  useEffect(() => {
    if (!authLoading && user) {
      const destination = returnUrl || "/"
      router.push(destination)
    }
  }, [user, authLoading, returnUrl, router])

  // Clear error field highlight when user starts typing
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (errorField === "email") {
      setErrorField(null)
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errorField === "password" || errorField === "confirmPassword") {
      setErrorField(null)
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (errorField === "confirmPassword") {
      setErrorField(null)
    }
  }

  const showError = (message: string, field?: "email" | "password" | "confirmPassword") => {
    toast.error(message)
    if (field) setErrorField(field)
    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorField(null)

    const trimmedEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Client-side validation (prevents unnecessary API calls)
    if (!trimmedEmail) {
      showError("Please enter your email address", "email")
      return
    }

    if (!emailRegex.test(trimmedEmail)) {
      showError("Please enter a valid email address", "email")
      return
    }

    if (!password) {
      showError("Please enter a password", "password")
      return
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters", "password")
      return
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match", "confirmPassword")
      return
    }

    try {
      // Use client-side Supabase for proper session management
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      })

      if (signUpError) {
        // Handle specific Supabase errors
        if (signUpError.message.includes("already registered")) {
          showError("This email is already registered. Please sign in instead.", "email")
        } else {
          showError(signUpError.message)
        }
        return
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast.info("Please check your email to confirm your account.")
        setIsLoading(false)
        return
      }

      // Auto sign-in successful - show success toast
      toast.success("Account created successfully!")
      // The auth context will detect the session and redirect
    } catch {
      showError("Unable to connect. Please check your internet connection.")
    }
  }

  // Determine input border color based on error state
  const getInputClassName = (field: "email" | "password" | "confirmPassword") => {
    const baseClass = "pl-12 py-3.5 h-auto bg-secondary rounded-xl transition-colors"
    if (errorField === field) {
      return `${baseClass} border-destructive focus:border-destructive focus-visible:ring-destructive/30`
    }
    return `${baseClass} border-border`
  }

  return (
    <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-[480px]">
        <div className="bg-card border border-primary/20 rounded-xl shadow-2xl p-8 lg:p-10">
          <div className="text-center mb-8">
            <h1 className="text-foreground text-3xl font-bold tracking-tight mb-3">Create your account</h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Start building with the next generation of AI.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  errorField === "email" ? "text-destructive" : "text-muted-foreground"
                }`} />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={getInputClassName("email")}
                  disabled={isLoading}
                  aria-invalid={errorField === "email"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</Label>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Min. 8 characters</span>
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  errorField === "password" ? "text-destructive" : "text-muted-foreground"
                }`} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={getInputClassName("password")}
                  disabled={isLoading}
                  aria-invalid={errorField === "password"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground">Confirm Password</Label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  errorField === "confirmPassword" ? "text-destructive" : "text-muted-foreground"
                }`} />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={getInputClassName("confirmPassword")}
                  disabled={isLoading}
                  aria-invalid={errorField === "confirmPassword"}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full py-4 h-auto rounded-xl shadow-lg shadow-primary/20 font-bold group"
                disabled={isLoading}
              >
                <span>{isLoading ? "Creating account..." : "Create Account"}</span>
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-start gap-3 mt-6">
              <Gift className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-normal">
                <span className="font-bold text-primary italic">Bonus:</span> You'll receive 100 free credits instantly upon registration to explore our models.
              </p>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-border/50 pt-6">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                href={returnUrl ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/auth/login"}
                className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
