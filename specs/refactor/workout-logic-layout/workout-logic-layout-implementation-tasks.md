# Задачи: вынести умную логику в `WorkoutLogicLayout` (контексты и контейнеры)

План: [./workout-logic-layout-plan.md](./workout-logic-layout-plan.md)

## Чеклист

- [ ] Проанализировать `src/hooks/useWorkoutSession.ts` (и при необходимости `useSpeechRecognition`): высокочастотные обновления; граница chrome / stage — см. комментарии в `workoutSessionStageContext.ts` или план.
- [ ] Два **`React.Context`** (chrome и stage), селекторы на `useContext` + `useMemo`; без сторонних npm-пакетов.
- [ ] Перенести каждый контейнер в **`src/WorkoutLogicLayout/containers/<PascalCaseName>/`**: `<Name>.tsx` + **`index.ts`** с явным экспортом; **`containers/index.ts`** — явные реэкспорты; **`WorkoutLogicLayout/index.ts`** — реэкспорт `WorkoutLogicLayout` и контейнеров (без `export *`).
- [ ] **`WorkoutLogicLayout`**: хуки, провайдеры, проп **`children`** (ожидается `AppLayout`); проброс **`stageAriaBusy`** через **`cloneElement`** или render-prop — см. план §1 и §5.
- [ ] **`App.tsx`**: `import './App.css'`; дерево **`<WorkoutLogicLayout><AppLayout` `header={…}` `controls={<ExerciseControlBarContainer />}` `statusBar={…}` `stage={…}` `/></WorkoutLogicLayout>`**; импорт **`AppLayout`** из `./components`, **`WorkoutLogicLayout`** и контейнеры из `./WorkoutLogicLayout`.
- [ ] Баррели и импорты между папками `src` по правилам репозитория.
- [ ] `npm run lint`, `npm test`, `npm run build`; ручная проверка сценариев.

Архив: после завершения перенести каталог в `specs/refactor/_archive/workout-logic-layout/` третьим коммитом цикла (см. корневой `README.md`).
