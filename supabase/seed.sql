-- Seed data for comm_content_items
-- Run after migrations to populate initial content

insert into comm_content_items (slug, title, description, type, tool, content_url, is_premium, tags, sort_order, published) values

-- N8N — free
('n8n-telegram-notify', 'Telegram уведомления из N8N', 'Воркфлоу для отправки сообщений в Telegram-канал или группу при любом событии. Подходит для алертов, отчётов, CRM-обновлений.', 'workflow', 'n8n', null, false, ARRAY['telegram', 'уведомления', 'базовый'], 10, true),
('n8n-airtable-sync', 'Синхронизация Airtable → Google Sheets', 'Шаблон для автоматической синхронизации записей между Airtable и Google Sheets по расписанию.', 'template', 'n8n', null, false, ARRAY['airtable', 'google sheets', 'синхронизация'], 20, true),
('n8n-lead-enrichment', 'Обогащение лидов через AI', 'Воркфлоу: получаем лид → отправляем данные в GPT → получаем описание ICP → сохраняем в CRM.', 'workflow', 'n8n', null, false, ARRAY['ai', 'crm', 'лиды'], 30, true),

-- N8N — premium
('n8n-agent-research', 'AI-агент для research компаний', 'Многошаговый агент: ищет компанию в интернете, собирает данные о команде, продуктах и финансах, формирует структурированный отчёт.', 'workflow', 'n8n', null, true, ARRAY['агент', 'research', 'продвинутый'], 40, true),
('n8n-content-pipeline', 'Контент-конвейер для Telegram', 'Автоматизация: идея → GPT пишет пост → humanizer → Telegram. С очередью и расписанием.', 'workflow', 'n8n', null, true, ARRAY['контент', 'telegram', 'автоматизация'], 50, true),
('n8n-ai-support', 'AI-поддержка клиентов', 'Бот отвечает на вопросы клиентов используя базу знаний. Интеграция с Telegram, vector search, escalation.', 'workflow', 'n8n', null, true, ARRAY['поддержка', 'rag', 'бизнес'], 60, true),

-- Claude Code — free
('cc-skill-template', 'Шаблон для создания скилла', 'Готовая структура SKILL.md с примерами триггеров, workflow и правил. Используй как основу для своих скиллов.', 'skill', 'claude-code', null, false, ARRAY['скилл', 'шаблон', 'базовый'], 10, true),
('cc-commit-patterns', 'Паттерны написания коммитов', 'Системный промпт и правила для генерации правильных git commit messages в стиле Conventional Commits.', 'prompt', 'claude-code', null, false, ARRAY['git', 'коммиты', 'workflow'], 20, true),

-- Claude Code — premium
('cc-vibe-coding-guide', 'Гайд по вайбкодингу с Claude', 'Полная методология: как разбивать задачи, работать с контекстом, использовать plan mode и агентов для реальных проектов.', 'guide', 'claude-code', null, true, ARRAY['вайбкодинг', 'методология', 'продвинутый'], 30, true),
('cc-nextjs-patterns', 'Паттерны Next.js App Router', 'Скилл с лучшими практиками: Server Components, streaming, middleware, data fetching. Устанавливается за 1 команду.', 'skill', 'claude-code', null, true, ARRAY['nextjs', 'app router', 'паттерны'], 40, true),

-- ChatGPT — free
('chatgpt-copywriter', 'Системный промпт копирайтера', 'Промпт для ChatGPT, превращающий его в профессионального копирайтера с учётом тона, аудитории и цели текста.', 'prompt', 'chatgpt', null, false, ARRAY['копирайтинг', 'маркетинг', 'базовый'], 10, true),
('chatgpt-email-sequence', 'Серия email для прогрева', 'Шаблон для создания email-последовательности из 5 писем: от знакомства до продажи. Адаптируется под любой продукт.', 'template', 'chatgpt', null, false, ARRAY['email', 'продажи', 'шаблон'], 20, true),

-- ChatGPT — premium
('chatgpt-icp-research', 'ICP Research промпт', 'Глубокий анализ целевой аудитории: боли, триггеры, возражения, язык клиента. Результат — готовый ICP-документ.', 'prompt', 'chatgpt', null, true, ARRAY['icp', 'аудитория', 'стратегия'], 30, true),
('chatgpt-content-system', 'Контент-система для эксперта', 'Набор промптов для создания полного контент-плана: темы, форматы, хуки, посты, адаптация под разные платформы.', 'prompt', 'chatgpt', null, true, ARRAY['контент', 'система', 'эксперт'], 40, true);
