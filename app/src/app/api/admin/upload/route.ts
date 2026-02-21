import { NextRequest, NextResponse } from 'next/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const user = await getUnifiedUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'bin'
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${Date.now()}_${safeName}`

  const supabase = createServiceClient()
  const { error } = await supabase.storage
    .from('comm-files')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('comm-files').getPublicUrl(path)

  return NextResponse.json({
    url: urlData.publicUrl,
    name: file.name,
    size: file.size,
  })
}
