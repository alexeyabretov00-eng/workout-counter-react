# План: модули для Admin, Exercise History и Home (тренировка)

## Контекст

Паттерн «доменный модуль в `src/modules/<ИмяModule>` + тонкая страница в `src/pages/<Page>`» уже применён для входа и регистрации. Нужно выровнять **Admin**, **Exercise History** и экран **тренировки (бывший монолит под `pages/HomePage`)**.

## Цели

- **`AdminModule`**, **`ExerciseHistoryModule`**: перенести прежнее содержимое страниц в модуль; публичный экспорт только `AdminModule` / `ExerciseHistoryModule`; страницы подключают `@modules/…`.
- **`HomeModule`**: перенести **все слои** экрана тренировки (`logic`, `contexts`, `selectors`, `containers`, `components`, `hooks`, `exercises`, `services`, тесты) из `src/pages/HomePage/` в **`src/modules/HomeModule/`**, сохранив внутреннюю структуру и относительные импорты. В **`src/pages/HomePage/`** остаются только маршрутизация (`index.tsx`), ленивая загрузка (`HomePageLazy.tsx`) и тонкий **`HomePage.tsx`**, рендерящий `HomeModule`.
- Обновить **`docs/src-layout.md`**, **`.cursor/rules/src-layout.mdc`**, **`docs/import-aliases.md`**, **`README.md`**, **`docs/architecture.md`** и прочие упоминания путей `pages/HomePage/…` на `modules/HomeModule/…` там, где речь о слоях сессии.
- Исключения в **`vite.config.ts`** (coverage) — новые пути под `HomeModule`.

## Не цели

- Смена поведения UI и маршрутов.
- Переименование папки страницы `HomePage` (глоб по-прежнему `../pages/*/index.tsx`).

## Проверка

- `npm run lint`, `npm test`, `npm run build`.
