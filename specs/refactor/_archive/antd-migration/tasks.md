# Задачи: переход UI на Ant Design (antd)

План: [./plan.md](./plan.md)

**Зафиксировано:** `antd` **6.3.6** (peer: React ≥ 18, совместимо с React 19.2).

## Чеклист

### Фаза 0 — спайк

- [x] Проверить совместимость **React 19.2** с выбранной линейкой **antd**; зафиксировать в плане/задачах версию **antd** (и при необходимости **dayjs**).
- [x] Добавить **antd** в `package.json` (точная версия), `npm install` по правилам репозитория; **`npm run build`** и **`npm test`** проходят с **`ConfigProvider`** в `src/App/App.tsx`.

### Фаза 1 — фундамент

- [x] Ввести **`ConfigProvider`** в корне (рядом с Redux), прокинуть **`theme`** через **`getAntdThemeConfig`** (`src/theme/antdConfig.ts`).
- [x] **`src/theme/globalStyle.tsx`** — без жёсткого сброса antd (стили antd через CSS-in-JS); при необходимости донастроить позже.
- [x] **`AppStyleProviders`** (`src/test/appStyleProviders.tsx`) + **`renderWithTheme`** для тестов и Storybook.
- [x] Отдельный импорт стилей antd в **`main.tsx`** не требуется (antd 6 — CSS-in-JS).

### Фаза 2 — `src/components`

- [x] **`Button`** — **antd** `Button`.
- [x] **`Select`** — **antd** `Select` + **`SelectLabel`** в styled.
- [x] **`Badge`** — **antd** `Tag`.
- [x] **`ModuleScaffold`** — общая оболочка страниц модулей (**Layout** + **Typography.Title**).
- [x] **`src/components/index.ts`** — реэкспорты обновлены.

### Фаза 2 — `App`

- [x] **`AppPageLayout`** — **antd** `Layout` / `Content`.
- [x] **`AppNav`** — кнопка «Выйти» через **antd** `Button` `type="link"`.
- [x] Тесты — **`AppStyleProviders`**.

### Фаза 2 — страницы

- [x] Тонкие оболочки без обязательных правок (страницы подключают модули как раньше).

### Фаза 2 — Login / Registration

- [x] **`LoginForm`**, **`RegisterForm`** — **Form**, **Input**, **Input.Password**, **Alert**, **Button**.
- [x] **`LoginPageShell`**, **`RegisterPageShell`** — через **`ModuleScaffold`**.
- [x] Тесты и API-тесты обновлены (таймаут 20s для тяжёлых сценариев с antd `Input`).

### Фаза 2 — Admin, Exercise history

- [x] **`AdminPageShell`**, **`ExerciseHistoryPageShell`** — **`ModuleScaffold`**.
- [x] **`AdminPageStub`**, **`ExerciseHistoryPageStub`** — **Typography.Text**.

### Фаза 3 — Home

- [x] **`HomeLayout`** — **Flex** antd + секции в styled.
- [x] **`ExerciseControlBar`** — **Space** antd.
- [x] **`WorkoutStatusBar`** — через обновлённый **`Badge`** (Tag).
- [x] Снапшоты контейнеров при необходимости обновлены.

### Фаза 4 — зачистка и документация

- [x] Удалены неиспользуемые **`*.styled.tsx`** после замены.
- [x] **`styled-components`** оставлены для сцены, навигации, остаточных обёрток.
- [x] **`.cursor/rules/components.mdc`** — кратко про antd + `getAntdThemeConfig`.
- [x] **`npm run lint`**, **`npm test`**, **`npm run build`**.

### Архив

- [x] Каталог перенесён в `specs/refactor/_archive/antd-migration/`.

---

## Путевой указатель (основные файлы)

**Тема и вход:** `src/App/App.tsx`, `src/App/AuthSessionInitializer.tsx`, `src/main.tsx`, `src/theme/theme.ts`, `src/theme/antdConfig.ts`, `src/theme/globalStyle.tsx`  
**Тесты:** `src/test/appStyleProviders.tsx`, `src/test/renderWithTheme.tsx`, `src/test/setupTests.ts` (`matchMedia`, `ResizeObserver`)
