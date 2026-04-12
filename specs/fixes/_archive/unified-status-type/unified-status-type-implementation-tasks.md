# Задачи реализации: единый тип статусов

План исправления: [unified-status-type-plan.md](./unified-status-type-plan.md).

## Чеклист

- [x] Добавить общий тип статуса в `src/types` и настроить папочный экспорт через `index.ts`.
- [x] Перевести `src/hooks/useCameraStream.ts` на общий тип статуса.
- [x] Перевести `src/hooks/useWorkoutSession.ts` и `src/App.tsx` на общий тип статуса.
- [x] Обновить `src/hooks/index.ts` и связанные импорты после удаления локального `ModelStatus`.
- [x] Обновить документацию с упоминанием нового слоя `src/types`.
- [x] Прогнать `npm run lint` и `npm run test`.
