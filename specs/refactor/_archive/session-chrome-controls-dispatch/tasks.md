# Задачи: единый `dispatch` для chrome-контролов сессии

> **Сейчас:** см. `src/store/home/controlActionTypes.ts` (`WorkoutSessionControlsAction`), `HomeModuleConstants` (`EVENT_WORKOUT_SESSION_CONTROLS_COMMAND`), подписка в `WorkoutLogicLayout`.

План: [./plan.md](./plan.md)

## Чеклист

- [x] Описать union **`WorkoutSessionChromeControlAction`** (или согласованное имя) и сигнатуру **`dispatch`**; обновить **`WorkoutSessionChromeControlsValue`**: убрать четыре колбека, добавить поле **`dispatch`**.
- [x] Реализовать **`dispatch`** в **`WorkoutLogicLayout`** (`switch` по `action.type` → вызовы **`useWorkoutSession`**); обновить **`useMemo`** для **`controlsValue`** и зависимости.
- [x] Обновить **`useExerciseControlBarContainerSelector`**: отдавать **`dispatch`**, убрать четыре поля из объекта и из deps **`useMemo`**.
- [x] Обновить **`ExerciseControlBarContainer`**: вызовы **`dispatch({ type: … })`** вместо четырёх функций.
- [x] Обновить **`useSpeechRecognition`** и вызов из **`WorkoutLogicLayout`** (предпочтительно — один параметр **`dispatch`** и **`ref`** на него внутри хука; см. план §3.3).
- [x] Проверить баррели **`src/contexts/WorkoutSessionChromeControls/index.ts`**, **`src/contexts/index.ts`**, при необходимости **`src/logic/index.ts`**.
- [x] **`npm run lint`**, **`npm test`**, **`npm run build`**; ручная проверка сценариев из плана §4.

Каталог перенесён в `specs/refactor/_archive/session-chrome-controls-dispatch/` (третий коммит цикла).
