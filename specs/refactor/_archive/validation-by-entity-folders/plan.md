# План рефакторинга: валидация по папкам сущностей

Ссылка на процесс: `README.md`, `specs/refactor/README.md`.

## Контекст

В `server/src/validation` валидации упражнений и сетов лежат рядом с auth/user файлами в одном плоском слое.  
Это усложняет навигацию и масштабирование при росте числа валидаторов.

## Цель

- Разделить валидацию упражнений и сетов по отдельным подпапкам в `server/src/validation`.
- Сохранить публичный API `server/src/validation/index.ts` без изменения поведения роутов.

## Границы

- Без изменения бизнес-логики валидации.
- Без изменения формата ошибок и текстов сообщений.

## Подход

1. Создать `server/src/validation/exercises`:
   - `types.ts`, `constants.ts`, `helpers.ts`, `create.ts`, `update.ts`, `index.ts`.
2. Создать `server/src/validation/exercise-sets`:
   - `types.ts`, `validation.ts`, `index.ts`.
3. Обновить корневой `server/src/validation/index.ts` на реэкспорт из новых папок.
4. Оставить в `server/src/validation/types.ts` только общие auth/user типы.
5. Прогнать lint и релевантные тесты.

## Критерии готовности

- Файлы упражнений и сетов разнесены по отдельным папкам.
- Импорты в серверных роутингах продолжают работать через `server/src/validation/index.ts`.
- Линт и релевантные тесты проходят.
