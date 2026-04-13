# Задачи: динамические роуты из реестра страниц

План: [dynamic-routes-from-pages-plan.md](./dynamic-routes-from-pages-plan.md).

## Чеклист

- [x] Зафиксировать формат модуля страницы: **`src/pages/<Name>/index.tsx`** с экспортом **`routes: RouteObject[]`**; навигация через **`route.handle.nav`** (`label`, опционально **`end`**, **`sort`**). Glob в сборщике: **`import.meta.glob('../pages/*/index.tsx', { eager: true })`**.
- [x] **`HomePage`**, **`AdminPage`**, **`ExerciseHistoryPage`**: каждая папка экспортирует свой **`routes`**; сборщик **`src/routes/routes.ts`** объединяет массивы и строит **`navItems`**. Отдельный **`paths.ts`** / объект **`ROUTES`** не используются.
- [x] Корневое приложение: **`src/App/App.tsx`** — **`createBrowserRouter`** с родителем **`AppPageLayout`** и **`children: [...routes]`** (не ручной перечень элементов маршрута в JSX).
- [x] **`AppNav`**: пункты только из **`navItems`**, без хардкода путей.
- [x] Баррель **`src/routes/index.ts`** реэкспортирует **`routes`** и **`navItems`**; в **`index.tsx`** страниц — локальные импорты компонентов, без импорта барреля **`pages`** из файла, который подхватывает glob.
- [x] Проверки: **`npm run lint`**, **`npm run build`**, **`npm run test`**; ручной проход **`/home`**, **`/admin`**, **`/history`** и несуществующего пути (редирект на **`/home`**).

## Примечания к реализации

- **Маркер = `index.tsx`** страницы, а не отдельный `pageRoute.ts`: glob намеренно узкий — только **`pages/*/index.tsx`**, без **`*.styled.tsx`**, тестов и вложенных **`pages/Foo/Bar/index.tsx`**.
- Порядок пунктов шапки задаётся **`handle.nav.sort`** при сборке **`navItems`** в **`routes.ts`**.
- Catch-all **`'*'`** сейчас живёт в **`src/pages/HomePage/index.tsx`**; при расширении набора маршрутов при необходимости перенести или упорядочить в сборщике (см. §3.2 плана).

После переноса спеки в **`_archive`** обновить относительные пути в markdown по [docs/markdown-paths.md](../../../docs/markdown-paths.md).
