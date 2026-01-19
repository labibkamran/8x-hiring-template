/*
  Generate video page with authenticated access and componentized layout.
*/
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GenerateClient } from "@/components/generate/GenerateClient"

export const dynamic = "force-dynamic"

export default async function GeneratePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/generate")
  }

  return <GenerateClient />
}
