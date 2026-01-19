/*
  Pricing subscription API that activates a plan using the authenticated user's session.
*/
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { plan_slug } = await req.json()
    if (!plan_slug || typeof plan_slug !== "string") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const server = await createClient()
    const { data: userRes } = await server.auth.getUser()
    const userId = userRes?.user?.id ?? null

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await server.rpc("upgrade_plan", { target_plan_slug: plan_slug })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
