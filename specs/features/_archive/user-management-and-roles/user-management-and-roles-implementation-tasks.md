# Задачи реализации: управление пользователями и роли доступа

План: [user-management-and-roles-plan.md](./user-management-and-roles-plan.md)

## Чеклист

- [x] Расширить таблицу `users` в `server/src/db.ts` полями `role`, `must_change_password` и сделать backfill существующих записей (`role = user`).
- [x] Добавить сидинг пользователей `admin` и `superadmin` с паролем `12345678` и `must_change_password = 1`.
- [x] Расширить auth API (`/api/register`, `/api/login`, `/api/me`) и типы пользователя полями роли и `mustChangePassword`.
- [x] Добавить серверные role-check helper'ы и ограничить админ-эндпоинты минимум ролью `admin`.
- [x] Добавить API `GET /api/admin/users` и `PATCH /api/admin/users/:id` (смена роли) только для `superadmin`.
- [x] Добавить API смены пароля текущего пользователя с сбросом `must_change_password`.
- [x] Обновить frontend auth/store/api типы и thunk'и под новые поля.
- [x] Реализовать role-based route guard и фильтрацию навигации по роли.
- [x] Добавить страницу/маршрут смены пароля с принудительным редиректом при `mustChangePassword = true`.
- [x] Создать `UserManagementModule` и страницу управления пользователями для `superadmin`.
- [x] Обновить документацию по ролям и начальному доступу.
- [x] Прогнать `npm run lint`.
- [x] Прогнать `npm run test`.
