# Задачи: exercise-select-rerender

План: [plan.md](./plan.md)

- [x] Добавить `WorkoutSessionChromeControlsContext` и `WorkoutSessionChromeStatusContext` с типами и хуками.
- [x] Подключить оба провайдера в `WorkoutLogicLayout`, убрать монолитный chrome-контекст.
- [x] Перевести селекторы контейнеров на соответствующие хуки контекста.
- [x] Обернуть `AppLayout` в `React.memo`.
- [x] Обновить баррели `contexts/index.ts`, `logic/index.ts`; удалить старый `WorkoutSessionChrome/`.
