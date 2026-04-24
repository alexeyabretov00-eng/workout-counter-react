# План: переход UI на Ant Design (antd)

## 1. Контекст

- Сейчас интерфейс на **`styled-components`** и **собственной теме** (`src/theme/theme.ts`, `src/theme/globalStyle.tsx`), отдельной библиотеки компонентов нет: общие **`Button`**, **`Select`**, **`Badge`** в `src/components`, модули с `*.styled.tsx` (около 17 файлов), корень приложения в `src/App/App.tsx` с `ThemeProvider` и `GlobalStyle`.
- Цель — **снизить сопровождение** базовых контролов и форм за счёт **antd**, сопоставив токены с текущей палитрой и типографикой, и **сохранить** поведение (роутинг, Redux, сессия тренировки) и по возможности визуальную близость.

## 2. Цели

- Подключить **antd** (актуальная **5.x** или сознательно **6.x** — зафиксировать в чеклисте после спайка) с **`ConfigProvider`** и маппингом **`theme`** из токенов, согласованных с `src/theme/theme.ts`.
- Постепенно заменить **общие** компоненты и **оболочки** (формы логина/регистрации, layout приложения, shell страниц) на примитивы antd (`Button`, `Form`, `Input`, `Layout`, `Typography`, `Space`/`Flex`, при необходимости `Tag`/`Alert` и т.д.).
- **Смешанный стек** на время миграции: там, где antd не даёт выгода (сцена с камерой, кастомные панели Home), **оставить** `styled-components` и существующие `*.styled.tsx`, подключая antd точечно.
- **Тесты и Storybook**: единая обёртка с `ConfigProvider` (расширить `src/test/renderWithTheme.tsx` или ввести `renderWithProviders`), обновлённые снапшоты.
- **Зависимости**: в `package.json` — **точные версии**; после изменения — по правилу репозитория: чистая переустановка `node_modules` (см. `README` / `.cursor/rules/dependency-install-clean-reinstall`).

## 3. Вне скоупа (на этом плане)

- Реализация замены компонентов (второй коммит цикла по `tasks.md`). Этот документ — **только план и критерии**; чеклист — в [./tasks.md](./tasks.md).

## 4. Предварительные проверки (фаза 0)

- Совместимость **React 19.2** с выбранной веткой antd (`peerDependencies`, changelog).
- Мини-спайк: импорт antd, `ConfigProvider` в корне, `npm run build` / `npm test` без замены UI.
- При использовании **`DatePicker` / `TimePicker` / `Calendar`**: подключение **`dayjs`** и локали по документации antd (если эти компоненты войдут в скоуп позже).

## 5. Фундамент (фаза 1)

- Обернуть дерево приложения в **`ConfigProvider`** (рядом с Redux `Provider`), с **`theme`**, отражающим:
  - цвета (`colorPrimary`, текст, фон layout, semantic success/warning/error/info);
  - **`borderRadius`**, **`fontFamily`** (сейчас Inter в `src/theme/theme.ts`);
  - при необходимости **`controlHeight`** (в теме задано `38px`).
- Согласовать **`GlobalStyle`** с глобальным сбросом/стилями antd, чтобы не дублировать и не ломать каскад.
- **Импорты**: предпочитать **tree-shakable** импорты из `antd` / `antd/es/...` по соглашению команды; контролировать бандл (`npm run build:analyze` при необходимости).

## 6. Порядок замены (фаза 2–3)

1. **`src/components`**: `Button` → `Select` → `Badge` (как тонкие обёртки над antd или прямые реэкспорты с единой точки входа).
2. **`App`**: `AppPageLayout`, `AppNav` / `AppNavContainer`.
3. **Auth**: `LoginModule` (форма, shell), `RegistrationModule` (форма, shell).
4. **Простые страницы**: `AdminModule`, `ExerciseHistoryModule` (shell, stub).
5. **`HomeModule`**: `HomeLayout`, `ExerciseControlBar`, `WorkoutStatusBar` (часто с сохранением части `styled`); `Stage` — по необходимости в последнюю очередь.

## 7. Критерии готовности реализации (когда чеклист закрыт)

- Поведение приложения (навигация, авторизация, сценарии тренировки) **сохранено**; визуал **согласован** с планом темы (допустимы небольшие отличия, зафиксированные в ревью).
- **`npm run lint`**, **`npm test`**, **`npm run build`** проходят.
- Документация и правила про компоненты (`.cursor/rules/components.mdc`, при необходимости `docs/components.md`) **обновлены в том же цикле**, если изменилась конвенция (antd-first + styled для исключений).

## 8. Ссылки

- Активные рефакторинги: `specs/refactor/README.md`
- Пути в markdown: `docs/markdown-paths.md`
- Тема приложения: `src/theme/theme.ts`, `src/theme/globalStyle.tsx`
- Вход приложения: `src/App/App.tsx`
- Тестовый рендер: `src/test/renderWithTheme.tsx`

Каталог плана и чеклиста в архиве: `specs/refactor/_archive/antd-migration/` (см. `specs/README.md`).
