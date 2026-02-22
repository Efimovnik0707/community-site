'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

export interface AttachedFile {
  url: string
  name: string
  size: number
}

interface FileUploaderProps {
  files: AttachedFile[]
  onChange: (files: AttachedFile[]) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploader({ files, onChange }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(fileList: FileList) {
    setUploading(true)
    setError(null)
    const results: AttachedFile[] = []
    for (const file of Array.from(fileList)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const data = await res.json()
          results.push(data)
        } else {
          const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
          setError(`Ошибка загрузки ${file.name}: ${data.error}`)
        }
      } catch (e) {
        setError(`Ошибка сети при загрузке ${file.name}`)
      }
    }
    if (results.length > 0) onChange([...files, ...results])
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function remove(url: string) {
    onChange(files.filter(f => f.url !== url))
  }

  return (
    <div className="space-y-2">
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map(f => (
            <div key={f.url} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-card text-sm">
              <span className="flex-1 truncate font-medium">{f.name}</span>
              <span className="text-muted-foreground shrink-0">{formatSize(f.size)}</span>
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground shrink-0">↗</a>
              <button type="button" onClick={() => remove(f.url)} className="text-muted-foreground hover:text-destructive shrink-0">✕</button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
      {error && (
        <p className="text-xs text-destructive bg-destructive/10 px-3 py-1.5 rounded-md">{error}</p>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Загружаю...' : '+ Прикрепить файл'}
      </Button>
    </div>
  )
}
