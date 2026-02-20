export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  cover_url: string | null
  is_premium: boolean
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

export interface Lesson {
  id: string
  module_id: string
  slug: string
  title: string
  youtube_id: string | null
  content: string | null
  duration: number | null
  sort_order: number
  published: boolean
}

export interface LessonProgress {
  lesson_id: string
  completed: boolean
}
