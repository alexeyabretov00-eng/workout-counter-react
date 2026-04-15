# Задачи: колокация слоёв сессии главной

Ссылка на план: [plan.md](./plan.md).

## Чеклист

- [x] Перенести `src/contexts/*` в `src/pages/HomePage/contexts/`, баррель `index.ts`.
- [x] Перенести `src/containers/*` и `src/selectors/*`, `src/logic/WorkoutLogicLayout` под `HomePage`; добавить `pages/HomePage/logic/index.ts`.
- [x] Обновить импорты (`WorkoutLogicLayout`, селекторы, контейнеры, `useSpeechRecognition`).
- [x] Удалить корневые `contexts`, `containers`, `selectors`, `logic` из `src`.
- [x] Обновить `docs/src-layout.md`, `README.md`, `docs/architecture.md`.
- [x] `npm run build` и `npm test`.
