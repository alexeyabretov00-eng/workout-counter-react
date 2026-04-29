# План: декомпозиция ExerciseCatalogManager

## Контекст

`ExerciseCatalogManager` содержит в одном файле логику открытия drawer, форму создания, таблицу и форму редактирования раскрытой строки. Из-за этого компонент разросся и его сложнее читать, тестировать и менять безопасно.

## Цель

Разделить `ExerciseCatalogManager` на несколько небольших компонентов внутри текущей папки без изменения поведения экрана админки.

## Подход

1. Вынести общие типы менеджера в отдельный файл.
2. Вынести форму создания упражнения в отдельный компонент drawer.
3. Вынести таблицу упражнений и форму редактирования раскрытой строки в отдельные компоненты.
4. Оставить в `ExerciseCatalogManager` только оркестрацию и связывание пропсов.

## Проверка

- Визуально и функционально менеджер упражнений работает как раньше.
- Тест `ExerciseCatalogManager` проходит без изменений поведения.
- `eslint` для `src/modules/AdminModule` проходит без ошибок.

## Связанные файлы

- `src/modules/AdminModule/components/ExerciseCatalogManager/ExerciseCatalogManager.tsx`
- `src/modules/AdminModule/components/ExerciseCatalogManager/ExerciseCatalogCreateDrawer.tsx`
- `src/modules/AdminModule/components/ExerciseCatalogManager/ExerciseCatalogExercisesTable.tsx`
- `src/modules/AdminModule/components/ExerciseCatalogManager/ExerciseCatalogEditForm.tsx`
- `src/modules/AdminModule/components/ExerciseCatalogManager/types.ts`
