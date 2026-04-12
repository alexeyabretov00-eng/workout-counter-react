# План: единый стиль объявления — именованный `const` и `displayName` при необходимости

## 1. Контекст

В `src/components`, `src/containers`, `src/contexts`, `src/logic` и `src/selectors` часть сущностей объявлена как **`export function Name(…) { … }`** или как внутренняя **`function Name(…) { … }`**. Соглашение репозитория зафиксировано в `docs/components.md`, `docs/src-layout.md` и правилах `.cursor/rules/components.mdc`, `.cursor/rules/src-layout.mdc`:

- публичный API — **именованный** `const` со стрелочной функцией: `export const Name = (…) => { … }`;
- **`displayName`** — **только** если из‑за обёртки (`memo`, `forwardRef`, HOC) имя в React DevTools теряется.

Рефакторинг **не меняет** поведение приложения и публичные экспорты баррелей (`index.ts`): меняется только форма объявления.

## 2. Цель

- Привести перечисленные модули к описанному стилю.
- Сохранить осмысленные имена в DevTools (уже покрыто `displayName` у `AppLayout`; при новых обёртках — не забывать правило).
- Не трогать утилиты вне скоупа (например `src/utils/pose.ts` — там `export function` остаётся, это не React-компоненты и не хуки слоя экрана).

## 3. Объём (файлы)

| Каталог | Файл |
|---------|------|
| `src/selectors/StageContainerSelector/` | `useStageContainerSelector.ts` |
| `src/selectors/StatusBarContainerSelector/` | `useStatusBarContainerSelector.ts` |
| `src/selectors/ExerciseControlBarContainerSelector/` | `useExerciseControlBarContainerSelector.ts` |
| `src/contexts/WorkoutSessionChromeControls/` | `WorkoutSessionChromeControlsContext.tsx` |
| `src/contexts/WorkoutSessionChromeStatus/` | `WorkoutSessionChromeStatusContext.tsx` |
| `src/contexts/WorkoutSessionStage/` | `WorkoutSessionStageContext.tsx` |
| `src/containers/StageContainer/` | `StageContainer.tsx` |
| `src/containers/StatusBarContainer/` | `StatusBarContainer.tsx` |
| `src/containers/ExerciseControlBarContainer/` | `ExerciseControlBarContainer.tsx` |
| `src/components/Button/` | `Button.tsx` |
| `src/components/Select/` | `Select.tsx` |
| `src/components/AppLayout/` | `AppLayout.tsx` (внутренняя `AppLayoutComponent`: `function` → `const` + стрелка; `memo` / `displayName` без изменения смысла) |
| `src/logic/WorkoutLogicLayout/` | `WorkoutLogicLayout.tsx` |

Баррели `index.ts` править **не нужно**, если сигнатуры экспортов не меняются.

## 4. Порядок работ

1. **Селекторы** — простые хуки, без JSX.
2. **Контексты** — хуки `use…Context`.
3. **Контейнеры** — компоненты слотов.
4. **Компоненты** — `Button`, `Select`, затем `AppLayout`.
5. **Логика** — `WorkoutLogicLayout` (самый крупный файл в скоупе).

## 5. Критерии готовности

- В перечисленных файлах нет целевого паттерна `export function` / внутренней `function` для компонента или хука из скоупа (кроме случаев, если проект явно решит оставить исключение — в рамках этой задачи исключений не вводим).
- Для компонентов с **`memo`/`forwardRef`**: при необходимости явный **`displayName`** (как сейчас у `AppLayout`).
- `npm run lint`, `npm test`, `npm run build` проходят.
- Ручная проверка: старт сессии, смена упражнения, статус-бар, сцена с камерой — без визуальных и функциональных отличий.

## 6. Архивирование

Каталог задачи перенесён в `specs/refactor/_archive/named-const-react-functions/` (третий коммит цикла). Ссылки в markdown вне каталога — по `docs/markdown-paths.md`.
