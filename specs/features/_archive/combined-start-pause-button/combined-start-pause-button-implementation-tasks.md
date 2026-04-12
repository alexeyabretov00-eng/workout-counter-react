# Задачи: одна кнопка «Старт / Пауза»

План: [combined-start-pause-button-plan.md](./combined-start-pause-button-plan.md).

## Чеклист

- [x] Заменить пару кнопок в `src/App.tsx` на одну с переключаемой подписью и `onClick` (`start` / `pause`), корректным `disabled` и доступностью (`aria-label` / тип кнопки).
- [x] Обновить описание UI в `README.md` (раздел «Функции приложения»).
- [x] Обновить `docs/architecture.md` (упоминание кнопок в `App.tsx` и при необходимости жизненный цикл с точки зрения UI).
- [x] При необходимости кратко зафиксировать в `docs/voice-commands.md`, что в интерфейсе старт и пауза представлены одной кнопкой.
- [x] Выполнить `npm run lint` и `npm run test`.
