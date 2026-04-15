# План: колокация hooks, exercises и services главной

## 1. Контекст

Хуки `useWorkoutSession`, `useSpeechRecognition`, `useCameraStream`, реестр и детекторы упражнений, `PoseLandmarkerService` используются только потоком тренировки на главной. Ранее они лежали в корне `src/hooks`, `src/exercises`, `src/services`.

## 2. Цель

- Перенести **`src/hooks`**, **`src/exercises`**, **`src/services`** в **`src/pages/HomePage/`** с сохранением баррелей `index.ts`.
- Чтобы **`src/utils/pose.ts`** не зависел от `pages/`, тип **`ExerciseRuntimeState`** вынести в **`src/types/exerciseRuntime.ts`**; `exercises/types` и баррель реэкспортируют его наружу.
- **`exercises/types`** импортирует **`PoseLandmarks`** напрямую из **`src/utils/pose`** (без цепочки через `services`).
- **Наблюдаемое поведение не меняется.**

## 3. Проверка

- `npm run build`, `npm test`.
- Ручная проверка главной: камера, счёт, голос, смена упражнения.

## 4. Документация

- Обновить **`README.md`**, **`docs/architecture.md`**, при необходимости **`CONSTITUTION.md`**, **`docs/voice-commands.md`**, **`docs/markdown-paths.md`**, **`docs/src-layout.md`**.
