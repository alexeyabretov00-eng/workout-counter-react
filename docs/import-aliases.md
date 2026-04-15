# Алиасы путей и импорты в `src`

Префиксы **`@…`** сопоставляются с каталогами под `src/` в **`tsconfig.app.json`** (`compilerOptions.paths`) и в **`vite.config.ts`** (`resolve.alias`), чтобы в коде не таскать длинные относительные пути между верхнеуровневыми папками.

Общие правила баррелей (`index.ts`, без `export *`) по-прежнему действуют — см. [.cursor/rules/imports-via-index.mdc](../.cursor/rules/imports-via-index.mdc).

## Таблица алиасов (как писать в импортах)

В TypeScript-импортах ориентируйтесь на **`tsconfig.app.json`**: в коде используйте именно эти префиксы.

| Префикс      | Каталог в репозитории |
|-------------|------------------------|
| `@api`      | `src/api`              |
| `@app`      | `src/App`              |
| `@components` | `src/components`     |
| `@contexts` | `src/contexts`         |
| `@pages`    | `src/pages`            |
| `@routes`   | `src/routes`           |
| `@theme`    | `src/theme`            |
| `@types`    | `src/types`            |
| `@utils`    | `src/utils`            |

**Подпути:** в конфиге заданы только корни (`"@utils": ["./src/utils"]` и т.д.). Глубокие импорты вроде `@utils/something` не описаны отдельными шаблонами — для типов и утилит по возможности импортируйте из **барреля** (`@utils`, `@types`), а не из конкретного файла, если сущность уже реэкспортирована в `index.ts`.

## Когда использовать алиасы

- Переход из **любого** файла под `src/` в **другую верхнеуровневую** папку `src/*` (например из `pages/...` в `src/utils`, из `App` в `src/contexts`) — через соответствующий **`@…`** и баррель, а не через `../../../utils`.
- Точка входа приложения: например `import { App } from '@app'` (баррель `src/App/index.ts`).

## Относительные импорты с `..` (и с `./`)

Используйте **`./` и `..`**, когда связь **локальная** — внутри одной фичи, одной подсистемы страницы или пары «компонент + стили».

### `./` — рядом по файловой системе

- Компонент и его **`*.styled.tsx`**: `import { … } from './Component.styled'`.
- Баррель подпапки: `export { X } from './X'` в том же каталоге.
- `main.tsx` может импортировать из `@app` вместо `./App` — оба варианта локальны к корню `src`; в проекте для корня принят алиас `@app`.

### `..` — на уровень выше, без выхода на другой «корень» `src/*`

Типичные случаи:

1. **Страница `HomePage`** — подсистемы `logic`, `contexts`, `selectors`, `containers`, `hooks`, `components`, `exercises`, `services` лежат под **`src/pages/HomePage/`**. Импорты между ними часто выглядят как **`../../contexts`**, **`../exercises`**, **`../../components`** и т.п. — это путь к **`pages/HomePage/contexts`**, **`pages/HomePage/exercises`**, **`pages/HomePage/components`**, а **не** к глобальным `src/contexts` или `src/components`.

2. **Селекторы / контейнеры / логика главной** — импорт контекстов и хуков страницы через относительный путь к баррелю **`pages/HomePage/contexts/index.ts`** (например `../../contexts` из файла в `selectors/.../`), а не через глобальный `@contexts` (тот относится к **`src/contexts`**, например сессия авторизации).

3. **Детекторы упражнений** — `import type { ExerciseDetector } from '../types'` указывает на **`pages/HomePage/exercises/types.ts`**, а не на `src/types`.

### Как не перепутать глобальный `@contexts` и локальный `../contexts`

| Нужен модуль | Пример импорта |
|--------------|----------------|
| Auth-сессия, `useAuthSessionContext` | `from '@contexts'` → `src/contexts` |
| Контексты сессии тренировки на главной | `from '../../contexts'` (от файла внутри `HomePage/...`) → `pages/HomePage/contexts` |

Аналогично: **`@components`** — общие UI-примитивы в **`src/components`**; **`../../components`** из контейнера главной — виджеты экрана в **`pages/HomePage/components`**.

### Когда `..` не подходит

Если из файла вы «вылезаете» из своей ветки к **другой верхнеуровневой папке** `src/api`, `src/utils`, `src/types`, … — используйте **алиас**, а не длинную цепочку `../../../`.

---

См. также: раздел **«Соглашение по импортам»** в [README.md](../README.md), структура главной — [docs/src-layout.md](src-layout.md).
