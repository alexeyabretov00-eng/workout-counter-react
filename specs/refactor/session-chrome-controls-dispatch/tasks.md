# Задачи: единый `dispatch` для chrome-контролов сессии

План: [./plan.md](./plan.md)

## Чеклист

- [ ] Описать union **`WorkoutSessionChromeControlAction`** (или согласованное имя) и сигнатуру **`dispatch`**; обновить **`WorkoutSessionChromeControlsValue`**: убрать четыре колбека, добавить поле **`dispatch`**.
- [ ] Реализовать **`dispatch`** в **`WorkoutLogicLayout`** (`switch` по `action.type` → вызовы **`useWorkoutSession`**); обновить **`useMemo`** для **`controlsValue`** и зависимости.
- [ ] Обновить **`useExerciseControlBarContainerSelector`**: отдавать **`dispatch`**, убрать четыре поля из объекта и из deps **`useMemo`**.
- [ ] Обновить **`ExerciseControlBarContainer`**: вызовы **`dispatch({ type: … })`** вместо четырёх функций.
- [ ] Обновить **`useSpeechRecognition`** и вызов из **`WorkoutLogicLayout`** (предпочтительно — один параметр **`dispatch`** и **`ref`** на него внутри хука; см. план §3.3).
- [ ] Проверить баррели **`src/contexts/WorkoutSessionChromeControls/index.ts`**, **`src/contexts/index.ts`**, при необходимости **`src/logic/index.ts`**.
- [ ] **`npm run lint`**, **`npm test`**, **`npm run build`**; ручная проверка сценариев из плана §4.

После завершения цикла: третий коммит — перенос каталога в `specs/refactor/_archive/session-chrome-controls-dispatch/` и правки относительных ссылок в markdown при необходимости.
