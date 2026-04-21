# Задачи: сессия авторизации на Redux Toolkit

План: [./plan.md](./plan.md)

## Чеклист

- [x] Добавить зависимости **`@reduxjs/toolkit`** и **`react-redux`**; зафиксировать версии.
- [x] Создать **`src/store/`**: **`configureStore`**, **`RootState`**, **`AppDispatch`**, типизированные **`useAppDispatch`** / **`useAppSelector`** (`hooks.ts`); ключ редьюсера **`auth`**.
- [x] Реализовать **`authSlice`** (state: **`user`**, **`status`**) и thunk’и без RTK Query: инициализация (**`authMe`**), **`loginWithPassword`**, **`registerWithPassword`**, **`logout`**, **`refreshSession`** — поведение как в **`AuthSessionProvider`**.
- [x] Добавить на уровне **`src/`** каталог **`src/selectors/`** с файлами вида **`*Selectors.ts`** (например **`authSelectors.ts`**); баррель **`src/selectors/index.ts`** (без **`export *`**). Не размещать селекторы в **`authSlice.ts`**.
- [x] Перенести типы **`AuthUser`** и статусы сессии в store; обновить импорты в App и модулях.
- [x] Добавить алиас **`@store`** в **`tsconfig.app.json`** и **`vite.config.ts`**; комбинированные селекторы — рядом с **`App`** и модулями; обновить **`docs/import-aliases.md`**.
- [x] В **`App.tsx`**: **`Provider store={store}`** вместо **`AuthSessionProvider`**; инициализация сессии при старте согласно плану §3.6.
- [x] Заменить **`useAuthSessionContext`** на **`useAppSelector` + `useAppDispatch`** (и селекторы) в **`AppPageLayout`**, **`RequireAuth`**, **`AppNavContainer`**, **`LoginModule`**, **`RegistrationModule`**.
- [x] Обновить тесты: моки **`@contexts`** → **`@store`** или **`Provider`** + **`preloadedState`**; переписать **`AuthSessionProvider.test.tsx`** под slice/thunk/store.
- [x] Удалить **`src/contexts/`** и баррель **`@contexts`**; убрать алиас из конфигов и документации.
- [x] **`npm run lint`**, **`npm test`**, **`npm run build`**; ручная проверка сценариев из плана §4.

После завершения — перенос каталога в **`specs/refactor/_archive/auth-redux-toolkit/`** (третий коммит цикла).
