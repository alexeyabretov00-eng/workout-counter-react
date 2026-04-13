# Структура папок в `src`: логика экрана, контексты, селекторы, контейнеры

Соглашения для каталогов **`src/logic`**, **`src/contexts`**, **`src/selectors`**, **`src/containers`** — оркестрация экрана тренировки, React-контексты, хуки-селекторы для слотов layout и компоненты-слоты без пропсов данных сессии. Для агента ИИ краткие обязательные пункты продублированы в [.cursor/rules/src-layout.mdc](../.cursor/rules/src-layout.mdc) (как у UI — `components.mdc`).

Общее правило импортов: **между папками верхнего уровня `src/*`** — только из **барреля** (`index.ts`) соответствующей папки, **без** `export *`, только явные `export { … }` и `export type { … }`. См. также раздел **«Соглашение по импортам»** в [README.md](../README.md).

Презентационные атомарные виджеты UI — по соглашению **`src/components`**: [docs/components.md](components.md).

## Стиль объявления функций

Функциональные компоненты в **`logic`** и **`containers`**, хуки в **`contexts`** и **`selectors`** оформляйте как **именованный** `const` со стрелочной функцией (`export const Name = … => { … }`). Свойство **`displayName`** задавайте **только** если имя в React DevTools теряется из‑за обёртки (`memo`, `forwardRef`, HOC и т.п.). Подробности и примеры — в [docs/components.md](components.md), раздел **«Объявление компонента (функция)»**.

---

## `src/logic`

- Назначение: компоненты и модули **оркестрации** экрана (хуки сессии, голоса, провайдеры контекста), **без** презентационных слотов в духе кнопок из `components`.
- Публичная точка входа каталога: **`src/logic/index.ts`** — реэкспорт того, что должны импортировать контейнеры и страницы с тренировкой (например `HomePage`: `WorkoutLogicLayout`, хуки `use…ContainerSelector` из `../selectors`, типы контекста из `../contexts`).
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
- **Каждый контекст — своя подпапка** в PascalCase (например `WorkoutSessionChromeControls`, `WorkoutSessionChromeStatus`, `WorkoutSessionStage`); внутри — файлы контекста, типов, хука потребления, **`index.ts`** с явными реэкспортами.
- Пример контракта **`WorkoutSessionChromeControls`**: значения для отображения плюс **`dispatchChromeControl`**, аргумент — union **`WorkoutSessionChromeControlAction`** (см. `src/contexts/WorkoutSessionChromeControls/types.ts` и раздел **«Chrome-контролы»** в [architecture.md](architecture.md)).
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

- Назначение: компоненты **слотов** страничного layout главной (`HomeLayout` в `src/pages/HomePage/components/HomeLayout/`: `controls`, `statusBar`, `stage` и т.д.): подключаются к данным **только** через **`use…ContainerSelector`**, **без пропсов** состояния сессии (кроме того, что приходит из React-контекста внутри селектора).
- Структура **как у `src/components`**: одна папка на контейнер в PascalCase, **`ContainerName/ContainerName.tsx`**, **`ContainerName/index.ts`**, баррель **`src/containers/index.ts`**.
- Разметка слота: контейнер рендерит **один** презентационный компонент из **`src/components`** (например панель управления, статус-бар, сцена); стили виджета — **`<Имя>.styled.tsx`**, токены из **`src/theme`**. Глобальные правила — в **`GlobalStyle`** (`src/theme/globalStyle.tsx`).
- Импорт в страницах (например `HomePage`) и т.п.: только из **`./containers`** (путь к баррелю — относительно файла страницы).

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
