# Задачи: вынести умную логику в `WorkoutLogicLayout` (контексты и контейнеры)

План: [./workout-logic-layout-plan.md](./workout-logic-layout-plan.md)

## Чеклист

- [ ] Проанализировать `src/hooks/useWorkoutSession.ts` (и при необходимости `useSpeechRecognition`): высокочастотные обновления; граница chrome / stage — см. комментарии в `src/logic/workoutSessionStageContext.ts` или план.
- [ ] Два **`React.Context`** (chrome и stage) в **`src/logic/`**, селекторы на `useContext` + `useMemo`; без сторонних npm-пакетов.
- [ ] Каждый контейнер в **`src/containers/<PascalCaseName>/`**: `<Name>.tsx` + **`index.ts`**; баррель **`src/containers/index.ts`**; в **`src/logic/index.ts`** — **`WorkoutLogicLayout`** и явные реэкспорты хуков-селекторов для импорта контейнерами из **`../logic`** (без `export *`).
- [ ] **`WorkoutLogicLayout`** в **`src/logic/WorkoutLogicLayout.tsx`**: хуки, провайдеры, проп **`children`** (ожидается `AppLayout`); проброс **`stageAriaBusy`** через **`cloneElement`** или render-prop — см. план §1 и §5.
- [ ] **`App.tsx`**: `import './App.css'`; **`<WorkoutLogicLayout><AppLayout` … `/></WorkoutLogicLayout>`**; **`AppLayout`** из `./components`, контейнеры из **`./containers`**, **`WorkoutLogicLayout`** из **`./logic`**.
- [ ] Баррели и импорты между папками `src` по правилам репозитория.
- [ ] `npm run lint`, `npm test`, `npm run build`; ручная проверка сценариев.

Архив: после завершения перенести каталог в `specs/refactor/_archive/workout-logic-layout/` третьим коммитом цикла (см. корневой `README.md`).
