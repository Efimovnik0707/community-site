import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { CourseForm } from '../../CourseForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CourseSettingsPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data } = await supabase.from('comm_courses').select('*').eq('id', id).single()
  if (!data) notFound()
  return <CourseForm course={data} />
}
