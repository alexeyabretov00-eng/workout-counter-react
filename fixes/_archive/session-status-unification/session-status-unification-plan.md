# План исправления: единый sessionStatus в useWorkoutSession

## 1. Контекст

В `useWorkoutSession` состояние сессии хранится тремя отдельными флагами:

- `isRunning`
- `isPaused`
- `isRestCountdownActive`

Это увеличивает когнитивную нагрузку и оставляет пространство для несогласованных комбинаций.

## 2. Цель

Перевести внутреннюю модель `useWorkoutSession` на единый `sessionStatus` и вычислять публичные булевы флаги из него.

## 3. Подход

- Добавить тип `SessionStatus` в `useWorkoutSession` (`idle | running | paused | rest`).
- Заменить три `useState` на один `useState<SessionStatus>`.
- Обновить переходы статусов в `start`, `pause`, `stopSession` и в rest countdown.
- Оставить внешний API хука совместимым: вернуть те же `isRunning`, `isPaused`, `isRestCountdownActive` как вычисляемые значения.

## 4. Критерии готовности

- Внутри `useWorkoutSession` используется единый `sessionStatus`.
- Переходы по жизненному циклу сессии корректны: запуск, пауза, остановка, отдых.
- Публичный контракт хука для `App.tsx` не сломан.
- `npm run lint` и `npm run test` проходят.
