# Задачи: вынести умную логику в `WorkoutLogicLayout` (контексты и контейнеры)

> **Сейчас:** см. **`src/modules/HomeModule/`** и срез **`home`**.

План: [./workout-logic-layout-plan.md](./workout-logic-layout-plan.md)

## Чеклист

- [x] Проанализировать `src/hooks/useWorkoutSession.ts` (и при необходимости `useSpeechRecognition`): высокочастотные обновления; граница chrome / stage — см. комментарии в `src/contexts/WorkoutSessionStage/` или план.
- [x] Два **`React.Context`** в **`src/contexts/<Имя>/`** (chrome и stage), баррель **`src/contexts/index.ts`**; селекторы — хуки **`use…ContainerSelector`** в **`src/selectors/<Имя>Selector/`**, баррель **`src/selectors/index.ts`**; без сторонних npm-пакетов.
- [x] Каждый контейнер в **`src/containers/<PascalCaseName>/`**: `<Name>.tsx` + **`index.ts`**; баррель **`src/containers/index.ts`**; в **`src/logic/index.ts`** — **`WorkoutLogicLayout`** и явные реэкспорты **`useExerciseControlBarContainerSelector`**, **`useStatusBarContainerSelector`**, **`useStageContainerSelector`** (и при необходимости типов) для импорта контейнерами из **`../logic`** (без `export *`).
- [x] **`WorkoutLogicLayout`** в **`src/logic/WorkoutLogicLayout/`** (`WorkoutLogicLayout.tsx` + **`index.ts`**): хуки, провайдеры, проп **`children`** (`ReactNode`); **`aria-busy`** на **`div.stage-container`** в **`StageContainer`**, без **`cloneElement`** — см. план §1, §5 и §6.
- [x] **`App.tsx`**: `import './App.css'`; **`<WorkoutLogicLayout><AppLayout` … `/></WorkoutLogicLayout>`**; **`AppLayout`** из `./components`, контейнеры из **`./containers`**, **`WorkoutLogicLayout`** из **`./logic`**.
- [x] Баррели и импорты между папками `src` по правилам репозитория.
- [x] `npm run lint`, `npm test`, `npm run build`; ручная проверка сценариев.

Архив: каталог задачи перенесён в `specs/refactor/_archive/workout-logic-layout/` (третий коммит цикла).
