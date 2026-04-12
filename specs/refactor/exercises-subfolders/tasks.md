# Задачи: exercises-subfolders

План: [plan.md](./plan.md)

- [ ] Создать подпапки `ArmyPressDetector/`, `BicepsCurlDetector/`, `HeadSideTiltDetector/`, `SquatDetector/` с `index.ts` (явные реэкспорты) в каждой.
- [ ] Перенести файлы `*Detector.ts` в соответствующие подпапки; обновить импорты (`../../utils`, `../types`).
- [ ] Обновить баррель `src/exercises/index.ts` — реэкспорты из подпапок вместо корневых файлов детекторов.
- [ ] В `src/exercises/registry.ts` заменить `import.meta.glob` на шаблон для вложенных путей (например `./**/*Detector.ts`); при необходимости тип `ExerciseDetector` из `./types`.
- [ ] Удалить старые корневые `*Detector.ts`; прогнать тесты.
- [ ] При необходимости кратко зафиксировать структуру `src/exercises` в `docs/` (если есть подходящий раздел или README).
