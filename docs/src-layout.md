# Структура папок в `src`: логика экрана, контексты, селекторы, контейнеры

Соглашения для **экрана тренировки** на главной: каталоги **`modules/HomeModule/logic`**, **`modules/HomeModule/contexts`**, **`modules/HomeModule/selectors`**, **`modules/HomeModule/containers`** — оркестрация, React-контексты, хуки-селекторы для слотов layout и компоненты-слоты без пропсов данных сессии. Слои живут в **`src/modules/HomeModule/`**; тонкая страница маршрута — **`src/pages/HomePage/HomePage.tsx`** (рендерит `HomeModule`). Для агента ИИ краткие обязательные пункты продублированы в [.cursor/rules/src-layout.mdc](../.cursor/rules/src-layout.mdc) (как у UI — `components.mdc`).

Общее правило импортов: **между папками верхнего уровня `src/*`** — только из **барреля** (`index.ts`) соответствующей папки, **без** `export *`, только явные `export { … }` и `export type { … }`; при переходе между такими папками используйте **алиасы** (`@utils`, `@types`, …), см. [docs/import-aliases.md](import-aliases.md). Внутри **`HomeModule`** импорты между подсистемами (`logic`, `contexts`, …) — тоже из баррелей подпапок модуля (часто через относительные пути с `..`, см. тот же документ). См. также раздел **«Соглашение по импортам»** в [README.md](../README.md).

Презентационные атомарные виджеты UI — по соглашению **`src/components`** (общие примитивы) и **`modules/HomeModule/components`** (виджеты главной): [docs/components.md](components.md).

## Стиль объявления функций

Функциональные компоненты в **`logic`** и **`containers`**, хуки в **`contexts`** и **`selectors`** оформляйте как **именованный** `const` со стрелочной функцией (`export const Name = … => { … }`). Свойство **`displayName`** задавайте **только** если имя в React DevTools теряется из‑за обёртки (`memo`, `forwardRef`, HOC и т.п.). Подробности и примеры — в [docs/components.md](components.md), раздел **«Объявление компонента (функция)»**.

---

## `modules/HomeModule/logic`

- Назначение: компоненты и модули **оркестрации** экрана тренировки (хуки сессии, голоса, провайдеры контекста), **без** презентационных слотов в духе кнопок из `components`.
- Публичная точка входа: **`modules/HomeModule/logic/index.ts`** — реэкспорт того, что должны импортировать контейнеры и `HomeModule` (`WorkoutLogicLayout`, хуки `use…ContainerSelector`, типы контекстов).
- **Один публичный компонент логики — одна подпапка в PascalCase** (как у UI-компонентов):

| Файл | Назначение |
|------|------------|
| `<Name>/<Name>.tsx` | Реализация (хуки, провайдеры) |
| `<Name>/index.ts` | Явный реэкспорт публичного API папки |

Пример: `modules/HomeModule/logic/WorkoutLogicLayout/`.

- Снаружи папки `logic` модуля импорт только из **`./logic`** (относительно корня `HomeModule`), не из **`./logic/WorkoutLogicLayout/…`**.

---

## `modules/HomeModule/contexts`

- Назначение: **`React.createContext`**, типы значения контекста и при необходимости хук **`use…Context`** с проверкой провайдера (throw, если `null`).
- **Каждый контекст — своя подпапка** в PascalCase (например `WorkoutSessionChromeControls`, `WorkoutSessionChromeStatus`, `WorkoutSessionStage`); внутри — файлы контекста, типов, хука потребления, **`index.ts`** с явными реэкспортами.
- Пример контракта **`WorkoutSessionChromeControls`**: значения для отображения плюс **`dispatchChromeControl`**, аргумент — union **`WorkoutSessionChromeControlAction`** (см. `modules/HomeModule/contexts/WorkoutSessionChromeControls/types.ts` и раздел **«Chrome-контролы»** в [architecture.md](architecture.md)).
- Баррель: **`modules/HomeModule/contexts/index.ts`** — точка импорта для кода вне подпапок контекста (например из `WorkoutLogicLayout` — **`../../contexts`** относительно файла в `logic/WorkoutLogicLayout/`).

---

## `modules/HomeModule/selectors`

- Назначение: хуки **`use<ИмяКонтейнера>ContainerSelector`** для контейнеров слотов: внутри `useContext` + `useMemo` по полям контекста (без сторонних библиотек селекторов, если проект так не договорился отдельно).
- **Каждый селектор — своя подпапка** в PascalCase с суффиксом **`Selector`** (например `ExerciseControlBarContainerSelector`, `StatusBarContainerSelector`, `StageContainerSelector`).

| Файл | Назначение |
|------|------------|
| `<Name>/use…ContainerSelector.ts` | Реализация хука |
| `<Name>/index.ts` | `export { use…ContainerSelector } from '…'` |

- Баррель: **`modules/HomeModule/selectors/index.ts`**.
- Контейнеры по соглашению импортируют селекторы из **`../logic`** (реэкспорт из `logic/index.ts`), а не напрямую из `./selectors`, чтобы сохранить одну привычную точку для «всё про экран тренировки».

---

## `modules/HomeModule/containers`

- Назначение: компоненты **слотов** `HomeLayout` (`controls`, `statusBar`, `stage` и т.д.): подключаются к данным **только** через **`use…ContainerSelector`**, **без пропсов** состояния сессии (кроме того, что приходит из React-контекста внутри селектора).
- Структура **как у `src/components`**: одна папка на контейнер в PascalCase, **`ContainerName/ContainerName.tsx`**, **`ContainerName/index.ts`**, баррель **`modules/HomeModule/containers/index.ts`**.
- Разметка слота: контейнер рендерит **один** презентационный компонент — из **`src/components`** (примитивы) или из барреля **`modules/HomeModule/components`** для виджетов главной (панель управления, статус-бар, сцена); стили виджета — **`<Имя>.styled.tsx`**, токены из **`src/theme`**. Глобальные правила — в **`GlobalStyle`** (`src/theme/globalStyle.tsx`).
- Импорт в `HomeModule.tsx`: только из **`./containers`** (путь к баррелю — относительно файла модуля).

---

## Сводная таблица «куда класть новое»

| Что добавляете | Каталог | Подпапка |
|----------------|---------|----------|
| Новый контекст сессии главной | `modules/HomeModule/contexts` | `<ContextName>/` |
| Новый селектор под контейнер слота главной | `modules/HomeModule/selectors` | `<ContainerName>Selector/` |
| Новый слот с доступом к сессии главной | `modules/HomeModule/containers` | `<ContainerName>/` |
| Новый оркестратор с хуками для главной | `modules/HomeModule/logic` | `<LogicName>/` |
| Переиспользуемый примитив / нейтральный виджет | `src/components` | см. [components.md](components.md) |
| Виджет экрана тренировки (главная) | `src/modules/HomeModule/components/` | тот же стиль папок, что у `components` |
| Хуки сессии / камеры / речи главной | `src/modules/HomeModule/hooks/` | баррель `hooks/index.ts` |
| Детекторы и реестр упражнений главной | `src/modules/HomeModule/exercises/` | баррель `exercises/index.ts` |
| Сервис pose landmarker главной | `src/modules/HomeModule/services/` | баррель `services/index.ts` |

После добавления публичной сущности обновляйте соответствующий **`index.ts`** барреля в **той же задаче**.

Код вне **`HomeModule`** при необходимости может импортировать **типы** контекстов главной из **`src/modules/HomeModule/contexts`**; хуки сессии и речь живут в **`src/modules/HomeModule/hooks`**.
