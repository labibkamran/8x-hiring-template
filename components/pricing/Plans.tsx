"use client"

import React, { useEffect, useMemo, useState } from "react"
import PlanCard from "./PlanCard"
import Faq from "./Faq"
import { useAuth } from "@/contexts/auth-context"

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
  const [plans, setPlans] = useState<Plan[]>([])
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/pricing/plans", { cache: "no-store" })
        const json = await res.json()
        setPlans(json?.plans ?? [])
      } catch {
        setPlans([])
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
        setCurrentPlanId(json?.subscription?.plan_id ?? null)
      } catch {
        setCurrentPlanId(null)
      }
    }

    fetchSubscription()
  }, [authLoading, user])

  const currentPlanSlug = useMemo(() => {
    if (!currentPlanId) return null
    const found = plans.find((p) => p.id === currentPlanId)
    return found?.slug ?? null
  }, [plans, currentPlanId])

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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              isCurrent={currentPlanSlug === p.slug}
              isFeatured={p.slug?.toLowerCase() === "pro" || p.name?.toLowerCase() === "pro"}
            />
          ))}
        </div>

        <Faq />
      </div>
    </section>
  )
}
