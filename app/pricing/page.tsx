/*
  Pricing page (server):
  - Renders the client Plans component which fetches plans and subscription details via API routes.
*/
import React from "react"
import Plans from "@/components/pricing/Plans"

export default async function PricingPage() {
  return (
    <main>
      <Plans />
    </main>
  )
}
