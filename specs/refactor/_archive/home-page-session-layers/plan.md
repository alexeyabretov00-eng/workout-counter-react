# План: колокация контекстов, контейнеров, селекторов и логики главной

> **Сейчас:** слои главной — в **`src/modules/HomeModule/`**; данные панели/статусов — Redux **`home`**. Ниже — план переноса из корня `src`.

## 1. Контекст

Экран тренировки (`HomePage`) — единственный потребитель `WorkoutLogicLayout`, контекстов сессии (`WorkoutSessionChromeControls`, `WorkoutSessionChromeStatus`, `WorkoutSessionStage`), контейнеров слотов и селекторов. Сейчас эти слои лежат в корне `src` (`contexts`, `containers`, `selectors`, `logic`), хотя по смыслу относятся только к главной — аналогично перенесённым под `HomePage` презентационным виджетам.

## 2. Цель

- Разместить под **`src/pages/HomePage/`**:
  - **`contexts/`** — те же подпапки на контекст + баррель `index.ts`;
  - **`containers/`** — три контейнера + баррель;
  - **`selectors/`** — три селектора + баррель;
  - **`logic/WorkoutLogicLayout/`** — оркестратор с провайдерами + **`logic/index.ts`** как единая точка для страницы и контейнеров (реэкспорт `WorkoutLogicLayout`, селекторов и типов контекстов, как раньше в `src/logic/index.ts`).
- Удалить пустые корневые каталоги **`src/contexts`**, **`src/containers`**, **`src/selectors`**, **`src/logic`** после переноса.
- Хук **`useSpeechRecognition`** (теперь под **`src/pages/HomePage/hooks`**) импортирует тип действия из **`../contexts`** относительно папки хуков.
- **Наблюдаемое поведение не меняется.**

## 3. Импорты

- `HomePage.tsx`: `WorkoutLogicLayout` и контейнеры — из **`./logic`** и **`./containers`**.
- Контейнеры: селекторы — из **`../logic`**; виджеты — из **`../components`**.
- Селекторы: контексты — из **`../../contexts`**; `SelectOption` — из **`../../../components`**.
- `WorkoutLogicLayout`: контексты — из **`../contexts`**; `exercises` и `hooks` — из **`../../../exercises`**, **`../../../hooks`**.

## 4. Проверка

- `npm run build`, `npm test`.
- Ручная проверка главной: старт/пауза, селекты, статусы, сцена.

## 5. Документация

- Обновить **`docs/src-layout.md`**, **`README.md`**, **`docs/architecture.md`**: пути и формулировка «слои главной под `pages/HomePage/`».
