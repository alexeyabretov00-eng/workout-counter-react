# Задачи: именованный `const` для React-компонентов и хуков слоя экрана

> **Сейчас:** актуальные пути — **`src/modules/HomeModule/`**; вместо контекстов `WorkoutSessionChrome*` — stage-контекст и стор **`workoutSessionControls`**.

План: [./named-const-react-functions-plan.md](./named-const-react-functions-plan.md)

## Чеклист

- [x] Селекторы: `useStageContainerSelector.ts`, `useStatusBarContainerSelector.ts`, `useExerciseControlBarContainerSelector.ts` — `export const use… = () => { … }`.
- [x] Контексты: `WorkoutSessionChromeControlsContext.tsx`, `WorkoutSessionChromeStatusContext.tsx`, `WorkoutSessionStageContext.tsx` — хуки `use…Context` в стиле `export const … = () => { … }`.
- [x] Контейнеры: `StageContainer.tsx`, `StatusBarContainer.tsx`, `ExerciseControlBarContainer.tsx` — `export const … = () => { … }`.
- [x] Компоненты: `Button.tsx`, `Select.tsx` — `export const …`; `AppLayout.tsx` — внутренняя реализация через `const AppLayoutComponent = (…) => …`, сохранить `memo` и `displayName` по плану.
- [x] Логика: `WorkoutLogicLayout.tsx` — `export const WorkoutLogicLayout = …`.
- [x] Убедиться, что баррели и импорты между папками `src` не ломаются (имена экспортов прежние).
- [x] `npm run lint`, `npm test`, `npm run build`; краткая ручная проверка UI (см. план §5).

Архив: каталог задачи перенесён в `specs/refactor/_archive/named-const-react-functions/` (третий коммит цикла).
