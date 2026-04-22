# Структура папок в `src`: логика экрана, контексты, селекторы, контейнеры

Соглашения для **экрана тренировки** на главной: каталоги **`modules/HomeModule/logic`**, **`modules/HomeModule/contexts`**, **`modules/HomeModule/selectors`**, **`modules/HomeModule/containers`** — оркестрация, React-контексты, хуки-селекторы для слотов layout и компоненты-слоты без пропсов данных сессии. Слои живут в **`src/modules/HomeModule/`**; тонкая страница маршрута — **`src/pages/HomePage/HomePage.tsx`** (рендерит `HomeModule`). Для агента ИИ краткие обязательные пункты продублированы в [.cursor/rules/src-layout.mdc](../.cursor/rules/src-layout.mdc) (как у UI — `components.mdc`).

Общее правило импортов: **между папками верхнего уровня `src/*`** — только из **барреля** (`index.ts`) соответствующей папки, **без** `export *`, только явные `export { … }` и `export type { … }`; при переходе между такими папками используйте **алиасы** (`@utils`, `@types`, …), см. [docs/import-aliases.md](import-aliases.md). Внутри **`HomeModule`** импорты между подсистемами (`logic`, `contexts`, …) — тоже из баррелей подпапок модуля (часто через относительные пути с `..`, см. тот же документ). См. также раздел **«Соглашение по импортам»** в [README.md](../README.md).

Презентационные атомарные виджеты UI — по соглашению **`src/components`** (общие примитивы) и **`modules/HomeModule/components`** (виджеты главной): [docs/components.md](components.md).

## Стиль объявления функций

Функциональные компоненты в **`logic`** и **`containers`**, хуки в **`contexts`** и **`selectors`** оформляйте как **именованный** `const` со стрелочной функцией (`export const Name = … => { … }`). Свойство **`displayName`** задавайте **только** если имя в React DevTools теряется из‑за обёртки (`memo`, `forwardRef`, HOC и т.п.). Подробности и примеры — в [docs/components.md](components.md), раздел **«Объявление компонента (функция)»**.

---

## `modules/HomeModule/logic`

- Назначение: компоненты и модули **оркестрации** экрана тренировки (хуки сессии, голоса, провайдеры контекста), **без** презентационных слотов в духе кнопок из `components`.
- Публичная точка входа: **`modules/HomeModule/logic/index.ts`** — реэкспорт оркестрации (`WorkoutLogicLayout`), типов из `@store` при необходимости, селектора сцены **`useStageContainerSelector`** и типов **`WorkoutSessionStageValue`**; остальные селекторы контейнеров импортируют из **`../selectors`**.
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
- **Каждый контекст — своя подпапка** в PascalCase. Сейчас публично экспортируется **`WorkoutSessionStage`** (сцена: ссылка на canvas, `isCameraInitializing`, `isPaused`). Данные панели и строки статуса (модель, камера, голос, `exerciseId`, отдых и т.д.) лежат в **Redux** — срез **`workoutSessionControls`**, а команды сессии доставляются через **`eventBus`** (см. раздел **«Срез controls и команды сессии»** в [architecture.md](architecture.md)).
- Внутри подпапки контекста — файлы провайдера, типов, хука потребления, **`index.ts`** с явными реэкспортами.
- Баррель: **`modules/HomeModule/contexts/index.ts`** — точка импорта для кода вне подпапок контекста (например из `WorkoutLogicLayout` — **`../../contexts`** относительно файла в `logic/WorkoutLogicLayout/`).
- Имя среза **`workoutSessionControls`** — про панель и статусы вокруг сцены, не про браузер Chrome; подробнее — [architecture.md](architecture.md), раздел **«Именование: workoutSessionControls»**.

---

## `modules/HomeModule/selectors`

- Назначение: подготовка пропсов для контейнеров слотов.
  - Для данных **Redux** — мемоизированный селектор **`get<ИмяКонтейнера>Props`** (файл **`ExerciseControlBarContainerSelector.ts`** / **`StatusBarContainerSelector.ts`**, **`createSelector`** из **`@reduxjs/toolkit`**), в контейнере — **`useAppSelector(get…Props)`**.
  - Для **сцены** — хук **`useStageContainerSelector`** (читает **`WorkoutSessionStageContext`**, внутри **`useMemo`**).
- **Каждый селектор — своя подпапка** в PascalCase с суффиксом **`Selector`** (например `ExerciseControlBarContainerSelector`, `StatusBarContainerSelector`, `StageContainerSelector`).

| Файл | Назначение |
|------|------------|
| `<Name>/<Name>ContainerSelector.ts` или аналог | Селектор(ы) для стора (`get…Props`) или хук для контекста |
| `<Name>/index.ts` | Явный реэкспорт публичного API подпапки |

- Баррель: **`modules/HomeModule/selectors/index.ts`**.
- **`useStageContainerSelector`** реэкспортируется из **`modules/HomeModule/logic/index.ts`**; **`getExerciseControlBarContainerProps`** и **`getStatusBarContainerProps`** импортируют из **`../selectors`** или из барреля **`../../selectors`** (как договорено в конкретном контейнере).

---

## `modules/HomeModule/containers`

- Назначение: компоненты **слотов** `HomeLayout` (`header`, `controls`, `statusBar`, `stage` и т.д.): подключаются к данным через селекторы (**`useAppSelector(get…ContainerProps)`** для Redux, **`useStageContainerSelector`** для сцены), **без пропсов** состояния сессии извне. Команды **`start` / pause / reset / shutdown`** инициируют через **`eventBus`**, смена упражнения и минут отдыха — **`patchWorkoutSessionControls`** (см. [architecture.md](architecture.md)).
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

Код вне **`HomeModule`** при необходимости может импортировать **типы** контекста сцены из **`src/modules/HomeModule/contexts`**, типы «хрома» сессии — из **`@store`**; хуки сессии и речь живут в **`src/modules/HomeModule/hooks`**.
