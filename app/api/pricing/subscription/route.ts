// this file gets the current user's subscription info

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: Request) {
  try {
    const server = await createClient()
    const { data: userRes } = await server.auth.getUser()
    const userId = userRes?.user?.id ?? null

    if (!userId) return NextResponse.json({ subscription: null })

    const admin = createAdminClient()
    const { data: subs, error } = await admin
      .from('subscriptions')
      .select('plan_id,status')
      .eq('user_id', userId)
      .limit(1)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (!subs || subs.length === 0) return NextResponse.json({ subscription: null })

    const sub = subs[0]
    if (sub.status !== 'active') return NextResponse.json({ subscription: null })

    return NextResponse.json({ subscription: { plan_id: sub.plan_id } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
