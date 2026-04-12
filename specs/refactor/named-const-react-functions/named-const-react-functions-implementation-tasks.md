# Задачи: именованный `const` для React-компонентов и хуков слоя экрана

План: [./named-const-react-functions-plan.md](./named-const-react-functions-plan.md)

## Чеклист

- [ ] Селекторы: `useStageContainerSelector.ts`, `useStatusBarContainerSelector.ts`, `useExerciseControlBarContainerSelector.ts` — `export const use… = () => { … }`.
- [ ] Контексты: `WorkoutSessionChromeControlsContext.tsx`, `WorkoutSessionChromeStatusContext.tsx`, `WorkoutSessionStageContext.tsx` — хуки `use…Context` в стиле `export const … = () => { … }`.
- [ ] Контейнеры: `StageContainer.tsx`, `StatusBarContainer.tsx`, `ExerciseControlBarContainer.tsx` — `export const … = () => { … }`.
- [ ] Компоненты: `Button.tsx`, `Select.tsx` — `export const …`; `AppLayout.tsx` — внутренняя реализация через `const AppLayoutComponent = (…) => …`, сохранить `memo` и `displayName` по плану.
- [ ] Логика: `WorkoutLogicLayout.tsx` — `export const WorkoutLogicLayout = …`.
- [ ] Убедиться, что баррели и импорты между папками `src` не ломаются (имена экспортов прежние).
- [ ] `npm run lint`, `npm test`, `npm run build`; краткая ручная проверка UI (см. план §5).

Архив: после завершения перенести каталог в `specs/refactor/_archive/named-const-react-functions/` третьим коммитом цикла (см. корневой `README.md`).
