import { NextRequest, NextResponse } from 'next/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { createServiceClient } from '@/lib/supabase/server'

// Returns a signed upload URL so the client can upload directly to Supabase Storage,
// bypassing the Vercel 4.5 MB body limit.
export async function POST(req: NextRequest) {
  const user = await getUnifiedUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { fileName, contentType } = await req.json()
  if (!fileName) return NextResponse.json({ error: 'No fileName' }, { status: 400 })

  const safeName = (fileName as string).replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${Date.now()}_${safeName}`

  const supabase = createServiceClient()
  const { data, error } = await supabase.storage
    .from('comm-files')
    .createSignedUploadUrl(path)

  if (error) {
    console.error('Signed URL error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from('comm-files').getPublicUrl(path)

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    publicUrl: urlData.publicUrl,
  })
}
