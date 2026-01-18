/*
  Subscription card with current plan status and downgrade action.
*/
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, CreditCard, Shield } from "lucide-react"
import Link from "next/link"
import { useSubscription } from "@/contexts/subscription-context"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SubscriptionSection() {
  const { isPro, tier, downgradeToFree } = useSubscription()
  const [isDowngrading, setIsDowngrading] = useState(false)
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false)

  const handleDowngrade = async () => {
    setIsDowngrading(true)
    try {
      await downgradeToFree()
      setShowDowngradeDialog(false)
      toast.success("You've been downgraded to the Free plan.")
    } catch {
      toast.error("Failed to downgrade. Please try again.")
    } finally {
      setIsDowngrading(false)
    }
  }

  return (
    <Card className="border-border/60 bg-card/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      <div className="flex items-center gap-3">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Subscription</h2>
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Current plan</div>
            <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {isPro ? "Pro" : "Free"}
            </div>
          </div>
          <div className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            {isPro ? "Active" : "Free tier"}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" />
          {isPro ? "Priority models and higher limits enabled." : "Upgrade to unlock pro models and higher limits."}
        </div>
      </div>

      {isPro ? (
        <div className="mt-5 flex items-center gap-3">
          <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isDowngrading}>
                Cancel subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  You'll lose access to Pro features immediately. You can upgrade again anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDowngrading}>Keep Pro</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    handleDowngrade()
                  }}
                  disabled={isDowngrading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDowngrading ? "Canceling..." : "Confirm Cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="text-xs text-muted-foreground">Plan: {tier}</div>
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Plan: {tier}</div>
          <Link href="/pricing">
            <Button variant="outline" size="sm">Upgrade to Pro</Button>
          </Link>
        </div>
      )}
    </Card>
  )
}
