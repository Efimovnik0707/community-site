'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Props {
  lessonId: string
  telegramId: number
  isCompleted: boolean
}

export function LessonCompleteButton({ lessonId, isCompleted: initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const toggle = () => {
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
    <Button
      onClick={toggle}
      disabled={isPending}
      variant={completed ? 'secondary' : 'default'}
      size="sm"
      className="min-w-36"
    >
      {isPending ? 'Сохраняем...' : completed ? '✓ Пройдено' : 'Отметить пройденным'}
    </Button>
  )
}
