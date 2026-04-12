# Задачи: один контейнер — один презентационный компонент и локальные стили

План: `./plan.md`.

## Чеклист

- [x] Создать `src/components/Stage/` (`Stage.tsx`, `Stage.css`, `index.ts`): разметка и классы, перенесённые из `StageContainer` и соответствующий фрагмент `App.css`; обновить баррель `src/components/index.ts`.
- [x] Упростить `StageContainer` до вызова селектора и одного корня `<Stage … />`.
- [x] Создать `src/components/WorkoutStatusBar/` (или согласованное имя из плана) с разметкой и стилями, перенесёнными из `StatusBarContainer` и `App.css`; обновить баррель.
- [x] Упростить `StatusBarContainer` до одного дочернего презентационного компонента.
- [x] Создать `src/components/ExerciseControlBar/` с разметкой и стилями, перенесёнными из `ExerciseControlBarContainer` и `App.css`; обновить баррель.
- [x] Упростить `ExerciseControlBarContainer` до одного дочернего презентационного компонента.
- [x] Удалить из `App.css` перенесённые правила; оставить только глобальные и то, что относится к слоту `header` (или другой явно оговорённый остаток).
- [x] Согласовать классы секций `AppLayout` с новой схемой (вариант A или B из плана) без визуальной регрессии.
- [x] Обновить `docs/src-layout.md` (при необходимости `docs/components.md`) в соответствии с новой схемой.
- [x] Прогнать `npm test` и `npm run build`; ручная проверка UI по плану.

После выполнения в рамках цикла рефакторинга: перенос каталога в `specs/refactor/_archive/containers-single-view-and-local-styles/` третьим коммитом и правка относительных ссылок в markdown при необходимости.
