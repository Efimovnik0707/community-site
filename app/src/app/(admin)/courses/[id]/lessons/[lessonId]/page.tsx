import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { LessonForm } from './LessonForm'

interface Props {
  params: Promise<{ id: string; lessonId: string }>
  searchParams: Promise<{ module?: string }>
}

export default async function LessonPage({ params, searchParams }: Props) {
  const { id: courseId, lessonId } = await params
  const { module: moduleId } = await searchParams

  if (lessonId === 'new') {
    if (!moduleId) notFound()
    return <LessonForm courseId={courseId} moduleId={moduleId} />
  }

  const supabase = createServiceClient()
  const { data } = await supabase.from('comm_lessons').select('*').eq('id', lessonId).single()
  if (!data) notFound()

  return <LessonForm courseId={courseId} lesson={data} />
}
