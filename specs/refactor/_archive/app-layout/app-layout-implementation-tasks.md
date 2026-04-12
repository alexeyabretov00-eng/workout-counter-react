# Задачи: ввести `AppLayout`

План: [./app-layout-plan.md](./app-layout-plan.md)

## Чеклист

- [x] Создать `src/components/AppLayout/AppLayout.tsx`: `<main>` и четыре `<section>` со слотами `header`, `controls`, `statusBar`, `stage` (`ReactNode`).
- [x] Добавить `src/components/AppLayout/AppLayout.css` со стилями корневой раскладки страницы (перенос с текущего `.app` из `src/App.css`); импортировать CSS в `AppLayout.tsx`; на разметке использовать явные классы (например BEM `app-layout`, `app-layout__section`, …), согласованные с планом.
- [x] Добавить `src/components/AppLayout/index.ts` с явным реэкспортом `AppLayout`.
- [x] Добавить в `src/components/index.ts` явный реэкспорт из `./AppLayout`.
- [x] Обновить `src/App.tsx`: импорт `AppLayout` из `./components`, передать текущие четыре блока разметки слотами; убрать дублирующую структуру `<main>` / обёртку, заменённую `AppLayout`.
- [x] Удалить из `src/App.css` правила, перенесённые в `AppLayout.css`; убедиться, что секционные стили (controls, status-bar, stage и т.д.) по-прежнему применяются.
- [x] Запустить тесты и сборку; ручная проверка UI без регрессии.

Архив: каталог задачи перенесён в `specs/refactor/_archive/app-layout/` (третий коммит цикла).
