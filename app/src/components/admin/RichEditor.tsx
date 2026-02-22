'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Youtube } from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Node, mergeAttributes } from '@tiptap/core'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

const lowlight = createLowlight(common)

// Custom Loom extension
const LoomEmbed = Node.create({
  name: 'loomEmbed',
  group: 'block',
  atom: true,
  addAttributes() {
    return { src: { default: null } }
  },
  parseHTML() {
    return [{ tag: 'div[data-loom-src]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-loom-src': HTMLAttributes.src }), [
      'iframe',
      {
        src: HTMLAttributes.src,
        frameborder: '0',
        allowfullscreen: 'true',
        style: 'width:100%;aspect-ratio:16/9;border-radius:8px;',
      },
    ]]
  },
})

function getLoomEmbedUrl(input: string): string | null {
  const m = input.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  if (m) return `https://www.loom.com/embed/${m[1]}`
  const m2 = input.match(/loom\.com\/embed\/([a-zA-Z0-9]+)/)
  if (m2) return `https://www.loom.com/embed/${m2[1]}`
  return null
}

function getYoutubeId(input: string): string | null {
  const m = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

interface RichEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichEditor({ content, onChange, placeholder = 'Начните вводить текст...' }: RichEditorProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [showVideoInput, setShowVideoInput] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      LoomEmbed,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: null } }),
      Image.configure({ allowBase64: false, HTMLAttributes: { class: 'rounded-xl' } }),
      Placeholder.configure({ placeholder }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[300px] focus:outline-none p-4',
      },
    },
  })

  const insertVideo = useCallback(() => {
    const url = videoUrl.trim()
    if (!url || !editor) return

    const youtubeId = getYoutubeId(url)
    if (youtubeId) {
      editor.commands.setYoutubeVideo({ src: url })
      setVideoUrl('')
      setShowVideoInput(false)
      return
    }

    const loomSrc = getLoomEmbedUrl(url)
    if (loomSrc) {
      editor.chain().focus().insertContent({
        type: 'loomEmbed',
        attrs: { src: loomSrc },
      }).run()
      setVideoUrl('')
      setShowVideoInput(false)
      return
    }

    alert('Не удалось определить тип видео. Поддерживаются YouTube и Loom.')
  }, [editor, videoUrl])

  const insertLink = useCallback(() => {
    const url = linkUrl.trim()
    if (!url || !editor) return

    const href = url.startsWith('http') ? url : `https://${url}`

    if (editor.state.selection.empty) {
      // No selection: insert link as text
      editor.chain().focus().insertContent(`<a href="${href}">${url}</a>`).run()
    } else {
      editor.chain().focus().setLink({ href }).run()
    }
    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const removeLink = useCallback(() => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
    setShowLinkInput(false)
  }, [editor])

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return
    setImageUploading(true)
    try {
      // Get signed URL from our upload API
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })
      if (!res.ok) throw new Error('Failed to get upload URL')
      const { signedUrl, publicUrl } = await res.json()

      // Upload directly to Supabase Storage
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadRes.ok) throw new Error('Upload failed')

      editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run()
      setShowImageInput(false)
    } catch {
      alert('Ошибка загрузки изображения')
    } finally {
      setImageUploading(false)
    }
  }, [editor])

  if (!editor) return null

  const ToolbarBtn = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title?: string }) => (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className={`px-2 py-1 rounded text-sm transition-colors ${active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
    >
      {children}
    </button>
  )

  const Sep = () => <span className="w-px h-4 bg-border mx-1" />

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-card">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Жирный">
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Курсив">
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline код">
          <span className="font-mono text-xs">{'<>'}</span>
        </ToolbarBtn>
        <Sep />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Заголовок 1">H1</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Заголовок 2">H2</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Заголовок 3">H3</ToolbarBtn>
        <Sep />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Маркированный список">• Список</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Нумерованный список">1. Список</ToolbarBtn>
        <Sep />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Цитата">❝</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Блок кода">&lt;/&gt;</ToolbarBtn>
        <Sep />
        <ToolbarBtn
          onClick={() => {
            if (editor.isActive('link')) {
              setLinkUrl(editor.getAttributes('link').href || '')
            } else {
              setLinkUrl('')
            }
            setShowLinkInput(v => !v)
            setShowVideoInput(false)
            setShowImageInput(false)
          }}
          active={editor.isActive('link')}
          title="Ссылка"
        >
          🔗
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => {
            setShowImageInput(v => !v)
            setShowVideoInput(false)
            setShowLinkInput(false)
          }}
          title="Изображение"
        >
          🖼
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => {
            setShowVideoInput(v => !v)
            setShowLinkInput(false)
            setShowImageInput(false)
          }}
          title="Видео"
        >
          ▶ Видео
        </ToolbarBtn>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex gap-2 px-3 py-2 border-b border-border bg-card/50">
          <input
            type="url"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && insertLink()}
            placeholder="https://example.com"
            className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            autoFocus
          />
          <Button type="button" size="sm" onClick={insertLink}>Вставить</Button>
          {editor.isActive('link') && (
            <Button type="button" size="sm" variant="destructive" onClick={removeLink}>Убрать</Button>
          )}
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>✕</Button>
        </div>
      )}

      {/* Image input */}
      {showImageInput && (
        <div className="flex gap-2 px-3 py-2 border-b border-border bg-card/50 items-center">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
            />
            <span className="inline-flex items-center gap-2 cursor-pointer bg-background border border-border rounded px-3 py-1.5 text-sm hover:bg-accent/30 transition-colors">
              {imageUploading ? 'Загружаю...' : 'Выбрать файл'}
            </span>
          </label>
          <span className="text-xs text-muted-foreground">или</span>
          <input
            type="url"
            placeholder="URL изображения..."
            className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const url = (e.target as HTMLInputElement).value.trim()
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run()
                  setShowImageInput(false)
                }
              }
            }}
          />
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowImageInput(false)}>✕</Button>
        </div>
      )}

      {/* Video URL input */}
      {showVideoInput && (
        <div className="flex gap-2 px-3 py-2 border-b border-border bg-card/50">
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && insertVideo()}
            placeholder="YouTube или Loom URL..."
            className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            autoFocus
          />
          <Button type="button" size="sm" onClick={insertVideo}>Вставить</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowVideoInput(false)}>✕</Button>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
