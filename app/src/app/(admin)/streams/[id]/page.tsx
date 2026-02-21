import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { StreamForm } from '../StreamForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditStreamPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data } = await supabase.from('comm_streams').select('*').eq('id', id).single()
  if (!data) notFound()
  return <StreamForm stream={data} />
}
