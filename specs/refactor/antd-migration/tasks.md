# Задачи: переход UI на Ant Design (antd)

План: [./plan.md](./plan.md)

## Чеклист

_Пункты отмечать по мере выполнения реализации (второй коммит цикла)._

### Фаза 0 — спайк

- [ ] Проверить совместимость **React 19.2** с выбранной линейкой **antd**; зафиксировать в плане/задачах версию **antd** (и при необходимости **dayjs**).
- [ ] Временно добавить **antd** в `package.json` (точная версия), `npm install` по правилам репозитория; убедиться, что **`npm run build`** и **`npm test`** проходят с минимальной обёрткой **`ConfigProvider`** в `src/App/App.tsx` (без массовой замены UI).

### Фаза 1 — фундамент

- [ ] Ввести **`ConfigProvider`** в корне (рядом с Redux), прокинуть **`theme`** (токены antd), согласованные с `src/theme/theme.ts` (цвета, радиусы, шрифт, `controlHeight` при необходимости).
- [ ] Согласовать **`src/theme/globalStyle.tsx`** с глобальными стилями antd; обновить при необходимости `src/theme/index.ts`, `src/theme/styled.d.ts`, тест `src/theme/__tests__/globalStyle.test.tsx` и снапшот.
- [ ] Расширить **`src/test/renderWithTheme.tsx`** (или ввести общий `renderWithProviders`) обёрткой **`ConfigProvider`** с той же темой, что в приложении; по мере миграции убрать дублирование **`ThemeProvider`** из отдельных тестов, где достаточно хелпера.
- [ ] Подключить стили antd в **`src/main.tsx`** или в точке, принятой в проекте (без дублирования).

### Фаза 2 — `src/components`

- [ ] **`src/components/Button/`** — перевести на **antd** `Button` (или обёртку), обновить сторис и тесты, снапшот.
- [ ] **`src/components/Select/`** — **antd** `Select`, обновить сторис и тесты, снапшот.
- [ ] **`src/components/Badge/`** — **antd** `Tag` / `Badge`, обновить сторис и тесты, снапшот.
- [ ] **`src/components/index.ts`** — явные реэкспорты без изменения публичного API барреля (при необходимости — только внутренняя реализация).

### Фаза 2 — `App`

- [ ] `src/App/components/AppPageLayout/` — **Layout** / контент antd, сохранить поведение; обновить тесты и снапшоты.
- [ ] `src/App/components/AppNav/`, `src/App/containers/AppNavContainer/` — навигация (при необходимости **Menu**); тесты и снапшоты.
- [ ] `src/App/RequireAuth.tsx`, `src/App/__tests__/` — при появлении antd в дереве — обёртка из тестового хелпера.

### Фаза 2 — страницы (тонкие оболочки)

- [ ] Проверить импорты/разметку в `src/pages/HomePage/`, `src/pages/LoginPage/`, `src/pages/RegisterPage/`, `src/pages/AdminPage/`, `src/pages/ExerciseHistoryPage/`, `src/pages/authPaths.ts` — правки только при несовместимости с новым layout.

### Фаза 2 — Login

- [ ] `src/modules/LoginModule/components/LoginForm/` — **Form**, **Input**, **Button** antd, сообщения об ошибках (**`message`** / **`Alert`**); стили, тесты, сторис.
- [ ] `src/modules/LoginModule/components/LoginPageShell/` — оболочка на **Layout** / **Typography**; тесты, сторис.
- [ ] `src/modules/LoginModule/containers/LoginFormContainer/`, `src/modules/LoginModule/__tests__/` (включая `LoginModule.api.test.tsx`).

### Фаза 2 — Registration

- [ ] `src/modules/RegistrationModule/components/RegisterForm/` — как для Login, с полями регистрации; тесты, сторис.
- [ ] `src/modules/RegistrationModule/components/RegisterPageShell/`; `src/modules/RegistrationModule/containers/RegisterFormContainer/`; `__tests__/` (включая api).

### Фаза 2 — Admin, Exercise history

- [ ] `src/modules/AdminModule/components/AdminPageShell/`, `AdminPageStub/` — **Layout**, **Result** / **Card** по смыслу; тесты, сторис.
- [ ] `src/modules/ExerciseHistoryModule/components/ExerciseHistoryPageShell/`, `ExerciseHistoryPageStub/` — аналогично; тесты, сторис.

### Фаза 3 — Home (после стабилизации auth и shell)

- [ ] `src/modules/HomeModule/components/HomeLayout/` — **Space** / **Row** / **Col** / **Flex** antd, где уместно; сохранить структуру страницы.
- [ ] `src/modules/HomeModule/components/ExerciseControlBar/` — кнопки/селекты через antd; тесты, сторис.
- [ ] `src/modules/HomeModule/components/WorkoutStatusBar/` (зависит от **Badge** из `@components`) — согласовать с новым **Badge**; тесты, сторис.
- [ ] `src/modules/HomeModule/containers/StageContainer/`, `ExerciseControlBarContainer/`, `StatusBarContainer/` — обновить снапшоты при изменении разметки.
- [ ] `src/modules/HomeModule/components/Stage/` — по необходимости: минимальные вставки antd; **камера/оверлей** — по плану оставить на **styled-components**.

### Фаза 4 — зачистка и документация

- [ ] Удалить неиспользуемые фрагменты **`*.styled.tsx`**; упростить оставшиеся.
- [ ] Оценить необходимость **`styled-components`** в продакшен-зависимостях, если кастомных стилей мало; не удалять преждевременно, пока **Home/Stage** на styled.
- [ ] Обновить **`.cursor/rules/components.mdc`** и при согласовании командой **`docs/components.md`** — смешанный стек (antd + styled для исключений).
- [ ] **`npm run lint`**, **`npm test`**, **`npm run build`**, при необходимости **`npm run build:analyze`**.

### Архив

- [ ] Третий коммит цикла: перенос `specs/refactor/antd-migration/` в `specs/refactor/_archive/antd-migration/`, исправить относительные ссылки в переносимых md по `docs/markdown-paths.md`.

---

## Путевой указатель (основные файлы)

**Тема и вход:** `src/App/App.tsx`, `src/main.tsx`, `src/theme/theme.ts`, `src/theme/globalStyle.tsx`, `src/theme/index.ts`  
**Тесты-утилита:** `src/test/renderWithTheme.tsx`  
**Общие компоненты:** `src/components/Button/`, `Select/`, `Badge/`  
**App:** `src/App/components/AppPageLayout/`, `AppNav/`, `src/App/containers/AppNavContainer/`  
**Auth:** `src/modules/LoginModule/components/`, `src/modules/RegistrationModule/components/`  
**Остальные модули:** `src/modules/AdminModule/components/`, `src/modules/ExerciseHistoryModule/components/`  
**Home:** `src/modules/HomeModule/components/` (в т.ч. `HomeLayout`, `ExerciseControlBar`, `WorkoutStatusBar`, `Stage`), `containers/`

**Тесты с явным `ThemeProvider` (синхронизировать с хелпером):**  
`src/modules/LoginModule/__tests__/`, `src/modules/RegistrationModule/__tests__/`, `src/App/__tests__/RequireAuth.test.tsx`, `src/App/components/AppPageLayout/__tests__/`
