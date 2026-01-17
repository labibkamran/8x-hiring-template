/*
  Pricing confirmation page that lets a logged-in user activate a plan via API.
*/
"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

type Plan = {
  id: string
  name: string
  slug: string
  price_monthly: string | number
  credits_per_month: number
  bonus_credits_on_signup: number
  cost_per_video?: number
}

export default function PricingConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const planSlug = searchParams.get("plan") ?? ""

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace(`/auth/login?next=/pricing/confirm?plan=${encodeURIComponent(planSlug)}`)
    }
  }, [authLoading, planSlug, router, user])

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await fetch("/api/pricing/plans", { cache: "no-store" })
        const json = await res.json()
        setPlans(json?.plans ?? [])
      } catch {
        setPlans([])
      }
    }

    loadPlans()
  }, [])

  const selectedPlan = useMemo(() => {
    if (!planSlug) return null
    return plans.find((p) => p.slug === planSlug) ?? null
  }, [planSlug, plans])

  const handleActivate = async () => {
    if (!planSlug) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/pricing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_slug: planSlug }),
      })
      if (res.ok) {
        router.replace("/pricing")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-[70vh] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_50%_0%,rgba(129,140,248,0.25),transparent_55%)]" />
      <div className="container relative mx-auto px-6 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-border/60 bg-card/80 p-8 shadow-[0_20px_55px_rgba(15,23,42,0.45)]">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Confirm your plan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This MVP flow simulates checkout. This will be replaced by real-time Stripe checkout later.
          </p>

          <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="text-sm text-muted-foreground">Selected plan</div>
            <div className="mt-1 text-lg font-semibold text-foreground">{selectedPlan?.name ?? "Unknown plan"}</div>
            {selectedPlan && (
              <div className="mt-2 text-sm text-muted-foreground">
                ${selectedPlan.price_monthly}/mo · {selectedPlan.credits_per_month} credits per month
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
              onClick={handleActivate}
              disabled={isSubmitting || !selectedPlan || !user}
            >
              {isSubmitting ? "Activating..." : "Activate plan"}
            </Button>
            <Button
              className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
              onClick={() => router.push("/pricing")}
              disabled={isSubmitting}
            >
              Back to pricing
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
