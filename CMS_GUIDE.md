# CMS Guide — Инструкция для агента наполнения контентом

> Этот файл — всё что нужно знать, чтобы добавлять контент на сайт.
> Не нужно разбираться в коде. Только API-запросы и правила ниже.

---

## Как устроен сайт (кратко)

Сайт — платное AI-сообщество Никиты Ефимова. Контент трёх типов:

| Тип | URL на сайте | Кто видит |
|---|---|---|
| **Инструменты** (шаблоны, промпты, скиллы) | `/tools/n8n`, `/tools/claude-code`, `/tools/chatgpt` | Все (бесплатные) или только members (premium) |
| **Курсы** (видеоуроки) | `/courses/[slug]` | Только members |
| **Эфиры** (записи стримов) | `/streams` | Только members |

---

## API — как добавлять контент

Все запросы — на `https://aipack.live`. Требуется быть залогиненным как **admin** (cookie `comm_session`).

Либо работать напрямую через **Supabase** (таблицы с префиксом `comm_`), используя `service_role` ключ.

---

## 1. ИНСТРУМЕНТЫ (`comm_content_items`)

Это карточки на страницах `/tools/n8n`, `/tools/claude-code`, `/tools/chatgpt`.

### Поля

| Поле | Тип | Обязательно | Описание |
|---|---|---|---|
| `title` | string | ✅ | Название материала |
| `slug` | string | ✅ | URL-slug, латиница + дефис (уникальный) |
| `description` | string | — | Краткое описание (1–2 предложения) |
| `type` | enum | ✅ | Тип: `template` / `prompt` / `skill` / `guide` / `workflow` |
| `tool` | enum | ✅ | Инструмент: `n8n` / `claude-code` / `chatgpt` / `lovable` / `other` |
| `content_body` | string (HTML) | — | Основной текст (HTML из Tiptap-редактора) |
| `content_url` | string | — | Внешняя ссылка (если материал на другом ресурсе) |
| `download_url` | string | — | Прямая ссылка на скачивание файла |
| `is_premium` | boolean | ✅ | `false` = бесплатно для всех, `true` = только members |
| `tags` | string[] | — | Массив тегов, например `["автоматизация", "telegram"]` |
| `sort_order` | integer | — | Порядок отображения (меньше = выше). По умолчанию 0 |
| `published` | boolean | ✅ | `false` = черновик, `true` = виден на сайте |
| `attachments` | JSON array | — | Прикреплённые файлы (см. формат ниже) |

### Формат `attachments`
```json
[
  { "url": "https://...", "name": "workflow.json", "size": 12345 }
]
```

### Пример создания через Supabase

```sql
INSERT INTO comm_content_items (slug, title, description, type, tool, content_body, is_premium, published, sort_order)
VALUES (
  'n8n-telegram-notify',
  'Уведомления в Telegram через N8N',
  'Готовый воркфлоу: отправка сообщений в Telegram при любом событии.',
  'workflow',
  'n8n',
  '<p>Описание как установить и настроить...</p>',
  false,
  true,
  10
);
```

### Правила именования slug
- Только латиница, цифры, дефисы
- Включай tool-prefix: `n8n-...`, `claude-...`, `chatgpt-...`
- Уникальный по всей таблице
- Примеры: `n8n-telegram-notify`, `claude-code-memory-skill`, `chatgpt-copywriter-prompt`

### Типы и где они отображаются
| type | Что это | Пример |
|---|---|---|
| `template` | Готовый шаблон для копирования | Шаблон промпта |
| `prompt` | Промпт для LLM | Системный промпт |
| `skill` | Скилл для Claude Code | `.md` файл скилла |
| `guide` | Текстовый гайд | Статья-инструкция |
| `workflow` | Воркфлоу N8N | JSON файл |

---

## 2. КУРСЫ (`comm_courses` → `comm_course_modules` → `comm_lessons`)

Иерархия: Курс → Модули → Уроки.

### 2a. Курс (`comm_courses`)

| Поле | Тип | Описание |
|---|---|---|
| `title` | string | Название курса |
| `slug` | string | URL-slug, уникальный (например `n8n`, `chatgpt`) |
| `description` | string | Описание курса (1–3 предложения) |
| `status` | enum | `active` = доступен, `coming_soon` = показывает "Скоро" |
| `is_premium` | boolean | Обычно `true` (только members) |
| `published` | boolean | `true` = виден в списке курсов |
| `sort_order` | integer | Порядок в списке |

```sql
-- Создать курс
INSERT INTO comm_courses (slug, title, description, status, is_premium, published, sort_order)
VALUES ('n8n', 'N8N автоматизации', 'Строим рабочие автоматизации с нуля — триггеры, API, AI-агенты.', 'active', true, true, 1);
```

### 2b. Модуль (`comm_course_modules`)

```sql
-- Сначала нужен id курса
INSERT INTO comm_course_modules (course_id, title, sort_order)
VALUES ('<course_uuid>', 'Введение в N8N', 1);
```

### 2c. Урок (`comm_lessons`)

| Поле | Тип | Описание |
|---|---|---|
| `module_id` | uuid | ID модуля |
| `slug` | string | URL-slug урока (уникальный внутри модуля) |
| `title` | string | Название урока |
| `youtube_id` | string | ID видео на YouTube (только ID, не полный URL) |
| `loom_id` | string | ID видео в Loom (из URL `loom.com/share/<ID>`) |
| `content` | string (HTML) | Текстовый контент урока (HTML) |
| `duration` | integer | Длительность в секундах |
| `sort_order` | integer | Порядок внутри модуля |
| `published` | boolean | Виден ли урок |
| `attachments` | JSON array | Файлы к уроку (формат такой же как у content_items) |

#### Как получить YouTube ID
Из URL `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → ID это `dQw4w9WgXcQ`

#### Как получить Loom ID
Из URL `https://www.loom.com/share/abc123def456` → ID это `abc123def456`

```sql
INSERT INTO comm_lessons (module_id, slug, title, youtube_id, content, duration, sort_order, published)
VALUES (
  '<module_uuid>',
  'chto-takoe-n8n',
  'Что такое N8N и зачем он нужен',
  'dQw4w9WgXcQ',
  '<p>В этом уроке мы разберём...</p>',
  600,
  1,
  true
);
```

### Полный пример: создать курс с модулем и уроком

```sql
-- 1. Создать курс
INSERT INTO comm_courses (slug, title, description, status, is_premium, published, sort_order)
VALUES ('n8n', 'N8N автоматизации', 'Строим автоматизации с нуля.', 'active', true, true, 1)
RETURNING id;
-- Сохрани course_id

-- 2. Создать модуль
INSERT INTO comm_course_modules (course_id, title, sort_order)
VALUES ('<course_id>', 'Введение', 1)
RETURNING id;
-- Сохрани module_id

-- 3. Создать урок
INSERT INTO comm_lessons (module_id, slug, title, youtube_id, content, duration, sort_order, published)
VALUES ('<module_id>', 'vvedenie', 'Введение в курс', 'YouTubeID', '<p>Текст урока...</p>', 300, 1, true);
```

---

## 3. ЭФИРЫ (`comm_streams`)

Записи живых сессий и стримов.

| Поле | Тип | Описание |
|---|---|---|
| `title` | string | Название эфира |
| `slug` | string | URL-slug (уникальный) |
| `description` | string (HTML) | Описание / что обсуждали |
| `youtube_id` | string | ID видео на YouTube |
| `recorded_at` | timestamptz | Дата записи (ISO 8601) |
| `is_premium` | boolean | Обычно `true` |
| `published` | boolean | Виден ли на сайте |
| `sort_order` | integer | Порядок (новые — меньший номер) |

```sql
INSERT INTO comm_streams (slug, title, description, youtube_id, recorded_at, is_premium, published, sort_order)
VALUES (
  'efir-2026-02-21',
  'Эфир: разбираем N8N агентов',
  '<p>Разобрали три реальных воркфлоу...</p>',
  'YouTubeID',
  '2026-02-21T19:00:00Z',
  true,
  true,
  1
);
```

---

## Частые ошибки

| Ошибка | Решение |
|---|---|
| `duplicate key value violates unique constraint` на slug | Slug уже занят — придумай другой |
| Контент не виден на сайте | Проверь что `published = true` |
| Курс не виден в списке | Проверь `published = true` и `status = 'active'` |
| Урок не открывается | Проверь что урок опубликован И родительский модуль/курс опубликован |
| Картинка/видео не грузится | YouTube/Loom ID должен быть только ID, не полный URL |

---

## HTML для `content_body` / `content`

Контент хранится как HTML (генерируется Tiptap-редактором). Поддерживаемые теги:

```html
<!-- Текст -->
<p>Абзац</p>
<strong>Жирный</strong>
<em>Курсив</em>

<!-- Заголовки -->
<h2>Заголовок 2</h2>
<h3>Заголовок 3</h3>

<!-- Списки -->
<ul><li>Пункт</li></ul>
<ol><li>Нумерованный</li></ol>

<!-- Цитата -->
<blockquote><p>Текст цитаты</p></blockquote>

<!-- Код -->
<pre><code class="language-javascript">const x = 1</code></pre>
<code>инлайн код</code>

<!-- YouTube (встраивается как iframe в редакторе) -->
<div data-youtube-video><iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe></div>

<!-- Loom (встраивается как iframe) -->
<div data-loom-video><iframe src="https://www.loom.com/embed/LOOM_ID"></iframe></div>
```

При заполнении через SQL — можно писать простой HTML без видео-блоков. Видео задаётся отдельными полями `youtube_id` / `loom_id`.

---

## Краткий чеклист для каждого материала

**Инструмент (content_item):**
- [ ] `slug` уникальный, с префиксом инструмента
- [ ] `type` и `tool` заполнены
- [ ] `is_premium` осознанно выбран (free = маркетинг, premium = ценность)
- [ ] `published = true`

**Курс:**
- [ ] `status = 'active'` (не `coming_soon`)
- [ ] Минимум 1 модуль создан
- [ ] Минимум 1 урок опубликован

**Урок:**
- [ ] `youtube_id` или `loom_id` заполнен
- [ ] `slug` уникален внутри модуля
- [ ] `published = true`

**Эфир:**
- [ ] `youtube_id` заполнен
- [ ] `recorded_at` указана дата реального эфира
