# План: сессия авторизации на Redux Toolkit (без RTK Query)

## 1. Контекст

Сейчас глобальная сессия живёт в **`AuthSessionProvider`** (`src/contexts/AuthSessionContext/AuthSessionProvider.tsx`): локальный **`useState`** для **`user`** и **`status`**, **`useEffect`** с **`authMe`** при монтировании, колбэки **`loginWithPassword`**, **`registerWithPassword`**, **`logout`**, **`refresh`** с вызовами из **`@api`**. Потребители берут всё через **`useAuthSessionContext`** (`src/contexts/AuthSessionContext/AuthSessionContext.tsx`).

Тип публичного значения — **`AuthSessionValue`** в **`src/contexts/AuthSessionContext/types.ts`** (`user`, `status`, четыре асинхронные операции).

**Важно:** после миграции **`AuthSessionContext`** и **`AuthSessionProvider`** удаляются; данные читаются через **селекторы** и **`useAppSelector`**, операции — через **`dispatch`** thunk’ов. При этом у корня приложения остаётся **один** провайдер из **`react-redux`** — **`<Provider store={store}>`**; это не дублирует паттерн «контекст сессии», а подключает store (без альтернативы в стандартном Redux).

**RTK Query не используем:** загрузка и мутации — через **`createAsyncThunk`** (и при необходимости **`extraReducers`**), вызовы **`authLogin`**, **`authLogout`**, **`authMe`**, **`authRegister`** из **`@api`** остаются внутри thunk’ов.

## 2. Цель

- Перенести состояние сессии (**`user`**, **`status`**: `'loading' | 'ready'`) в **slice** Redux Toolkit.
- Заменить колбэки из контекста на **асинхронные thunk’и** с тем же наблюдаемым поведением (включая начальный **`authMe`**, обработку ошибок и **`setStatus('ready')`** после первой попытки).
- Экспортировать **именованные селекторы** (например **`selectAuthUser`**, **`selectAuthStatus`**, при необходимости составной **`selectAuth…`**) и типизированные **`useAppSelector`** / **`useAppDispatch`**.
- Убрать **`src/contexts/`** как слой для auth: либо удалить каталог целиком (сейчас там только auth), либо оставить только реэкспорт типов на переходный период — в реализации зафиксировать один вариант (предпочтительно — **типы рядом со store**, обновить импорты).
- Сохранить поведение для пользователя и маршрутизации (**`RequireAuth`**, редиректы логина/регистрации): без регрессии по сценариям из существующих тестов.

## 3. Проектирование

### 3.1. Зависимости

- **`@reduxjs/toolkit`**, **`react-redux`** — добавить в **`package.json`**, версии согласовать с React 19 (актуальные минорные в момент реализации).

### 3.2. Расположение кода

- Ввести каталог **`src/store/`** (или согласованное имя, например **`src/app/store/`**), публичный баррель **`src/store/index.ts`**.
- Добавить алиас **`@store`** → **`./src/store`** в **`tsconfig.app.json`** и **`vite.config.ts`** (как у остальных **`@…`**); обновить **`docs/import-aliases.md`**.
- **`configureStore`** в **`src/store/`**: редьюсер **`auth`** (имя зафиксировать: например **`authReducer`** / ключ **`auth`**).
- Файлы slice: например **`src/store/auth/authSlice.ts`** (state, reducers, **`extraReducers`** для thunk’ов) и **`src/store/auth/authThunks.ts`** или thunk’и рядом со slice — на усмотрение реализации, без **`export *`**.
- **Селекторы — в отдельном каталоге на уровне `src`**, не внутри **`src/store/`** и не внутри файла slice: **`src/selectors/`**. Для среза auth — подпапка **`src/selectors/auth/`** (например **`index.ts`** и при необходимости отдельные файлы по смыслу), баррель **`src/selectors/index.ts`**. Другие срезы позже — **`src/selectors/<slice>/`**. Добавить алиас **`@selectors`** → **`./src/selectors`** в **`tsconfig.app.json`** и **`vite.config.ts`**; обновить **`docs/import-aliases.md`** (импорт селекторов из **`@selectors`**, без **`export *`** в баррелях).

### 3.3. Состояние и действия

- **State:** `user: AuthUser | null`, `status: 'loading' | 'ready'` — семантика как в **`AuthSessionProvider`**.
- **Thunks (минимальный набор):**
  - инициализация при старте приложения (аналог текущего **`useEffect` + **`refresh`**): **`authMe`**, по ошибке — **`user: null`**, в **`finally`** — **`status: 'ready'`**;
  - **`loginWithPassword`**, **`registerWithPassword`**, **`logout`**, **`refresh`** — те же API-вызовы и обновление **`user`**, что сейчас в провайдере.
- Имена thunk’ов и slice actions — в стиле проекта (короткие, однозначные).

### 3.4. Селекторы

- Все селекторы — в **`src/selectors/`** (см. §3.2). Для auth: **`src/selectors/auth/`** — **`selectAuthUser`**, **`selectAuthStatus`**, производные через **`createSelector`** при необходимости; тип **`RootState`** импортировать из **`@store`** (чтобы избежать циклических импортов — при необходимости вынести **`RootState`** в **`src/store/types.ts`** или реэкспорт из **`store.ts`**).
- Не класть селекторы в **`authSlice.ts`**: slice отвечает за state и редьюсеры, чтение state — только через **`@selectors`**.
- Компоненты и тесты импортируют селекторы из **`@selectors`** (баррель **`src/selectors/index.ts`**), без прямого доступа к **`state.auth`** в UI.

### 3.5. Типы

- **`AuthUser`**, статусы сессии — перенести из **`src/contexts/AuthSessionContext/types.ts`** в слой store (например **`src/store/auth/types.ts`**) и реэкспортировать из **`@store`** для модулей **`LoginModule`**, **`RegistrationModule`**, **`App`**.

### 3.6. Точка входа

- В **`src/App/App.tsx`**: обернуть дерево в **`Provider`** из **`react-redux`** с **`store`**; убрать **`AuthSessionProvider`**.
- Побочный эффект «загрузить сессию при монтировании»: либо **`dispatch`** thunk’а инициализации в **`useEffect`** в маленьком компоненте-обёртке рядом с **`App`**, либо один раз при создании store через кастомную фабрику — зафиксировать в реализации так, чтобы не дублировать запрос при Strict Mode без необходимости (сохранить текущую семантику с **`cancelled`** из провайдера, если останется релевантной).

### 3.7. Потребители (миграция с хука контекста)

Заменить **`useAuthSessionContext()`** на связку **селектор + `dispatch`**:

| Область | Файлы (ориентир) |
|--------|-------------------|
| App shell | **`AppPageLayout`**, **`RequireAuth`**, **`AppNavContainer`** |
| Модули | **`LoginModule`**, **`RegistrationModule`** |
| Тесты | все, что мокают **`@contexts`** или оборачивают в **`AuthSessionProvider`** / **`AuthSessionContext.Provider`** |

**Паттерн:** `const user = useAppSelector(selectAuthUser);` `const dispatch = useAppDispatch();` и вызовы `dispatch(loginWithPassword(...))` и т.д. Опционально: тонкий хук **`useAuthSessionCommands()`**, который только возвращает **`dispatch`** и обёртки над thunk’ами — **не** обязателен, если команда — избегать дублирования только в местах с многими вызовами.

### 3.8. Тесты

- **`AuthSessionProvider.test.tsx`** заменить на тесты store: редьюсер + thunk’и (мок **`@api`**) и/или интеграционный тест с **`Provider`** + **`preloadedState`**.
- Тесты с **`AuthSessionContext.Provider`**: обёртка **`Provider`** из **`react-redux`** и **`preloadedState`**, либо мок **`@store/hooks`** — обновить импорты с **`@contexts`** на **`@store`**.

### 3.9. Чистка

- Удалить **`src/contexts/`** (если пуст после выноса типов) и баррель **`@contexts`**: убрать путь из **`tsconfig.app.json`**, **`vite.config.ts`**, **`eslint`**, **`docs/import-aliases.md`**.
- Проверить **`src/contexts`**, **`AuthSession`**, **`useAuthSessionContext`** по всему репозиторию (включая Storybook, если есть зависимость).

## 4. Критерии готовности

- Нет **`AuthSessionContext`**, **`AuthSessionProvider`**, **`useAuthSessionContext`** в продуктовом коде.
- Сессия читается через **селекторы**; мутации — через **thunk’и** и **`dispatch`**.
- **`npm run lint`**, **`npm test`**, **`npm run build`** проходят.
- Ручная проверка: холодный старт (гость), логин, логаут, регистрация, защищённые маршруты, поведение **`status: loading`** для **`RequireAuth`**.

## 5. Вне скоупа

- **RTK Query** (`createApi`, кэш запросов) — не внедрять.
- Тренировочные контексты **`HomeModule`** — не трогать.
- Оптимистичные обновления и **persist** сессии в **`localStorage`** — только если уже есть в продукте; иначе отдельная задача.
