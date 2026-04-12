# Рефакторинг: упражнения в подпапках

## Контекст

Сейчас детекторы лежат плоским списком в `src/exercises/` (`*Detector.ts`), а реестр собирается через `import.meta.glob('./*Detector.ts', …)` в `src/exercises/registry.ts`. Публичный API каталога — баррель `src/exercises/index.ts`; снаружи импорты идут только из `../exercises` или `../../exercises`.

## Цель

Разнести **каждое упражнение в свою подпапку** с явным `index.ts` (без `export *`), сохранив поведение приложения и состав реестра активных детекторов.

## Соглашение по структуре

- Подпапки в **PascalCase**, имя совпадает с префиксом детектора:
  - `ArmyPressDetector/`, `BicepsCurlDetector/`, `HeadSideTiltDetector/`, `SquatDetector/`.
- В каждой подпапке: файл реализации `*Detector.ts` и `index.ts` с явным реэкспортом детектора.
- В корне `src/exercises/` остаются `types.ts`, `registry.ts`, `index.ts`, каталог `__tests__/`.

## Импорты внутри детекторов

После переноса на один уровень глубже:

- `../utils` → `../../utils`.
- Тип `ExerciseDetector` — единообразно из `../types` (не из барреля `'.'`), чтобы не усложнять граф зависимостей.

## Реестр

В `src/exercises/registry.ts` заменить glob на вложенные файлы, например `./**/*Detector.ts`, чтобы подхватывались детекторы в подпапках. Импорт типа `ExerciseDetector` в `registry.ts` привести к `from './types'` (по желанию — для ясности, без циклов через баррель).

## Внешние потребители

Менять импорты в `src/logic`, `src/hooks`, `src/containers`, `src/utils` **не требуется**, если `src/exercises/index.ts` по-прежнему реэкспортирует те же символы (`exerciseRegistry`, отдельные детекторы, типы).

## Проверка отсутствия регрессии

- Прогон тестов: `src/exercises/__tests__/detectors.test.ts` и полный набор тестов проекта (`npm test` или принятый скрипт).
- Ручная проверка: выбор упражнения, смена упражнения, подсчёт повторений для 2–3 детекторов (как минимум сценарии, покрытые тестами).

## Связанные правила

- Ветка задачи: `refactor/exercises-subfolders` (см. `.cursor/rules/work-in-branch.mdc`).
- Цикл коммитов: план → реализация → архив в `specs/refactor/_archive/exercises-subfolders/` (см. `.cursor/rules/feature-planning.mdc`).
- Баррели без `export *`: `.cursor/rules/imports-via-index.mdc`.
