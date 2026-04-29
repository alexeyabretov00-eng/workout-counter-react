# Задачи: декомпозиция роутов сервера по подпапкам

План: `specs/refactor/server-routes-subfolders/plan.md`

## Чеклист

- [x] Создать целевую структуру подпапок роутов для `auth`, `admin/users`, `admin/exercises`.
- [x] Вынести endpoint-обработчики из `authRoutes.ts` в отдельные файлы и оставить компактный сборщик роутера.
- [x] Вынести endpoint-обработчики из `adminUserRoutes.ts` в отдельные файлы и оставить компактный сборщик роутера.
- [x] Вынести endpoint-обработчики из `adminExerciseRoutes.ts` в отдельные файлы и оставить компактный сборщик роутера.
- [x] Обновить импорты в `server/src/routes/index.ts` на новую структуру.
- [x] Прогнать проверки (`npm run lint`, `npm run test`) и устранить найденные проблемы.
