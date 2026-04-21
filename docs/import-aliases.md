# Алиасы путей и импорты в `src`

Префиксы **`@…`** сопоставляются с каталогами под `src/` в **`tsconfig.app.json`** (`compilerOptions.paths`) и в **`vite.config.ts`** (`resolve.alias`), чтобы в коде не таскать длинные относительные пути между верхнеуровневыми папками.

Общие правила баррелей (`index.ts`, без `export *`) по-прежнему действуют — см. [.cursor/rules/imports-via-index.mdc](../.cursor/rules/imports-via-index.mdc).

**Порядок импортов в PR:** в линтере включены `simple-import-sort/imports` и `simple-import-sort/exports` (см. раздел про линтинг в [README.md](../README.md)). Если `npm run lint` ругается на порядок, выполните `npx eslint . --fix` или расставьте блоки вручную: сначала внешние пакеты, затем внутренние/алиасы, затем относительные импорты; пустая строка между группами — по правилам плагина.

## Таблица алиасов (как писать в импортах)

В TypeScript-импортах ориентируйтесь на **`tsconfig.app.json`**: в коде используйте именно эти префиксы.

| Префикс      | Каталог в репозитории |
|-------------|------------------------|
| `@api`      | `src/api`              |
| `@app`      | `src/App`              |
| `@components` | `src/components`     |
| `@pages`    | `src/pages`            |
| `@store`    | `src/store` (Redux store, селекторы срезов `auth`, `workoutSessionChrome`, хуки, thunk'и) |
| `@routes`   | `src/routes`           |
| `@test-helpers` | `src/test` (хелперы для тестов) |
| `@theme`    | `src/theme`            |
| `@types`    | `src/types`            |
| `@utils`    | `src/utils`            |
| `@modules/<ИмяModule>` | `src/modules/<ИмяModule>` (доменные модули приложения, суффикс `Module` в имени папки) |

**Подпути:** в конфиге заданы корни (`"@utils": ["./src/utils"]` и т.д.) и шаблон **`"@modules/*": ["./src/modules/*"]`** для модулей. Глубокие импорты вроде `@utils/something` не описаны отдельными шаблонами — для типов и утилит по возможности импортируйте из **барреля** (`@utils`, `@types`), а не из конкретного файла, если сущность уже реэкспортирована в `index.ts`. Для модулей используйте **`@modules/<ИмяModule>`** и баррель модуля.

## Когда использовать алиасы

- Переход из **любого** файла под `src/` в **другую верхнеуровневую** папку `src/*` (например из `pages/...` в `src/utils`, из `App` в `src/store`) — через соответствующий **`@…`** и баррель, а не через `../../../utils`.
- Точка входа приложения: например `import { App } from '@app'` (баррель `src/App/index.ts`).
- Модули приложения: например `import { LoginModule } from '@modules/LoginModule'` — публичное API только из барреля `src/modules/<ИмяModule>/index.ts` (см. [docs/modules.md](modules.md)).

## Относительные импорты с `..` (и с `./`)

Используйте **`./` и `..`**, когда связь **локальная** — внутри одной фичи, одной подсистемы страницы или пары «компонент + стили».

### `./` — рядом по файловой системе

- Компонент и его **`*.styled.tsx`**: `import { … } from './Component.styled'`.
- Баррель подпапки: `export { X } from './X'` в том же каталоге.
- `main.tsx` может импортировать из `@app` вместо `./App` — оба варианта локальны к корню `src`; в проекте для корня принят алиас `@app`.

### `..` — на уровень выше, без выхода на другой «корень» `src/*`

Типичные случаи:

1. **Модуль `HomeModule`** (экран тренировки) — подсистемы `logic`, `contexts`, `selectors`, `containers`, `hooks`, `components`, `exercises`, `services` лежат под **`src/modules/HomeModule/`**. Импорты между ними часто выглядят как **`../../contexts`**, **`../exercises`**, **`../../components`** и т.п. — это путь к **`modules/HomeModule/contexts`**, **`modules/HomeModule/exercises`**, **`modules/HomeModule/components`**, а **не** к **`src/store`** / **`src/components`**.

2. **Контексты и хуки главной (HomeModule)** — импорт через относительный путь к баррелю **`modules/HomeModule/contexts/index.ts`** (например `../../contexts` из файла внутри модуля). Селекторы Redux для экрана — из **`modules/HomeModule/selectors/...`** (локальные хуки/селекторы модуля), не из **`@store`** напрямую в контейнерах, если принято склеивать через слой селекторов модуля.

3. **Детекторы упражнений** — `import type { ExerciseDetector } from '../types'` указывает на **`modules/HomeModule/exercises/types.ts`**, а не на `src/types`.

### Селекторы Redux и `HomeModule`

| Нужно | Пример импорта |
|--------------|----------------|
| Базовые поля срезов (`selectAuthUser`, `selectWorkoutSessionChrome`, …) | `from '@store'` |
| Комбинированные селекторы под оболочку приложения | `from './selectors'` рядом с **`App/…`** (папка **`src/App/selectors/`**) |
| Комбинированные селекторы под модуль (логин, регистрация, …) | `from './selectors'` внутри **`src/modules/<ИмяModule>/`** |
| Контексты сессии тренировки на главной (controls, stage; статус chrome — в `@store`) | `from '../../contexts'` (от файла внутри `HomeModule/...`) → `modules/HomeModule/contexts` |

Аналогично: **`@components`** — общие UI-примитивы в **`src/components`**; **`../../components`** из контейнера главной — виджеты экрана в **`modules/HomeModule/components`**.

### Когда `..` не подходит

Если из файла вы «вылезаете» из своей ветки к **другой верхнеуровневой папке** `src/api`, `src/utils`, `src/types`, … — используйте **алиас**, а не длинную цепочку `../../../`.

---

См. также: раздел **«Соглашение по импортам»** в [README.md](../README.md), структура главной — [docs/src-layout.md](src-layout.md).
