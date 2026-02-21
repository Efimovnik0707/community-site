import { NextRequest, NextResponse } from 'next/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { createServiceClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const user = await getUnifiedUser()
  if (!user || user.role !== 'admin') return null
  return user
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('comm_course_modules').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
