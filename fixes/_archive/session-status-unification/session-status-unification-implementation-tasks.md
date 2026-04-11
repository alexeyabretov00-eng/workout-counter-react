# Задачи реализации: единый sessionStatus в useWorkoutSession

План исправления: [session-status-unification-plan.md](./session-status-unification-plan.md).

## Чеклист

- [x] Добавить `SessionStatus` и заменить три булевых `useState` на единый статус в `useWorkoutSession`.
- [x] Обновить переходы состояния в `start`, `pause`, `stopSession`, включая сценарий отдыха.
- [x] Сохранить внешний API хука (`isRunning`, `isPaused`, `isRestCountdownActive`) через вычисляемые значения.
- [x] Проверить `npm run lint` и `npm run test`.
