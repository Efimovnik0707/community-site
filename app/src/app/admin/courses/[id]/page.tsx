import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { CourseEditor } from '../CourseEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params
  if (id === 'new') return null // handled by /new route

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_courses')
    .select(`
      *,
      comm_course_modules (
        id, title, sort_order,
        comm_lessons (id, title, slug, sort_order, published, youtube_id, loom_id, duration)
      )
    `)
    .eq('id', id)
    .single()

  if (!data) notFound()
  return <CourseEditor course={data} />
}
