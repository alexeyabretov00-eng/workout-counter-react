# Задачи: колокация компонентов страниц и оболочки

Ссылка на план: [plan.md](./plan.md).

## Чеклист

- [x] Создать `src/App/components/`, перенести `AppNav` из `src/components/AppNav`, добавить баррель `App/components/index.ts`, обновить `AppPageLayout`.
- [x] Перенести `ExerciseControlBar`, `Stage`, `WorkoutStatusBar` в `src/pages/HomePage/components/`, обновить импорты примитивов из `src/components`.
- [x] Обновить баррель `src/pages/HomePage/components/index.ts` и импорты в контейнерах главной (`pages/HomePage/containers`, после переноса слоёв сессии).
- [x] Обновить `src/components/index.ts` (убрать перенесённое).
- [x] Обновить `docs/components.md` (примеры путей и назначение каталога).
- [x] `npm run build` и `npm test`.
