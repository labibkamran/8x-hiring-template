/*
  Pricing cancellation API that switches the user to the free plan.
*/
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const server = await createClient()
    const { data: userRes } = await server.auth.getUser()
    const userId = userRes?.user?.id ?? null

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: freePlan, error: planError } = await admin
      .from("plans")
      .select("id")
      .eq("slug", "free")
      .eq("is_active", true)
      .limit(1)
      .single()

    if (planError || !freePlan?.id) {
      return NextResponse.json({ error: "Free plan not found" }, { status: 500 })
    }

    const { error: updateError } = await admin
      .from("subscriptions")
      .update({ plan_id: freePlan.id, status: "active" })
      .eq("user_id", userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
