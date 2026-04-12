# План: вынести умную логику в `WorkoutLogicLayout` (контексты и контейнеры)

## 1. Контекст

В `src/App.tsx` сосуществуют точка входа приложения и **вся оркестрация экрана тренировки**: локальный `useState` (упражнение, длительность отдыха), `useWorkoutSession`, `useSpeechRecognition`, производные значения и подписи для UI, разметка слотов `AppLayout`.

Имя **`WorkoutLogicLayout`** — **родительский компонент с хуками**: он вызывает `useWorkoutSession` и `useSpeechRecognition`, собирает значения и **публикует их через контекст(ы)**. **В `App.tsx`** дерево явно такое: **`WorkoutLogicLayout`** оборачивает **`AppLayout`**, а слоты `AppLayout` (`header`, `controls`, `statusBar`, `stage`) задаются **пропами**, в которые передаются **контейнеры** (`<ExerciseControlBarContainer />` и т.д.). Сами контейнеры **без пропсов** кроме контекста; данные — через **хуки-селекторы контейнера** (`use…ContainerSelector`) на базе **`useContext` + `useMemo`** (без сторонних пакетов — см. п. 3). Презентационный `AppLayout` остаётся без логики сессии; атомарный UI — в `src/components/`.

**Проброс `stageAriaBusy`:** в `App.tsx` нет хуков сессии, поэтому `isCameraInitializing` недоступен на месте. Варианты зафиксировать в реализации (выбрать один): **`WorkoutLogicLayout`** после провайдеров рендерит **`React.cloneElement`** для единственного `child` типа `AppLayout` и **дописывает** `stageAriaBusy={isCameraInitializing}`; либо **`children` как render-prop** `(layoutProps) => <AppLayout {...layoutProps} />`, где `WorkoutLogicLayout` передаёт `stageAriaBusy` из хуков. Первый вариант сохраняет JSX в `App.tsx` в виде `<WorkoutLogicLayout><AppLayout … /></WorkoutLogicLayout>`.

Цель **разделения по частоте обновлений** — не смешивать в одном `Context.Provider` «value» то, что может меняться **почти каждый кадр / очень часто**, с панелью кнопок и строкой статусов, чтобы избежать лишних перерисовок всего экрана.

## 2. Цель

- Вынести оркестрацию из `src/App.tsx` в **`WorkoutLogicLayout`** с **двумя логическими уровнями данных** (низкочастотный срез и срез сцены / высокочастотный).
- Ввести **контейнеры без пропсов**, подключаемые к слотам `AppLayout`, с доступом к данным только через **собственные хуки** **`use…ContainerSelector`** (`useContext` + `useMemo` / стабильные ссылки в `value` провайдера).
- Сохранить **поведение и внешний вид** приложения без регрессии.
- **Не добавлять** для этого рефакторинга сторонних npm-пакетов (ни `use-context-selector`, ни стора): только React и код репозитория.
- Заложить **переход на глобальное хранилище** позже: форма публичных хуков **селекторов контейнера** (`use…ContainerSelector`) у контейнеров должна позволить при желании заменить реализацию на стор (отдельная задача, с новыми зависимостями по правилам проекта) без переписывания разметки контейнеров.

## 3. Разделение: низкочастотное и высокочастотное

### Низкочастотный срез (отдельный контекст или отдельное значение провайдера)

То, что меняется **от событий пользователя, статусов инициализации, голоса, смены упражнения**, а не от каждого кадра камеры:

- выбор упражнения и длительности отдыха (`exerciseId`, `restDurationMinutes`, сеттеры);
- `isRunning`, `isPaused`, `isRestCountdownActive`, `resetStopEnabled`;
- `modelStatus`, `isModelReady`, `isCameraReady`, `isCameraInitializing` (для UI кнопок и статус-строки — обновления не на частоте кадра);
- `cameraError`, `voiceStatus`;
- стабильные **действия** (`start`, `pause`, `reset`, `shutdown`) — по возможности стабильные ссылки (`useCallback` в родителе или объект действий в `useMemo` с пустым/корректным deps);
- данные для **подписей** в статус-баре (сырые статусы + словари `voiceStatusLabel` / `modelStatusLabel` либо уже строки — решение в реализации; главное — не тянуть сюда высокочастотные поля сессии).

**Потребители:** `ExerciseControlBarContainer`, `StatusBarContainer` (и при необходимости мелкие дочерние узлы только через селекторы к этому срезу).

### Высокочастотный срез / контекст только для сцены

То, что **привязано к циклу кадров** или обновляется существенно чаще, чем UI панели:

- **`canvasRef`** и всё, что нужно **только** `StageContainer` для отрисовки/оверлеев;
- при необходимости — минимальный набор флагов для сцены (`isPaused`, `isCameraInitializing` для оверлеев), если они **не** должны жить в общем «тяжёлом» value вместе с низкочастотным объектом, который пересоздаётся часто.

**Правило:** не класть высокочастотные поля в тот же React-контекст, которым пользуется панель управления, если это приводит к смене `value` на каждом кадре и лишним ререндерам панели. На этапе реализации — **проверить `useWorkoutSession`**: какие `setState`/значения обновляются в `requestAnimationFrame` и отделить их в **отдельный провайдер** или **ref + императивный путь** там, где React-рендер не нужен.

**Потребитель:** в основном `StageContainer`.

### Реализация без сторонних пакетов (`React.createContext`)

У стандартного контекста **нет** встроенных селекторных подписок: при смене ссылки `value` у провайдера React заново рендерит **всех** потребителей этого контекста. В рамках этого рефакторинга используем только:

1. **Два (и при необходимости больше) узких `React.Context`**: отдельно низкочастотный срез для «хрома» (панель + статус-бар) и срез для сцены — чтобы частые обновления не уводили в один `value` вместе с панелью.
2. **Стабильные `value`**: `useMemo` / `useCallback` в `WorkoutLogicLayout` так, чтобы объект контекста не пересоздавался без нужды; при необходимости — разнести поля по нескольким контекстам вместо одного большого объекта.
3. **Хуки-селекторы контейнеров** вроде `useExerciseControlBarContainerSelector()` / `useStatusBarContainerSelector()` / `useStageContainerSelector()`: внутри `useContext` + `useMemo(() => pick(ctx), deps)` — это **не** отменяет перерисовку при любом изменении `value` соответствующего контекста, но позволяет держать контракт «контейнер без пропсов» и упростить дальнейшую замену на стор.

Подключение **сторонних** библиотек (селекторный контекст, Zustand и т.д.) **не входит** в этот рефакторинг; при появлении отдельной задачи — с exact-версиями и чистой переустановкой по правилам репозитория.

## 4. Размещение в дереве `src`

Компоненты с хуками сессии и контейнеры **не** в `src/components/` (там презентация без ядра сессии; см. `docs/components.md`).

**Контейнеры** живут в **отдельном каталоге верхнего уровня `src/containers/`** (не внутри `src/logic`), **каждый контейнер — в своей папке** (как у UI в `src/components/`: одна папка на сущность в **PascalCase**, внутри `<Name>.tsx` и **`index.ts`** с явным реэкспортом, **без** `export *`). Баррель **`src/containers/index.ts`** — явные реэкспорты всех контейнеров; **`App.tsx`** импортирует контейнеры из **`./containers`**, **`WorkoutLogicLayout`** — из **`./logic`**.

**`WorkoutLogicLayout`** размещается в **`src/logic/WorkoutLogicLayout/`** (не путать с `src/components/`): как у UI-компонентов — **одна папка на сущность в PascalCase**, внутри **`WorkoutLogicLayout.tsx`** и **`index.ts`** с явным реэкспортом, **без** `export *`; баррель **`src/logic/index.ts`** реэкспортирует компонент наружу. **Контексты** сессии — в **`src/contexts/`**, **каждый контекст — в своей подпапке** (контекст, типы, при необходимости хук `useWorkoutSession…Context` для потребления из селекторов и `WorkoutLogicLayout`). **Селекторы для контейнеров** — в **`src/selectors/`**, **каждый селектор — в своей подпапке** (файл `use…ContainerSelector.ts` + `index.ts` с явным реэкспортом). Контейнеры подписываются на данные через **именованные** хуки `use<ИмяКонтейнера>ContainerSelector`, реэкспортируемые из **`src/logic/index.ts`** (удобная единая точка импорта **`from '../logic'`**).

По правилу импортов между папками верхнего уровня `src` — из баррелей: **`src/contexts/index.ts`**, **`src/selectors/index.ts`**, **`src/logic/index.ts`**. Контейнеры импортируют селекторы и типы как **`from '../logic'`**. **`App.tsx`** и прочие потребители импортируют **`WorkoutLogicLayout`** только из **`./logic`**, не из **`./logic/WorkoutLogicLayout/…`**. Сам **`WorkoutLogicLayout.tsx`** импортирует провайдеры из **`../../contexts`** (относительно своей подпапки). Модули селекторов импортируют **`useWorkoutSession…Context`** из **`../contexts`**. Не тянуть импорты из чужих подсистем через глубокие пути к файлам — только через баррели соответствующих корневых папок `src`.

Предлагаемая структура:

| Путь | Назначение |
|------|------------|
| `src/App.tsx` | `import './App.css'`; **`return (`**`<WorkoutLogicLayout>`**`<AppLayout` `header={…}` `controls={<ExerciseControlBarContainer />}` `statusBar={<StatusBarContainer />}` `stage={<StageContainer />}` `/>`**`</WorkoutLogicLayout>`**`)`**; **`AppLayout`** — из `./components`, контейнеры — из **`./containers`**, **`WorkoutLogicLayout`** — из **`./logic`** |
| `src/logic/WorkoutLogicLayout/WorkoutLogicLayout.tsx` | Хуки, провайдеры контекста, **дочерний элемент** — `AppLayout` из пропа `children` (с доп. пропом `stageAriaBusy` — см. вводный абзац); импорт контекстов из **`../../contexts`** |
| `src/logic/WorkoutLogicLayout/index.ts` | `export { WorkoutLogicLayout } from './WorkoutLogicLayout'` |
| `src/contexts/index.ts` | Баррель: реэкспорт контекстов, типов и хуков `useWorkoutSessionChromeContext` / `useWorkoutSessionStageContext` |
| `src/contexts/WorkoutSessionChrome/…` | `WorkoutSessionChromeContext`, типы chrome-среза, `useWorkoutSessionChromeContext` |
| `src/contexts/WorkoutSessionStage/…` | `WorkoutSessionStageContext`, типы stage-среза, `useWorkoutSessionStageContext`; комментарий про границу высокочастотных обновлений |
| `src/selectors/index.ts` | Баррель: реэкспорт `useExerciseControlBarContainerSelector`, `useStatusBarContainerSelector`, `useStageContainerSelector` |
| `src/selectors/ExerciseControlBarContainerSelector/…` | `useExerciseControlBarContainerSelector.ts` + `index.ts` |
| `src/selectors/StatusBarContainerSelector/…` | `useStatusBarContainerSelector.ts` + `index.ts` |
| `src/selectors/StageContainerSelector/…` | `useStageContainerSelector.ts` + `index.ts` |
| `src/logic/index.ts` | Реэкспорт **`WorkoutLogicLayout`**, **именованных** селекторов (из **`../selectors`**) и при необходимости **типов** контекста (из **`../contexts`**) для контейнеров |
| `src/containers/ExerciseControlBarContainer/ExerciseControlBarContainer.tsx` | Слот controls |
| `src/containers/ExerciseControlBarContainer/index.ts` | `export { ExerciseControlBarContainer } …` |
| `src/containers/StatusBarContainer/…` | Слот statusBar |
| `src/containers/StageContainer/…` | Слот stage |
| `src/containers/index.ts` | Явные реэкспорты из подпапок контейнеров |

Константа `REST_DURATION_OPTIONS` — в папке контрольной панели под `src/containers/` или вынесена в модуль констант рядом с контейнером.

Импорты между папками `src` — через баррели и явные реэкспорты.

## 5. Контракт `WorkoutLogicLayout`

- Публичный компонент: **`WorkoutLogicLayout`**, проп **`children`**: ожидается **один** ребёнок — **`AppLayout`** (или совместимый элемент), чтобы можно было применить **`cloneElement`** для `stageAriaBusy`; при выборе render-prop API договориться о типе `children` в типах.
- Внутри: прежний порядок и зависимости хуков `useWorkoutSession` / `useSpeechRecognition`; при разбиении на контексты **не** менять наблюдаемое поведение API хуков без необходимости.

## 6. Стили

- **`src/App.css`** — стили секций экрана. Импорт в `App.tsx` или в `src/logic/WorkoutLogicLayout/WorkoutLogicLayout.tsx` — один вариант, зафиксировать в чеклисте; регрессии внешнего вида нет.

## 7. Этапы реализации (логический порядок)

1. Проанализировать `useWorkoutSession` (и при необходимости `useSpeechRecognition`): какие обновления состояния высокочастотные; зафиксировать границу срезов в комментарии в модуле stage-контекста (`src/contexts/WorkoutSessionStage/`) при необходимости.
2. Ввести **низкочастотный** и **сценический** контексты на `React.createContext` в **`src/contexts/<ИмяКонтекста>/`**; собрать `value` с мемоизацией так, чтобы панель не зависела от частых обновлений сцены.
3. Реализовать в **`src/selectors/<ИмяКонтейнера>Selector/`** хуки **`use<ИмяКонтейнера>ContainerSelector`** (`useContext` + `useMemo`, без npm-зависимостей); баррель **`src/selectors/index.ts`**.
4. Создать **`src/containers/<Имя>/`** для каждого контейнера с `index.ts`; баррель **`src/containers/index.ts`**; в **`src/logic/index.ts`** реэкспорт селекторов для импорта контейнерами из **`../logic`**.
5. Реализовать `WorkoutLogicLayout` с `children`: провайдеры и вложенный `AppLayout` из `App.tsx` со слотами-контейнерами; проброс `stageAriaBusy` (см. п. 1).
6. Собрать дерево в **`App.tsx`**: `WorkoutLogicLayout` → `AppLayout` с пропами слотов; проверить `main.tsx` и default export.
7. `npm run lint`, `npm test`, `npm run build`; ручная проверка сценариев и отсутствия заметных лишних ререндеров (при возможности — React DevTools Profiler).

## 8. Проверка отсутствия регрессии

- Старт / пауза / сброс / стоп, смена упражнения и отдыха, статусы, ошибка камеры, пауза и лоадер на сцене.
- Голос: коллбеки и блокировка селекта упражнения при `isRunning`.

## 9. Критерии готовности

- `App.tsx` не содержит хуков сессии и голоса и локального состояния экрана тренировки; в нём явно видно **`WorkoutLogicLayout`** и **`AppLayout`** с контейнерами в пропах слотов.
- Контексты лежат в **`src/contexts/<Имя>/`** с **`index.ts`** на подсистему контекста; селекторы — в **`src/selectors/<ИмяКонтейнера>Selector/`** с хуком **`use<ИмяКонтейнера>ContainerSelector`** и **`index.ts`**; баррели **`src/contexts/index.ts`** и **`src/selectors/index.ts`**.
- Контейнеры лежат в **`src/containers/<Имя>/`** с **`index.ts`** на контейнер; публичный импорт контейнеров в приложении — из барреля **`./containers`**; селекторы контейнеры импортируют из **`./logic`** (баррель `src/logic/index.ts` с явными реэкспортами).
- Контейнеры слотов **без пропсов** данных сессии; данные — через контекст(ы) React и собственные хуки **`use…ContainerSelector`** без сторонних пакетов.
- Высокочастотные обновления **не** проходят через общий контекст панели управления (или обоснован выбранный механизм, эквивалентный по перформансу).
- **`WorkoutLogicLayout`** в **`src/logic/WorkoutLogicLayout/`** (`WorkoutLogicLayout.tsx` + `index.ts`); **контексты** в **`src/contexts/`**; **селекторы** в **`src/selectors/`**; ни один из этих каталогов не смешивается с `src/components/`; контейнеры — в **`src/containers/`**; баррели и импорты по правилам репозитория.
- Поведение и UI совпадают с состоянием до рефакторинга.

## 10. Git

По [.cursor/rules/work-in-branch.mdc](.cursor/rules/work-in-branch.mdc) — отдельная ветка (например `refactor/workout-logic-layout`).

## 11. Вне скоупа

- Полный переход на глобальный стор или библиотеки селекторного контекста — отдельная задача (с новыми зависимостями); этот рефакторинг **только** React-контексты + хуки и разделение срезов по частоте.
- Вынос чисто презентационных кусков в `src/components/` без логики сессии — по желанию позже.
