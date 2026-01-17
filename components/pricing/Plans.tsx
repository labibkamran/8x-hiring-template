"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import PlanCard from "./PlanCard"
import Faq from "./Faq"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Plan = {
  id: string
  name: string
  slug: string
  price_monthly: string | number
  credits_per_month: number
  bonus_credits_on_signup: number
  cost_per_video?: number
}

export default function Plans() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
  const [isPlansLoading, setIsPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState<string | null>(null)
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/pricing/plans", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load plans")
        }
        setPlans(json?.plans ?? [])
        setPlansError(null)
      } catch {
        setPlans([])
        setPlansError("Unable to load plans right now.")
        toast.error("Failed to load pricing plans.")
      } finally {
        setIsPlansLoading(false)
      }
    }

    fetchPlans()
  }, [])

  useEffect(() => {
    const fetchSubscription = async () => {
      if (authLoading) return
      if (!user) {
        setCurrentPlanId(null)
        return
      }

      try {
        const res = await fetch("/api/pricing/subscription", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load subscription")
        }
        setCurrentPlanId(json?.subscription?.plan_id ?? null)
      } catch {
        setCurrentPlanId(null)
        toast.error("Failed to load subscription.")
      }
    }

    fetchSubscription()
  }, [authLoading, user])

  const currentPlanSlug = useMemo(() => {
    if (!currentPlanId) return null
    const found = plans.find((p) => p.id === currentPlanId)
    return found?.slug ?? null
  }, [plans, currentPlanId])

  const handleAction = useCallback(
    (plan: Plan) => {
      if (!user) {
        router.push("/auth/login?next=/pricing")
        return
      }
      router.push(`/pricing/confirm?plan=${encodeURIComponent(plan.slug)}`)
    },
    [router, user]
  )

  const getActionLabel = useCallback(
    (plan: Plan) => {
      if (authLoading) return null
      if (plan.slug?.toLowerCase() === "free") return null
      if (currentPlanSlug === plan.slug) return "Renew"
      return "Subscribe"
    },
    [authLoading, currentPlanSlug]
  )

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_0%,rgba(129,140,248,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_80%_20%,rgba(99,102,241,0.18),transparent_60%)]" />
      <div className="container relative mx-auto px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">Choose your creative power</h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            Unlock advanced AI models and higher generation limits with our flexible plans. No hidden fees.
          </p>
        </div>

        {isPlansLoading ? (
          <div className="mt-12 text-center text-sm text-muted-foreground">Loading plans...</div>
        ) : plansError ? (
          <div className="mt-12 text-center text-sm text-muted-foreground">{plansError}</div>
        ) : plans.length === 0 ? (
          <div className="mt-12 text-center text-sm text-muted-foreground">No plans available right now.</div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                isCurrent={currentPlanSlug === p.slug}
                isFeatured={p.slug?.toLowerCase() === "pro" || p.name?.toLowerCase() === "pro"}
                actionLabel={getActionLabel(p)}
                onAction={handleAction}
              />
            ))}
          </div>
        )}

        <Faq />
      </div>
    </section>
  )
}
