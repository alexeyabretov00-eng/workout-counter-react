# Задачи: exercises-subfolders

План: [plan.md](./plan.md)

- [x] Создать подпапки `ArmyPressDetector/`, `BicepsCurlDetector/`, `HeadSideTiltDetector/`, `SquatDetector/` с `index.ts` (явные реэкспорты) в каждой.
- [x] Перенести файлы `*Detector.ts` в соответствующие подпапки; обновить импорты (`../../utils`, `../types`).
- [x] Обновить баррель `src/exercises/index.ts` — реэкспорты из подпапок вместо корневых файлов детекторов.
- [x] В `src/exercises/registry.ts` заменить `import.meta.glob` на шаблон для вложенных путей (например `./**/*Detector.ts`); при необходимости тип `ExerciseDetector` из `./types`.
- [x] Удалить старые корневые `*Detector.ts`; прогнать тесты.
- [x] При необходимости кратко зафиксировать структуру `src/exercises` в `docs/` (если есть подходящий раздел или README).
