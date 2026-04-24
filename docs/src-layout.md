# Структура папок в `src`: оркестрация главной, контексты, селекторы, контейнеры, store



Соглашения для **экрана тренировки** на главной: в **`src/modules/HomeModule/`** — оркестрация в **`HomeModule.tsx`**, React-контекст сцены, селекторы для панели и слотов, контейнеры без пропсов данных сессии снаружи, Redux-срез `home` в **`store/`**. Тонкая страница маршрута — **`src/pages/HomePage/HomePage.tsx`**, рендерит **`HomeModule`**. Для агента ИИ краткие обязательные пункты: [.cursor/rules/src-layout.mdc](../.cursor/rules/src-layout.mdc) (как у UI — `components.mdc`).



Общее правило импортов: **между папками верхнего уровня `src/*`** — только из **барреля** (`index.ts`) соответствующей папки, **без** `export *`, только явные `export { … }` и `export type { … }`; при переходе используйте **алиасы** (`@utils`, `@hooks`, …), см. [docs/import-aliases.md](import-aliases.md). Внутри **`HomeModule`** импорты между подсистемами — из баррелей (`./hooks`, `../contexts` и т.д.).



Презентационные атомарные виджеты — **`src/components`** (общие примитивы) и **`modules/HomeModule/components`** (виджеты главной): [docs/components.md](components.md).



## Стиль объявления функций



Функциональные компоненты в **`HomeModule`**, **`containers`**, хуки в **`hooks`** и **`contexts`** — как **именованный** `const` со стрелочной функцией; **`React.FC`** не требуется, кроме презентации в [docs/components.md](components.md), раздел **«Объявление компонента (функция)»**. **`displayName`** — только при потере имени в DevTools (`memo`, `forwardRef`, HOC).



---



## `HomeModule.tsx` (оркестрация)



- **Назначение:** единая точка оркестрации экрана тренировки: **`useWorkoutSession`**, **`useSpeechRecognition`**, подписка на **`eventBus`** с **`EVENT_WORKOUT_SESSION_CONTROLS_COMMAND`** (payload — **`WorkoutSessionControlsAction`** из `store`), провайдер **`WorkoutSessionStageContext`**, **`updateHomeModuleState` / `resetHomeModuleState`**. Отдельной папки **`logic/`** в репозитории нет.

- **Разметка:** контейнеры слотов передаются в **`HomeLayout`** (`controls`, `statusBar`, `stage`); заголовок сейчас задан в **`HomeModule`** инлайн (`<h1>Счетчик повторений</h1>`).



---



## `modules/HomeModule/store`



- **Назначение:** Redux-срез в корневом `combineReducers` зарегистрирован как **`home: HomeModuleReducer`** (см. `src/store/store.ts`).

- **Содержимое:** `HomeModuleSlice.ts`, **`controlActionTypes.ts`** (union **`WorkoutSessionControlsAction`**), `types.ts`, баррель **`index.ts`**. Команды сессии **`start` / `pause` / `reset` / `shutdown`** в стор **не** кладутся: UI и голос эмитят их через **`eventBus`**, а обработчик в **`HomeModule`** вызывает методы **`useWorkoutSession`**. См. [architecture.md](architecture.md), раздел про **`eventBus`**.

- **Имя `home`:** про панель и статусы вокруг сцены, не про браузер Chrome; подробнее — [architecture.md](architecture.md).



---



## `modules/HomeModule/contexts`



- Назначение: значение контекста сцены (**`WorkoutSessionStage`**: только `canvasRef`). Флаги сцены (`isCameraInitializing`, `isPaused`) и данные панели/строки состояния (модель, камера, голос, `exerciseId`, отдых) — в **Redux** (`home`).

- Сейчас: подпапка **`WorkoutSessionStage/`** с баррелем, общий импорт — **`contexts/index.ts`**.



---



## `modules/HomeModule/selectors`



- **Назначение:** в **`HomeModuleSelectors.ts`** — мемоизированные селекторы **`getHomeModuleProps`**, **`getExerciseControlBarContainerProps`**, **`getWorkoutStatusBarContainerProps`**, **`getStageContainerProps`** (база **`getWorkoutControlsState`**) + **`useAppSelector`** в контейнерах.

- Баррель: **`selectors/index.ts`**.



---



## `modules/HomeModule/hooks`



- **`useWorkoutSession`**, **`useSpeechRecognition`**, **`useStageContainerSelector`** (отдает только `canvasRef` из контекста); баррель **`hooks/index.ts`**.

- Камера: **`useCameraStream`** реализован в **`src/hooks/useCameraStream.ts`** и импортируется из **`@hooks`** (не дублируется в `HomeModule/hooks/`).



---



## `modules/HomeModule/containers`



- **Назначение:** слоты **`HomeLayout`**: `ExerciseControlBarContainer`, `StatusBarContainer`, `StageContainer` — данные из селекторов (для сцены: `getStageContainerProps`) и **`useStageContainerSelector`** (`canvasRef`), **без** пропсов сессии извне. Команды сессии — **`eventBus`**, смена упражнения/отдыха — **`updateHomeModuleState`**. Структура: **`ContainerName/ContainerName.tsx`**, **`index.ts`**, баррель **`containers/index.ts`**. Стили читают токены из **`src/theme`**.

- Импорт в `HomeModule.tsx` — только из **`./containers`** (баррель).



---



## Сводная таблица «куда класть новое»



| Что добавляете | Каталог | Подпапка / файл |

|----------------|---------|-----------------|

| Оркестрация главной, новые эффекты вокруг сессии | `modules/HomeModule` | правки в **`HomeModule.tsx`** (или вынесение в хуки `hooks/`) |

| Новый контекст сцены/сессии главной | `modules/HomeModule/contexts` | `<ContextName>/` |

| Поля/редьюсер панели главной | `modules/HomeModule/store` | срез `home` + типы |

| Селекторы под панель/контейнеры | `modules/HomeModule/selectors` | в первую очередь **`HomeModuleSelectors.ts`**, реэкспорт в `index.ts` |

| Слот с данными сессии | `modules/HomeModule/containers` | `<ContainerName>/` |

| Хук сессии, речи, сцены | `modules/HomeModule/hooks/` | + баррель `hooks/index.ts` |

| Общий хук, не привязанный только к главной (камера) | `src/hooks` | + алиас `@hooks` |

| Переиспользуемый примитив | `src/components` | см. [components.md](components.md) |

| Виджет экрана тренировки | `modules/HomeModule/components/` | тот же стиль папок, что у `components` |

| Детекторы и реестр | `modules/HomeModule/exercises/` | `registry.ts`, `*Detector.ts` |

| Сервис pose landmarker | `modules/HomeModule/services/` | `PoseLandmarkerService` |



После добавления публичной сущности обновляйте соответствующий **`index.ts`** в **той же задаче**.



Код вне **`HomeModule`** при необходимости читает **`@store`** (в т.ч. `home`); типы контролов сессии — из **`./store`** внутри `HomeModule`.


