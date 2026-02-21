'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  lessonId: string
  isCompleted: boolean
}

export function LessonCheckbox({ lessonId, isCompleted: initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      const res = await fetch('/api/lessons/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, completed: !completed }),
      })
      if (res.ok) {
        setCompleted(!completed)
        router.refresh()
      }
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={completed ? 'Отметить как непройденное' : 'Отметить пройденным'}
      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
        isPending
          ? 'opacity-50 cursor-wait'
          : completed
          ? 'border-primary bg-primary hover:bg-primary/80 hover:border-primary/80'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {completed && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}
