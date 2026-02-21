'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Youtube } from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Node, mergeAttributes } from '@tiptap/core'
import { useState } from 'react'
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
  // https://www.loom.com/share/abc123 → https://www.loom.com/embed/abc123
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      LoomEmbed,
      Link.configure({ openOnClick: false }),
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

  if (!editor) return null

  function insertVideo() {
    const url = videoUrl.trim()
    if (!url) return

    const youtubeId = getYoutubeId(url)
    if (youtubeId) {
      editor?.commands.setYoutubeVideo({ src: url })
      setVideoUrl('')
      setShowVideoInput(false)
      return
    }

    const loomSrc = getLoomEmbedUrl(url)
    if (loomSrc) {
      editor?.chain().focus().insertContent({
        type: 'loomEmbed',
        attrs: { src: loomSrc },
      }).run()
      setVideoUrl('')
      setShowVideoInput(false)
      return
    }

    alert('Не удалось определить тип видео. Поддерживаются YouTube и Loom.')
  }

  const ToolbarBtn = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className={`px-2 py-1 rounded text-sm transition-colors ${active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-card">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <em>I</em>
        </ToolbarBtn>
        <span className="w-px h-4 bg-border mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>H1</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>H3</ToolbarBtn>
        <span className="w-px h-4 bg-border mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>• Список</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>1. Список</ToolbarBtn>
        <span className="w-px h-4 bg-border mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>❝</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>&lt;/&gt;</ToolbarBtn>
        <span className="w-px h-4 bg-border mx-1" />
        <ToolbarBtn onClick={() => setShowVideoInput(v => !v)}>▶ Видео</ToolbarBtn>
      </div>

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
