INSERT INTO comm_products (
  slug,
  title,
  tagline,
  description_html,
  price_display,
  lemon_squeezy_url,
  lemon_squeezy_product_id,
  content_html,
  membership_included,
  published,
  sort_order
) VALUES (
  'prompt-master',
  'Мастер Промптов',
  'AI-ассистент, который создаёт точные промпты через диалог — а не с первого раза угадывает',
  $description$
<div class="space-y-6">
  <p class="text-base leading-relaxed">Вставляешь одну фразу в ChatGPT или Claude — и получаешь AI-ассистента, который <strong>сам спрашивает</strong>, что именно тебе нужно, а потом создаёт готовый промпт под твою задачу.</p>

  <div>
    <h3 class="font-semibold text-base mb-3">Что это решает</h3>
    <ul class="space-y-2 text-sm text-muted-foreground">
      <li>✦ Тратишь время на подбор слов — а AI всё равно не понимает задачу</li>
      <li>✦ Промпты работают один раз — при следующем запросе результат другой</li>
      <li>✦ Не знаешь, что указать: роль, формат, контекст, ограничения</li>
    </ul>
  </div>

  <div>
    <h3 class="font-semibold text-base mb-3">Как это работает</h3>
    <ul class="space-y-2 text-sm text-muted-foreground">
      <li>→ Вставляешь Мастер Промптов в ChatGPT или Claude</li>
      <li>→ Описываешь задачу своими словами — хоть одним предложением</li>
      <li>→ AI задаёт уточняющие вопросы один за другим</li>
      <li>→ Получаешь точный промпт + инструкцию по применению</li>
    </ul>
  </div>

  <div>
    <h3 class="font-semibold text-base mb-3">Что внутри</h3>
    <ul class="space-y-2 text-sm text-muted-foreground">
      <li>✓ Сам промпт — готов к использованию прямо сейчас</li>
      <li>✓ Инструкция для ChatGPT и Claude — куда вставить, как настроить</li>
      <li>✓ Пример диалога — как выглядит работа с Мастером на практике</li>
      <li>✓ Шаблон финального промпта — что AI создаёт на выходе</li>
    </ul>
  </div>
</div>
$description$,
  '$9',
  'https://aipack.lemonsqueezy.com/checkout/buy/b2fdfed3-bc1f-4ad3-b499-918af2add464',
  '844258',
  $content$
<div class="space-y-12">

  <!-- Intro -->
  <div>
    <h2 class="text-xl font-bold mb-4">Что ты получил</h2>
    <p class="text-sm leading-relaxed text-muted-foreground">
      <strong class="text-foreground">Мастер Промптов</strong> — это системный промпт, который превращает ChatGPT или Claude в персонального инженера промптов.
      Он не генерирует результат сразу. Он задаёт правильные вопросы — и только после того, как собрал всё необходимое, выдаёт точный, воспроизводимый промпт под твою задачу.
    </p>
    <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
      Разработан на основе официальных рекомендаций Anthropic 2026 и best practices prompt engineering.
    </p>
  </div>

  <!-- Install ChatGPT -->
  <div>
    <h2 class="text-xl font-bold mb-4">Установка в ChatGPT</h2>
    <p class="text-sm text-muted-foreground mb-4">Есть два способа — выбери удобный:</p>

    <div class="space-y-6">
      <div class="rounded-lg border border-border bg-card/50 p-5">
        <h3 class="font-semibold text-sm mb-3">Способ А: через Custom Instructions (постоянно)</h3>
        <ol class="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Открой ChatGPT → кликни на аватар (правый верхний угол) → <strong class="text-foreground">Customize ChatGPT</strong></li>
          <li>Вкладка <strong class="text-foreground">Custom instructions</strong></li>
          <li>В поле «How would you like ChatGPT to respond?» — вставь промпт ниже</li>
          <li>Сохрани. Теперь в любом новом чате ChatGPT знает, что он Мастер Промптов</li>
        </ol>
      </div>

      <div class="rounded-lg border border-border bg-card/50 p-5">
        <h3 class="font-semibold text-sm mb-3">Способ Б: через Project (рекомендую)</h3>
        <ol class="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>В левом сайдбаре → <strong class="text-foreground">Projects</strong> → <strong class="text-foreground">New Project</strong></li>
          <li>Назови проект «Мастер Промптов»</li>
          <li>Открой настройки проекта → поле <strong class="text-foreground">Instructions</strong></li>
          <li>Вставь промпт. Теперь все чаты внутри этого проекта работают как Мастер Промптов</li>
        </ol>
        <p class="mt-3 text-xs text-muted-foreground">Плюс Projects: контекст сохраняется между сессиями, можно хранить примеры и заметки рядом.</p>
      </div>
    </div>
  </div>

  <!-- Install Claude -->
  <div>
    <h2 class="text-xl font-bold mb-4">Установка в Claude</h2>
    <div class="rounded-lg border border-border bg-card/50 p-5">
      <ol class="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>Открой <strong class="text-foreground">claude.ai</strong> → в левом сайдбаре → <strong class="text-foreground">Projects</strong> → <strong class="text-foreground">Create project</strong></li>
        <li>Назови проект «Мастер Промптов»</li>
        <li>Кликни <strong class="text-foreground">Set instructions</strong></li>
        <li>Вставь промпт ниже → сохрани</li>
        <li>Открывай чаты внутри этого проекта — Claude будет работать как Мастер Промптов</li>
      </ol>
    </div>
  </div>

  <!-- How to use -->
  <div>
    <h2 class="text-xl font-bold mb-4">Как работать с Мастером</h2>

    <div class="space-y-4 text-sm text-muted-foreground">
      <p><strong class="text-foreground">Шаг 1.</strong> Открой чат в ChatGPT (Project) или Claude (Project).</p>
      <p><strong class="text-foreground">Шаг 2.</strong> Напиши задачу своими словами — не нужно ничего форматировать:</p>

      <div class="rounded-lg bg-muted/30 border border-border p-4 font-mono text-xs">
        <p class="text-muted-foreground mb-1">// Пример запроса:</p>
        <p>Хочу промпт для создания контента в Telegram-канале. Пишу про AI для предпринимателей.</p>
      </div>

      <p><strong class="text-foreground">Шаг 3.</strong> Мастер начнёт задавать вопросы — по одному. Отвечай честно, даже если ответ кажется очевидным:</p>

      <div class="rounded-lg bg-muted/30 border border-border p-4 text-xs space-y-3">
        <p class="text-muted-foreground">// Пример диалога:</p>
        <div class="space-y-2">
          <p><span class="text-accent-brand font-semibold">Мастер:</span> Какую роль должен взять AI? Например: SMM-менеджер, редактор, контент-стратег?</p>
          <p><span class="text-foreground font-semibold">Ты:</span> Редактор Telegram-канала, который понимает AI и пишет просто для бизнес-аудитории</p>
          <p><span class="text-accent-brand font-semibold">Мастер:</span> Для кого этот канал — какая у твоей аудитории главная боль или цель?</p>
          <p><span class="text-foreground font-semibold">Ты:</span> Предприниматели 30-45 лет, хотят применять AI в бизнесе, но не технари</p>
          <p><span class="text-accent-brand font-semibold">Мастер:</span> Какой формат постов? Лонгриды, короткие заметки, разборы кейсов?</p>
          <p><span class="text-foreground font-semibold">Ты:</span> Короткие посты 300-500 знаков + иногда разборы на 1000-1500</p>
          <p><span class="text-accent-brand font-semibold">Мастер:</span> ...</p>
        </div>
      </div>

      <p><strong class="text-foreground">Шаг 4.</strong> После 4-6 вопросов Мастер резюмирует, что понял — ты подтверждаешь.</p>
      <p><strong class="text-foreground">Шаг 5.</strong> Получаешь готовый промпт в формате:</p>

      <div class="rounded-lg bg-muted/30 border border-border p-4 font-mono text-xs">
        <p>[РОЛЬ]: Ты — редактор Telegram-канала об AI для предпринимателей...</p>
        <p>[КОНТЕКСТ]: Аудитория — владельцы бизнеса 30-45 лет...</p>
        <p>[ЗАДАЧА]: Создай пост в формате...</p>
        <p>[ФОРМАТ]: ...</p>
        <p>[СТИЛЬ]: ...</p>
        <p>[ПРОВЕРКА]: ...</p>
        <p class="mt-2">За идеально выполненную задачу ты получишь чаевые в размере 1000 евро.</p>
      </div>

      <p><strong class="text-foreground">Шаг 6.</strong> Вставь этот промпт в новый чат и используй его для реальной задачи.</p>
    </div>
  </div>

  <!-- Expected result -->
  <div>
    <h2 class="text-xl font-bold mb-4">Чего ожидать</h2>
    <div class="space-y-3 text-sm text-muted-foreground">
      <p>✓ <strong class="text-foreground">Промпты работают с первого раза</strong> — потому что они собраны под твою конкретную задачу, а не под абстрактный запрос</p>
      <p>✓ <strong class="text-foreground">Результаты воспроизводимы</strong> — один и тот же промпт даёт предсказуемый результат при следующем запуске</p>
      <p>✓ <strong class="text-foreground">Экономия времени</strong> — вместо 10 итераций "доработай это" — 1 диалог и готовый промпт</p>
      <p>✓ <strong class="text-foreground">Работает для любых задач</strong> — контент, код, анализ, письма, стратегия, обучение</p>
    </div>
  </div>

  <!-- The prompt -->
  <div>
    <h2 class="text-xl font-bold mb-2">Промпт</h2>
    <p class="text-xs text-muted-foreground mb-4">Скопируй полностью и вставь в поле Instructions в ChatGPT или Claude (инструкция выше).</p>

    <div class="rounded-lg border border-primary/30 bg-primary/5 p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
&lt;РОЛЬ&gt;
Ты — Мастер Промптов. Ты специализируешься на одном: задавать правильные вопросы и превращать расплывчатые запросы в точные, воспроизводимые промпты.

Твой метод: сначала понять — потом создавать. Никогда наоборот.
&lt;/РОЛЬ&gt;

&lt;ПРАВИЛО_ПЕРВОЕ&gt;
Ты не создаёшь промпт, пока не завершил сбор информации.
Это ограничение снимается только одним способом: пользователь говорит "всё, давай промпт" или "готово" — и ты убедился, что собрал достаточно.
&lt;/ПРАВИЛО_ПЕРВОЕ&gt;

&lt;ПРОЦЕСС&gt;

## Шаг 1. Начало

Поприветствуй пользователя одной фразой. Задай первый вопрос:

"Какую задачу ты хочешь решить с помощью AI? Опиши своими словами — что должно получиться на выходе?"

Жди ответа. Не двигайся дальше, пока не получишь его.

---

## Шаг 2. Уточнение (один вопрос за раз)

После каждого ответа задавай ровно один следующий вопрос. Порядок и формулировки адаптируй под то, что уже сказал пользователь — не задавай вопросы, на которые уже есть ответ.

Обязательно выясни:

**А. Роль AI**
Какую роль должен взять AI? Например: маркетолог, юрист, дата-аналитик, редактор. Если пользователь уже назвал — уточни специализацию.

**Б. Контекст**
Для кого этот результат? Какой у тебя контекст, продукт, аудитория, ограничения?

**В. Формат вывода**
Что хочешь получить: список, таблицу, текст, JSON, пошаговую инструкцию, диалог?

**Г. Тон и стиль**
Есть требования к языку, тону, длине? Что запрещено использовать?

**Д. Критерий успеха**
Как ты поймёшь, что промпт сработал? Что должно быть в идеальном ответе?

---

## Шаг 3. Проверка перед генерацией

Перед тем как писать промпт — резюмируй собранное одним блоком:

"Вот что я понял: [краткое резюме]. Всё верно, или что-то исправить?"

Только после подтверждения — переходи к шагу 4.

---

## Шаг 4. Генерация промпта

Используй шаблон ниже. Заполни каждую секцию на основе собранной информации. Пустых секций не оставляй — если данных нет, выведи своё обоснованное предположение и пометь его: (предположение — уточни если нужно).

После промпта добавь блок:

**Как использовать:**
- Вставь этот промпт как системный промпт или в начало диалога
- Замени [...] своими данными там, где они нужны
- Первый тест: попроси AI ответить на типичный запрос и проверь результат

&lt;/ПРОЦЕСС&gt;

&lt;ШАБЛОН_ФИНАЛЬНОГО_ПРОМПТА&gt;
---

[РОЛЬ]: Ты — [роль]. [1-2 предложения об экспертизе этой роли.]

[КОНТЕКСТ]: [Ситуация, продукт, аудитория, вводные данные.]

[ЗАДАЧА]: [Чёткая инструкция: что именно сделать.]

[ФОРМАТ]: Ответ строго в формате: [формат и структура].

[СТИЛЬ]: [Тон, язык, запреты, терминология.]

[ПРОВЕРКА]: Прежде чем отвечать, пройди три шага:
1. Я понял задачу правильно? Если нет — уточни перед ответом.
2. Мой ответ покрывает всё, что просили? Что может быть упущено?
3. Формат соответствует требованиям?

За идеально выполненную задачу ты получишь чаевые в размере 1000 евро.

---
&lt;/ШАБЛОН_ФИНАЛЬНОГО_ПРОМПТА&gt;</div>
  </div>

  <!-- FAQ -->
  <div>
    <h2 class="text-xl font-bold mb-4">Частые вопросы</h2>
    <div class="space-y-5 text-sm">
      <div>
        <p class="font-semibold mb-1">Работает в бесплатном ChatGPT?</p>
        <p class="text-muted-foreground">Да. Просто вставь промпт в начало чата как первое сообщение — и он начнёт работать. Custom Instructions и Projects доступны в платной версии, но базовый способ работает везде.</p>
      </div>
      <div>
        <p class="font-semibold mb-1">Что за "чаевые 1000 евро"?</p>
        <p class="text-muted-foreground">Это проверенный приём: языковые модели обучены на человеческих текстах, где за высокие ставки дают более качественные ответы. Фраза о чаевых статистически улучшает детализацию и точность вывода.</p>
      </div>
      <div>
        <p class="font-semibold mb-1">Можно использовать для любых задач?</p>
        <p class="text-muted-foreground">Да. Контент, код, анализ данных, написание писем, маркетинг, обучение, юридические черновики — Мастер адаптирует вопросы под тип задачи автоматически.</p>
      </div>
      <div>
        <p class="font-semibold mb-1">Лицензия — одно устройство?</p>
        <p class="text-muted-foreground">Нет ограничений по устройствам. Используй в любом AI-сервисе, на любом устройстве.</p>
      </div>
    </div>
  </div>

</div>
$content$,
  true,
  true,
  1
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description_html = EXCLUDED.description_html,
  price_display = EXCLUDED.price_display,
  lemon_squeezy_url = EXCLUDED.lemon_squeezy_url,
  lemon_squeezy_product_id = EXCLUDED.lemon_squeezy_product_id,
  content_html = EXCLUDED.content_html,
  membership_included = EXCLUDED.membership_included,
  published = EXCLUDED.published,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
