-- Seed: initial courses (2 active + 4 coming soon)
INSERT INTO comm_courses (slug, title, description, status, is_premium, published, sort_order) VALUES
  ('n8n',           'N8N автоматизации',             'Строим рабочие автоматизации с нуля — триггеры, API, AI-агенты.',                 'active',      true, true, 1),
  ('chatgpt',       'ChatGPT с нуля',                'Практический курс по работе с ChatGPT для задач бизнеса и маркетинга.',           'active',      true, true, 2),
  ('claude-code',   'Claude Code + Вайбкодинг',      'Разработка с AI-ассистентом: от идеи до рабочего продукта.',                      'coming_soon', true, true, 3),
  ('lovable',       'Lovable',                       'No-code разработка с AI: создаём приложения без написания кода.',                 'coming_soon', true, true, 4),
  ('agent-systems', 'Агентные системы для бизнеса',  'Проектирование многоагентных систем для реальных задач.',                         'coming_soon', true, true, 5),
  ('marketing-ai',  'Продвижение и продажи',         'AI-инструменты для маркетинга, лидогенерации и продаж.',                         'coming_soon', true, true, 6)
ON CONFLICT (slug) DO NOTHING;
