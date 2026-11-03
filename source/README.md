# КНБ — персональна карта бізнесу

Квіз на Next.js (App Router) для Node.js. База даних не використовується: заявки передаються на webhook, а запитання для власної сфери формулює OpenAI.

## Локальний запуск

Потрібні Node.js 22 і pnpm 11.25.0 (`corepack pnpm@11.25.0 ...`, якщо pnpm не встановлено).

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```

Сервер слухає `0.0.0.0:$PORT` (типово 3000). `GET /health` повертає 200, коли сервер готовий.

## Змінні оточення

| Змінна | Призначення |
|---|---|
| `BUSINESS_REVIEW_WEBHOOK_URL` | Адреса вебхука заявок. Без неї форма показує помилку відправки |
| `OPENAI_API_KEY` | Ключ OpenAI. Без нього власна сфера отримує універсальні запитання |
| `OPENAI_MODEL` | Необов'язкова модель, типово `gpt-4o-mini` |
| `OPENAI_BASE_URL` | Необов'язкова адреса шлюзу або тестового сервера |

Усі змінні доступні лише серверу. У production їх задають у Railway Variables.

## Перевірки

```bash
node tests/engine.cjs
node tests/lead-payload.mjs
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

`tests/lead-payload.mjs` читає дані з `../docs` і `../examples`. Деплой описано в `../docs/HANDOFF.md`, розділ 10.
