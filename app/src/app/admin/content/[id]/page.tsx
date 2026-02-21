import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { ContentForm } from '../ContentForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditContentPage({ params }: Props) {
  const { id } = await params
  if (id === 'new') {
    return <ContentForm />
  }

  const supabase = createServiceClient()
  const { data } = await supabase.from('comm_content_items').select('*').eq('id', id).single()
  if (!data) notFound()

  return <ContentForm item={data} />
}
