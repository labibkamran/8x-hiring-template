/*
  Generation detail page with authenticated access.
*/
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GenerationDetailClient } from "@/components/generate/GenerationDetailClient"

export const dynamic = "force-dynamic"

export default async function GenerationDetailPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/generate")
  }

  return <GenerationDetailClient />
}
