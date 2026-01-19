"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"

export type Tier = "free" | "basic" | "pro" | "enterprise"

export type Subscription = {
  plan_id: string
  plan_slug: Tier
}

type SubscriptionContextType = {
  subscription: Subscription | null
  isLoading: boolean
  isPro: boolean
  tier: Tier
  credits: number | null
  upgradeToPro: () => Promise<void>
  downgradeToFree: () => Promise<void>
  refresh: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isLoading: true,
  isPro: false,
  tier: "free",
  credits: null,
  upgradeToPro: async () => {},
  downgradeToFree: async () => {},
  refresh: async () => {},
})

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [credits, setCredits] = useState<number | null>(null)

  const fetchSubscription = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setSubscription(null)
        setIsLoading(false)
        return
      }

      const plansRes = await fetch("/api/pricing/plans", { cache: "no-store" })
      const plansJson = await plansRes.json()
      if (!plansRes.ok) throw new Error(plansJson?.error || "Failed to load plans")

      const subRes = await fetch("/api/pricing/subscription", { cache: "no-store" })
      const subJson = await subRes.json()
      if (!subRes.ok) throw new Error(subJson?.error || "Failed to load subscription")

      const dashboardRes = await fetch("/api/profile/dashboard", { cache: "no-store" })
      const dashboardJson = await dashboardRes.json()
      if (!dashboardRes.ok) throw new Error(dashboardJson?.error || "Failed to load dashboard")

      const planId = subJson?.subscription?.plan_id ?? null
      if (!planId) {
        setSubscription(null)
        setCredits(dashboardJson?.dashboard?.credits_balance ?? null)
        setIsLoading(false)
        return
      }

      const foundPlan = (plansJson?.plans ?? []).find((p: any) => p.id === planId)
      const planSlug = (foundPlan?.slug ?? "free") as Tier
      setSubscription({ plan_id: planId, plan_slug: planSlug })
      setCredits(dashboardJson?.dashboard?.credits_balance ?? null)

      setIsLoading(false)
    } catch (error) {
      console.error("[SubscriptionContext] Fetch error:", error)
      setSubscription(null)
      setCredits(null)
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await fetchSubscription()
  }, [fetchSubscription])

  const upgradeToPro = useCallback(async () => {
    const res = await fetch("/api/pricing/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_slug: "pro" }),
    })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json?.error || "Upgrade failed")
    }
    await refresh()
  }, [refresh])

  const downgradeToFree = useCallback(async () => {
    const res = await fetch("/api/pricing/cancel", { method: "POST" })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json?.error || "Cancel failed")
    }
    await refresh()
  }, [refresh])

  useEffect(() => {
    fetchSubscription()

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchSubscription()
        } else {
          setSubscription(null)
          setIsLoading(false)
        }
      }
    )

    return () => {
      authSubscription.unsubscribe()
    }
  }, [fetchSubscription])

  // Compute derived values
  const tier = subscription?.plan_slug ?? "free"
  const isPro = tier !== "free"

  return (
    <SubscriptionContext.Provider value={{ subscription, isLoading, isPro, tier, credits, upgradeToPro, downgradeToFree, refresh }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
