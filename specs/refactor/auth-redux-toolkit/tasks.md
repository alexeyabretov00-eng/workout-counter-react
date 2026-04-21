# Задачи: сессия авторизации на Redux Toolkit

План: [./plan.md](./plan.md)

## Чеклист

- [ ] Добавить зависимости **`@reduxjs/toolkit`** и **`react-redux`**; зафиксировать версии.
- [ ] Создать **`src/store/`**: **`configureStore`**, **`RootState`**, **`AppDispatch`**, типизированные **`useAppDispatch`** / **`useAppSelector`** (`hooks.ts`); ключ редьюсера **`auth`**.
- [ ] Реализовать **`authSlice`** (state: **`user`**, **`status`**) и thunk’и без RTK Query: инициализация (**`authMe`**), **`loginWithPassword`**, **`registerWithPassword`**, **`logout`**, **`refresh`** — поведение как в **`AuthSessionProvider`**.
- [ ] Добавить на уровне **`src/`** каталог **`src/selectors/`** с подпапкой **`auth/`**: селекторы auth (**`createSelector`** где нужно); баррели **`src/selectors/auth/index.ts`**, **`src/selectors/index.ts`** (без **`export *`**). Не размещать селекторы в **`authSlice.ts`**.
- [ ] Перенести типы **`AuthUser`** и статусы сессии в store; обновить импорты в App и модулях.
- [ ] Добавить алиасы **`@store`** и **`@selectors`** в **`tsconfig.app.json`** и **`vite.config.ts`**; обновить **`docs/import-aliases.md`**.
- [ ] В **`App.tsx`**: **`Provider store={store}`** вместо **`AuthSessionProvider`**; инициализация сессии при старте согласно плану §3.6.
- [ ] Заменить **`useAuthSessionContext`** на **`useAppSelector` + `useAppDispatch`** (и селекторы) в **`AppPageLayout`**, **`RequireAuth`**, **`AppNavContainer`**, **`LoginModule`**, **`RegistrationModule`**.
- [ ] Обновить тесты: моки **`@contexts`** → **`@store`** или **`Provider`** + **`preloadedState`**; переписать **`AuthSessionProvider.test.tsx`** под slice/thunk/store.
- [ ] Удалить **`src/contexts/`** и баррель **`@contexts`**; убрать алиас из конфигов и документации.
- [ ] **`npm run lint`**, **`npm test`**, **`npm run build`**; ручная проверка сценариев из плана §4.

После завершения — перенос каталога в **`specs/refactor/_archive/auth-redux-toolkit/`** (третий коммит цикла).
