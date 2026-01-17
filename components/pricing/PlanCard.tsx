"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Plan = {
  id: string
  name: string
  slug: string
  price_monthly: string | number
  credits_per_month: number
  bonus_credits_on_signup: number
  cost_per_video?: number
  display_order?: number
}

export default function PlanCard({
  plan,
  isCurrent = false,
  isFeatured = false,
  onSubscribe,
}: {
  plan: Plan
  isCurrent?: boolean
  isFeatured?: boolean
  onSubscribe?: (plan: Plan) => void
}) {
  return (
    <Card
      className={cn(
        "relative w-full max-w-xs border border-border/60 bg-card/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)] backdrop-blur",
        isFeatured && "scale-[1.02] border-primary/60 shadow-[0_25px_65px_rgba(99,102,241,0.35)]",
        isCurrent && "ring-2 ring-primary/50"
      )}
    >
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-warning to-info px-3 py-1 text-xs font-semibold text-warning-foreground">
          Most popular
        </div>
      )}
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <CardDescription className="mt-2">
              <span className="text-3xl font-semibold text-foreground">${plan.price_monthly}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </CardDescription>
          </div>
          {isCurrent && (
            <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Current</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {plan.credits_per_month} credits per month
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Signup bonus: {plan.bonus_credits_on_signup} credits
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Cost / video: {plan.cost_per_video ?? "—"} credits
          </li>
        </ul>
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isCurrent}
          onClick={() => onSubscribe?.(plan)}
        >
          {isCurrent ? "Manage" : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  )
}
