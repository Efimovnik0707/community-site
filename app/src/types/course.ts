export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  cover_url: string | null
  is_premium: boolean
  status: 'active' | 'coming_soon'
  sort_order: number
  published: boolean
  created_at: string
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  sort_order: number
}

export interface AttachedFile {
  url: string
  name: string
  size: number
}

export interface Lesson {
  id: string
  module_id: string
  slug: string
  title: string
  youtube_id: string | null
  loom_id: string | null
  content: string | null
  duration: number | null
  sort_order: number
  published: boolean
  is_free: boolean
  attachments: AttachedFile[]
}

export interface LessonProgress {
  lesson_id: string
  completed: boolean
}
