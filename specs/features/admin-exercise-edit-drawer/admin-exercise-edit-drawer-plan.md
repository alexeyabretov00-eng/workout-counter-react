# План: редактирование упражнения в Drawer

## Контекст

В `AdminModule` редактирование карточки упражнения выполняется через раскрытие строки таблицы. Этот сценарий неудобен при длинной форме и плохо масштабируется. Требуется перенести редактирование в отдельный `Drawer`, сохранив текущие операции обновления и архивирования.

## Цель

Сделать единый UX редактирования упражнения в `Drawer`:
- открытие из строки таблицы;
- предзаполнение формы данными выбранного упражнения;
- сохранение и архивирование из `Drawer`;
- закрытие по кнопке и после успешного сохранения.

## Что затрагиваем

- `src/modules/AdminModule/components/ExerciseCatalogManager/ExerciseCatalogManager.tsx`
- `src/modules/AdminModule/components/ExerciseCatalogManager/ExerciseCatalogExercisesTable.tsx`
- `src/modules/AdminModule/components/ExerciseCatalogManager/ExerciseCatalogEditForm.tsx`
- тест `src/modules/AdminModule/components/ExerciseCatalogManager/__tests__/ExerciseCatalogManager.test.tsx`

## Нефункциональные требования

- Не ломать публичный API `ExerciseCatalogManager`.
- Сохранить типы и стиль компонентов, принятые в модуле.
- Не добавлять новые зависимости.

## Проверка регрессий

1. Unit-тесты `ExerciseCatalogManager`.
2. Проверка lint для измененных файлов.
3. Ручная проверка: открыть drawer редактирования, изменить поля, сохранить/архивировать.
