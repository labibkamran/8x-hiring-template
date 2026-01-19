/*
  Single generation API for retrieving a generation by id via safe view.
*/
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: routeId } = await context.params
    const urlId = req.url ? req.url.split("/").pop() : undefined
    const id = routeId ?? urlId
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    }

    const server = await createClient()
    const { data: userRes } = await server.auth.getUser()
    const userId = userRes?.user?.id ?? null

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await server
      .from("generations_safe")
      .select("id, tool_type, prompt, model, aspect_ratio, quality, status, preview_url, result_url, created_at, completed_at")
      .eq("id", id)
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ generation: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
