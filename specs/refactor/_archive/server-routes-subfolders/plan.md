# План: декомпозиция роутов сервера по подпапкам

## Контекст

Файлы `server/src/routes/authRoutes.ts`, `server/src/routes/adminUserRoutes.ts` и `server/src/routes/adminExerciseRoutes.ts` содержат сразу несколько endpoint-обработчиков и разнородную логику в одном месте.

Это затрудняет поддержку и локальные изменения, особенно при расширении админских и auth-сценариев.

## Цель

- Сгруппировать серверные роуты по папкам предметных областей (`auth`, `admin/users`, `admin/exercises`).
- Уменьшить размер отдельных файлов за счёт декомпозиции endpoint-обработчиков.
- Сохранить текущие URL, коды ответов и структуру JSON без изменений поведения.

## Область изменений

- `server/src/routes/index.ts`
- `server/src/routes/authRoutes.ts`
- `server/src/routes/adminUserRoutes.ts`
- `server/src/routes/adminExerciseRoutes.ts`
- новые файлы в `server/src/routes/auth/`, `server/src/routes/admin/users/`, `server/src/routes/admin/exercises/`

## Ограничения и инварианты

- Публичные HTTP-контракты и права доступа остаются неизменными.
- Текущие проверки валидации и обработка ошибок сохраняются.
- Внешняя точка подключения роутов (`createApiRouter`) продолжает работать без изменения потребителей.

## Проверка отсутствия регрессии

- `npm run lint`
- `npm run test`
- smoke-проверка ключевых endpoint: `/register`, `/login`, `/admin/users`, `/admin/exercises`
