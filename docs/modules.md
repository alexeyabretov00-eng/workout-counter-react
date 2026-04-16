# Модули приложения (`src/modules`)

**Модуль** — переиспользуемый доменный срез приложения: всё необходимое для его работы живёт внутри `src/modules/<ИмяModule>/`, где имя в **PascalCase** и с суффиксом **`Module`** (например `LoginModule`, `RegistrationModule`).

- **Публичное API** — только из `src/modules/<ИмяModule>/index.ts` (явные реэкспорты, без `export *`); на границе модуля обычно экспортируется **одна** корневая сущность с тем же именем, что и модуль (например `export { LoginModule } from './LoginModule'`).
- **Импорт снаружи** — через алиас **`@modules/<ИмяModule>`** (см. [docs/import-aliases.md](import-aliases.md), настройки в `tsconfig.app.json` и `vite.config.ts`).
- **Страницы** подключают модуль как композицию; локальные `pages/<Page>/components` используются только для склейки модулей на экране (если страница не сведена к одному импорту модуля). Экран тренировки: слои **`HomeModule`** (`logic`, `contexts`, …) — в [docs/src-layout.md](src-layout.md); маршрут остаётся в `src/pages/HomePage/`.

Подробные определения, границы с `src/components` и примеры — в архивном плане рефакторинга: [`specs/refactor/_archive/app-modules/app-modules-plan.md`](../specs/refactor/_archive/app-modules/app-modules-plan.md).
