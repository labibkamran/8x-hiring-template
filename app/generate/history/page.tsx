/*
  Generation history page with authenticated access and componentized layout.
*/
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { HistoryClient } from "@/components/generate/history/HistoryClient"

export const dynamic = "force-dynamic"

export default async function GenerationHistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?next=/generate/history")
  }

  return <HistoryClient />
}
