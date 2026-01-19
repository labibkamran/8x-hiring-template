/*
  Generations API to create and list user generations via secure DB functions.
*/
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const server = await createClient()
    const { data: userRes } = await server.auth.getUser()
    const userId = userRes?.user?.id ?? null

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await server
      .from("generations_safe")
      .select("id, tool_type, prompt, model, aspect_ratio, quality, status, preview_url, result_url, created_at, completed_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ generations: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const server = await createClient()
    const { data: userRes } = await server.auth.getUser()
    const userId = userRes?.user?.id ?? null

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const prompt = typeof body?.prompt === "string" ? body.prompt : null
    const model = typeof body?.model === "string" ? body.model : null
    const aspect_ratio = typeof body?.aspect_ratio === "string" ? body.aspect_ratio : null
    const quality = typeof body?.quality === "string" ? body.quality : null
    const required_credits = typeof body?.required_credits === "number" ? body.required_credits : null

    if (!model || !aspect_ratio || !quality || !required_credits) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const { data, error } = await server.rpc("create_generation", {
      in_tool_type: "video",
      in_prompt: prompt,
      in_model: model,
      in_aspect_ratio: aspect_ratio,
      in_quality: quality,
      in_required_credits: required_credits,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ generation_id: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
