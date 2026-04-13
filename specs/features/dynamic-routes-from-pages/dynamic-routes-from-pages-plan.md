# План: динамическое формирование роутов из описания страниц

Связанный чеклист: [dynamic-routes-from-pages-implementation-tasks.md](./dynamic-routes-from-pages-implementation-tasks.md).

## 1. Контекст и проблема

- Раньше каждая новая страница требовала правок в нескольких местах: константы путей, перечисление `<Route>` в корне приложения, при необходимости дублирование путей в `AppNav`.
- Риск рассинхрона: путь в одном файле, элемент маршрута — в другом, пункт навигации — в третьем.
- **Цель:** маршруты и данные для навигации собираются из **модулей страниц** через **`import.meta.glob`** (Vite), без ручного списка маршрутов в `App` и без отдельного центрального реестра путей, который нужно править при каждом добавлении страницы.

## 2. Границы фичи

**Входит:**

- Соглашение по **входному файлу страницы** `src/pages/<ИмяСтраницы>/index.tsx`: именованный экспорт **`routes`** — массив **`RouteObject`** из `react-router` / `react-router-dom` (элементы, `path`, при необходимости `index`, `handle` и т.д.). Компонент страницы импортируется в том же файле **локально** (из `./HomePage` и т.п.), без импорта из барреля `src/pages`, чтобы не плодить циклы с `src/routes`.
- В **`src/routes/routes.ts`** — **один** сборщик: `import.meta.glob('../pages/*/index.tsx', { eager: true })`, обход модулей, объединение всех массивов `routes` в один список.
- **Навигация:** из поля **`route.handle`** (тип в сборщике: `nav?: { label; end?; sort? }`) строится **`navItems`** — порядок по **`sort`** (по умолчанию в конец). У маршрута без `handle.nav` пункта в шапке нет.
- Корневой **`src/App/App.tsx`:** `createBrowserRouter` с родительским маршрутом **`element: <AppPageLayout />`** и **`children: [...routes]`** из сборщика. **`AppPageLayout`** рендерит **`AppNav`** с **`navItems`** и **`<Outlet />`**.

**Не входит (отдельные задачи при необходимости):**

- Lazy-loading страниц (`eager: false` и `React.lazy`).
- Защищённые маршруты, вложенные layout-ы в реестре страниц.
- Смена сборщика или библиотеки маршрутизации.

## 3. Модель данных и `import.meta.glob`

### 3.1. Экспорт из `src/pages/<Name>/index.tsx`

- Обязательно: **`export const routes: RouteObject[]`** (непустой массив, иначе модуль игнорируется сборщиком).
- Обычно в том же файле: **`export { <Name>Page }`** для барреля **`src/pages/index.ts`**.
- Метаданные для шапки — в **`handle.nav`** у соответствующего **`RouteObject`**:
  - **`label: string`** — подпись ссылки;
  - **`end?: boolean`** — передаётся в **`NavLink`** (`end`);
  - **`sort?: number`** — порядок в **`AppNav`** (меньше — раньше; без поля — в конец списка).

Отдельного файла-маркера (`pageRoute.ts`) **нет**: роль маркера выполняет **`index.tsx`** страницы.

### 3.2. Сборщик `src/routes/routes.ts`

- **`import.meta.glob<PageIndexModule>('../pages/*/index.tsx', { eager: true })`** — только **прямые** подпапки `pages` (один уровень `*`), без вложенных путей вида `pages/Foo/Bar/index.tsx`.
- Для каждого модуля: если **`routes`** — не массив или пустой, пропуск; иначе **`list.push(...routes)`**.
- Экспорт **`routes`** (итоговый плоский массив для **`createBrowserRouter`**) и **`navItems`** (результат **`buildNavItems(routes)`**).

**Catch-all** (`path: '*'`, редирект на главную) сейчас объявлен в **`src/pages/HomePage/index.tsx`** вместе с маршрутом главной; при добавлении страниц следите за тем, чтобы **самый общий** маршрут оставался корректным относительно порядка в React Router (при сомнениях — вынос fallback в сборщик последним явным шагом).

### 3.3. Ограничения Vite

- API **`import.meta.glob`** специфичен для Vite; строка glob — **статический литерал**.
- Типобезопасные константы путей (**`ROUTES`**, **`paths.ts`**) **не используются**: пути задаются в **`RouteObject.path`**; при необходимости жёстких типов — отдельная задача (тест на полноту, codegen и т.д.).

### 3.4. Баррель `src/pages/index.ts`

- По правилам проекта публичные страницы реэкспортируются явно; **`index.tsx`** страницы не заменяет баррель для кода, который импортирует страницу из **`./pages`**.

## 4. Слои и импорты

| Узел | Роль |
|------|------|
| `src/pages/<Name>/index.tsx` | Локальный импорт компонента страницы, экспорт **`routes`** (+ реэкспорт страницы). |
| `src/routes/routes.ts` | Glob, **`routes`**, **`navItems`**. |
| `src/routes/index.ts` | Баррель: **`routes`**, **`navItems`**. |
| `src/App/App.tsx` | Тема, **`RouterProvider`**, **`createBrowserRouter`** с **`AppPageLayout`** и **`children: [...routes]`**. |
| `src/App/AppPageLayout.tsx` | **`AppNav items={navItems}`**, **`<Outlet />`**. |
| `src/components/AppNav` | Только отображение списка **`{ path, label, end? }`**; без хардкода путей. |

## 5. Текущие маршруты (снимок реализации)

| Путь | Страница | В шапке |
|------|-----------|---------|
| `/home` | `HomePage` | да (`Главная`, `end`, `sort: 0`) |
| `/admin` | `AdminPage` | да (`Админка`, `sort: 1`) |
| `/history` | `ExerciseHistoryPage` | да (`История`, `sort: 2`) |
| `*` | редирект на **`/home`** | нет |

Главная с тренировкой: **`WorkoutLogicLayout`** и контейнеры остаются **внутри `HomePage`**, не в корневом роутере.

## 6. Критерии готовности

- Новая обычная страница: папка в **`pages/`**, компонент, **`index.tsx`** с экспортом **`routes`** (и при необходимости **`handle.nav`**), запись в **`src/pages/index.ts`**; **не** добавлять маршрут вручную в **`App.tsx`** и **не** дублировать путь в **`AppNav`**.
- **`App.tsx`** не содержит перечисления известных страниц — только подключение **`routes`** из **`../routes`** и layout.
- **`npm run build`**, **`npm run lint`**, **`npm run test`** проходят.

## 7. Риски

- **Циклы импорта:** страница не импортирует **`routes.ts`**; ссылки в UI — строки **`to={path}`** из **`navItems`** или литералы, согласованные с **`RouteObject`**.
- **Порядок в `RouteObject[]`:** порядок модулей из **`Object.values(glob)`** может зависеть от среды; при конфликтах приоритета маршрутов — явная сортировка в сборщике или вынесение **`'*'`** в конец списка в коде.
- **Ошибка в описании маршрута** — отладка и тесты вручную по URL.

## 8. Связь с GitHub

**Milestone:** [Фича: динамические роуты из реестра страниц](https://github.com/alexeyabretov00-eng/workout-counter-react/milestone/2)

**Issues (эпик и подзадачи):**

| Issue | Роль |
|-------|------|
| [#16](https://github.com/alexeyabretov00-eng/workout-counter-react/issues/16) | Эпик / план |
| [#17](https://github.com/alexeyabretov00-eng/workout-counter-react/issues/17) | Контракт и ограничения glob |
| [#18](https://github.com/alexeyabretov00-eng/workout-counter-react/issues/18) | Сборщик в `src/routes/` |
| [#21](https://github.com/alexeyabretov00-eng/workout-counter-react/issues/21) | Корневой роутер + layout |
| [#19](https://github.com/alexeyabretov00-eng/workout-counter-react/issues/19) | `AppNav` из производных данных |
| [#20](https://github.com/alexeyabretov00-eng/workout-counter-react/issues/20) | Проверки CI и ручной проход URL |

Источник правды по тексту и чеклисту — каталог **`specs/features/dynamic-routes-from-pages/`** в git.
