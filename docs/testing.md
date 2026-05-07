# Тесты (Vitest)

## Стек

| Инструмент | Назначение |
|------------|------------|
| [Vitest](https://vitest.dev/) | Запуск тестов, watch, покрытие, снапшоты |
| [jsdom](https://github.com/jsdom/jsdom) | Окружение DOM для тестов React (`vite.config.ts` → `test.environment`) |
| [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) | Рендер компонентов и запросы к DOM |
| [@testing-library/user-event](https://testing-library.com/docs/user-event/intro/) | Имитация действий пользователя |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | Матчеры вроде `toBeInTheDocument()` |

Конфигурация тестов задаётся в **`vite.config.ts`** (секция `test`): маска файлов, `setupFiles`, пороги coverage и т.д.

## Скрипты npm

| Команда | Действие |
|---------|----------|
| `npm run test` | Один прогон всех тестов: `vitest run` |
| `npm run test:watch` | Режим watch: `vitest` (перезапуск при изменении файлов). В терминале без полноценного TTY (часть встроенных панелей IDE) интерактив может вести себя иначе — при сбоях запускайте из обычного PowerShell/cmd или используйте `npm run test` |
| `npm run test:coverage` | Прогон с отчётом покрытия v8 (`coverage/` в корне проекта после запуска) |
| `npm run lint` | ESLint по репозиторию (в т.ч. тестовые файлы) |

Перед PR имеет смысл выполнить **`npm run lint`** и **`npm run test`** (полный прогон).

## Расположение файлов

- Именование: **`*.test.ts`** или **`*.test.tsx`**.
- Подборка в конфиге: `include: ['src/**/*.test.{ts,tsx}']`.
- Обычно тест лежит рядом с кодом в **`__tests__/`** (например `src/components/Button/__tests__/Button.test.tsx`).

## Подготовка окружения (`src/test/setupTests.ts`)

Подключается через `test.setupFiles` в Vite.

- **`@testing-library/jest-dom/vitest`** — матчеры для DOM.
- Явный **`cleanup()`** из RTL после каждого теста через `afterEach` из `vitest`: автоматическая регистрация cleanup в `@testing-library/react` срабатывает только при **глобальной** `afterEach` (как в Jest с `globals: true`); в этом проекте API Vitest импортируются явно, поэтому глобальной `afterEach` нет — без ручного `cleanup` между тестами в DOM накапливаются старые деревья.
- Заглушка **`SpeechSynthesisUtterance`** для кода, связанного с озвучкой.

## Хелперы (`@test-helpers`)

Публичный API в **`src/test/index.ts`** (алиас `@test-helpers` — см. [import-aliases.md](./import-aliases.md)):

- `AppStyleProviders` — тестовая композиция провайдеров интерфейса как в приложении: `ConfigProvider` (antd-тема из `getAntdThemeConfig(theme)`) + `ThemeProvider` (styled-components).
- `renderWithTheme` — `render` из RTL с обёрткой `AppStyleProviders`.
- `renderWithRouterTheme` — то же + `MemoryRouter` для сценариев с роутингом.

Импорты между верхнеуровневыми папками `src` — по баррелям, не из глубоких путей.

## Покрытие (coverage)

В **`vite.config.ts`** заданы пороги **80%** по строкам, функциям, веткам и операторам для включаемых в отчёт файлов (см. `test.coverage.include` / `exclude`).

Обновление снапшотов: например `npx vitest run путь/к/файлу.test.tsx --update` или флаг `-u` в watch-режиме.

## Git hooks (Husky)

После `npm install` срабатывает **`prepare`** и подключаются хуки из **`.husky/`**.

| Хук | Содержимое (суть) |
|-----|-------------------|
| **`pre-commit`** | `npm run lint`, затем `npx vitest run --changed` — линт по всему репозиторию и тесты, затронутые изменениями в git (аналог идеи «только изменённое»; полный прогон — вручную `npm run test`). |
| **`commit-msg`** | [commitlint](https://commitlint.js.org/) — формат сообщения по Conventional Commits (как в [README](../README.md)). |

Разовый коммит без проверок: `git commit --no-verify` (использовать осознанно).

### Если на `pre-commit` падает Vitest (например `Element type is invalid… undefined` в компоненте с роутингом)

1. Полный прогон без кэша: `npx vitest run --no-cache` (или отключить кэш: см. `vitest run --help --cache`).
2. Сверить окружение: удалить `node_modules`, заново `npm install` или `npm ci` по [политике зависимостей](../README.md).
3. Сравнить с CI: локально выполнить **`npm run test`** целиком — `pre-commit` вызывает **`vitest run --changed`** (только затронутые тесты); при расхождении смотреть полный прогон и незакоммиченные файлы.

## Типовые приёмы в этом репозитории

- **Модуль `fetch`** — в тестах API-клиента и интеграционных тестах с реальным стеком до `authClient` подменяется `vi.stubGlobal('fetch', …)` и проверяются URL, метод, тело и заголовки.
- **Сессия авторизации (Redux)** — в интеграционных тестах: `Provider` из `react-redux` с `setupStore()` или синглтоном `store`, при необходимости `AuthSessionInitializer` и мок `fetch`; в изолированных тестах UI — `setupStore` с `preloadedState` и при необходимости `vi.spyOn(store, 'dispatch')` для проверки thunk’ов.
- **Снапшоты** — для стабильной разметки виджетов; при намеренном изменении UI обновляйте снапшоты через `--update`.

Подробнее о структуре компонентов и страниц — [components.md](./components.md), [src-layout.md](./src-layout.md).
