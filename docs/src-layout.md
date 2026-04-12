# Структура папок в `src`: логика экрана, контексты, селекторы, контейнеры

Соглашения для каталогов **`src/logic`**, **`src/contexts`**, **`src/selectors`**, **`src/containers`** — оркестрация экрана тренировки, React-контексты, хуки-селекторы для слотов layout и компоненты-слоты без пропсов данных сессии. Для агента ИИ краткие обязательные пункты продублированы в [.cursor/rules/src-layout.mdc](../.cursor/rules/src-layout.mdc) (как у UI — `components.mdc`); контекст рефакторинга — [specs/refactor/_archive/workout-logic-layout/workout-logic-layout-plan.md](../specs/refactor/_archive/workout-logic-layout/workout-logic-layout-plan.md).

Общее правило импортов: **между папками верхнего уровня `src/*`** — только из **барреля** (`index.ts`) соответствующей папки, **без** `export *`, только явные `export { … }` и `export type { … }`. См. также раздел **«Соглашение по импортам»** в [README.md](../README.md).

Презентационные атомарные виджеты UI — по соглашению **`src/components`**: [docs/components.md](components.md).

---

## `src/logic`

- Назначение: компоненты и модули **оркестрации** экрана (хуки сессии, голоса, провайдеры контекста), **без** презентационных слотов в духе кнопок из `components`.
- Публичная точка входа каталога: **`src/logic/index.ts`** — реэкспорт того, что должны импортировать контейнеры и `App` (например `WorkoutLogicLayout` и хуки `use…ContainerSelector` из `../selectors`, типы контекста из `../contexts`).
- **Один публичный компонент логики — одна подпапка в PascalCase** (как у UI-компонентов):

| Файл | Назначение |
|------|------------|
| `<Name>/<Name>.tsx` | Реализация (хуки, провайдеры) |
| `<Name>/index.ts` | Явный реэкспорт публичного API папки |

Пример: `src/logic/WorkoutLogicLayout/`.

- Снаружи `logic` импорт только из **`./logic`**, не из **`./logic/WorkoutLogicLayout/…`**.

---

## `src/contexts`

- Назначение: **`React.createContext`**, типы значения контекста и при необходимости хук **`use…Context`** с проверкой провайдера (throw, если `null`).
- **Каждый контекст — своя подпапка** в PascalCase (например `WorkoutSessionChrome`, `WorkoutSessionStage`); внутри — файлы контекста, типов, хука потребления, **`index.ts`** с явными реэкспортами.
- Баррель каталога: **`src/contexts/index.ts`** — единственная точка импорта контекстов для кода **вне** подпапок (например из `WorkoutLogicLayout` — **`../../contexts`** относительно файла в `logic/WorkoutLogicLayout/`).

---

## `src/selectors`

- Назначение: хуки **`use<ИмяКонтейнера>ContainerSelector`** для контейнеров слотов: внутри `useContext` + `useMemo` по полям контекста (без сторонних библиотек селекторов, если проект так не договорился отдельно).
- **Каждый селектор — своя подпапка** в PascalCase с суффиксом **`Selector`** (например `ExerciseControlBarContainerSelector`, `StatusBarContainerSelector`, `StageContainerSelector`).

| Файл | Назначение |
|------|------------|
| `<Name>/use…ContainerSelector.ts` | Реализация хука |
| `<Name>/index.ts` | `export { use…ContainerSelector } from '…'` |

- Баррель: **`src/selectors/index.ts`**.
- Контейнеры по соглашению импортируют селекторы из **`../logic`** (реэкспорт из `logic/index.ts`), а не напрямую из `./selectors`, чтобы сохранить одну привычную точку для «всё про экран тренировки».

---

## `src/containers`

- Назначение: компоненты **слотов** layout (`AppLayout`: `controls`, `statusBar`, `stage` и т.д.): подключаются к данным **только** через **`use…ContainerSelector`**, **без пропсов** состояния сессии (кроме того, что приходит из React-контекста внутри селектора).
- Структура **как у `src/components`**: одна папка на контейнер в PascalCase, **`ContainerName/ContainerName.tsx`**, **`ContainerName/index.ts`**, баррель **`src/containers/index.ts`**.
- Стили: классы страницы/секций могут оставаться в `App.css`; специфичные стили виджета — по аналогии с компонентами, если появятся.
- Импорт в `App` и т.п.: только из **`./containers`**.

---

## Сводная таблица «куда класть новое»

| Что добавляете | Каталог | Подпапка |
|----------------|---------|----------|
| Новый контекст сессии / экрана | `src/contexts` | `<ContextName>/` |
| Новый селектор под контейнер слота | `src/selectors` | `<ContainerName>Selector/` |
| Новый слот с доступом к сессии | `src/containers` | `<ContainerName>/` |
| Новый оркестратор с хуками | `src/logic` | `<LogicName>/` |
| Переиспользуемый кусок UI без логики сессии | `src/components` | см. [components.md](components.md) |

После добавления публичной сущности обновляйте соответствующий **`index.ts`** барреля в **той же задаче**.
