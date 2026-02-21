export type ContentType = 'template' | 'prompt' | 'skill' | 'guide' | 'workflow'
export type ToolSlug = 'n8n' | 'claude-code' | 'chatgpt' | 'lovable' | 'other'

export interface ContentItem {
  id: string
  slug: string
  title: string
  description: string | null
  type: ContentType
  tool: ToolSlug
  content_url: string | null
  content_body: string | null
  download_url: string | null
  is_premium: boolean
  tags: string[]
  sort_order: number
  published: boolean
  created_at: string
}

export interface Stream {
  id: string
  slug: string
  title: string
  description: string | null
  youtube_id: string | null
  recorded_at: string | null
  is_premium: boolean
  published: boolean
  sort_order: number
  created_at: string
}

export const TOOL_META: Record<ToolSlug, { label: string; icon: string; description: string; locked: boolean }> = {
  'n8n': {
    label: 'N8N',
    icon: '⚙️',
    description: 'Воркфлоу-шаблоны и промпты для агентов автоматизации',
    locked: false,
  },
  'claude-code': {
    label: 'Claude Code',
    icon: '🤖',
    description: 'Скиллы, паттерны и шаблоны для разработки с AI',
    locked: false,
  },
  'chatgpt': {
    label: 'ChatGPT',
    icon: '💬',
    description: 'Промт-библиотека для бизнеса и маркетинга',
    locked: false,
  },
  'lovable': {
    label: 'Lovable',
    icon: '🔒',
    description: 'Появится позже',
    locked: true,
  },
  'other': {
    label: 'Другое',
    icon: '🔒',
    description: 'Видеогенерация, Claude Bot и другие инструменты',
    locked: true,
  },
}

export const TYPE_LABELS: Record<ContentType, string> = {
  template: 'Шаблон',
  prompt: 'Промпт',
  skill: 'Скилл',
  guide: 'Гайд',
  workflow: 'Воркфлоу',
}
