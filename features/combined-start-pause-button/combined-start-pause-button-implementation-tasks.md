# Задачи: одна кнопка «Старт / Пауза»

План: [combined-start-pause-button-plan.md](./combined-start-pause-button-plan.md).

## Чеклист

- [ ] Заменить пару кнопок в `src/App.tsx` на одну с переключаемой подписью и `onClick` (`start` / `pause`), корректным `disabled` и доступностью (`aria-label` / тип кнопки).
- [ ] Обновить описание UI в [README.md](../../README.md) (раздел «Функции приложения»).
- [ ] Обновить [docs/architecture.md](../../docs/architecture.md) (упоминание кнопок в `App.tsx` и при необходимости жизненный цикл с точки зрения UI).
- [ ] При необходимости кратко зафиксировать в [docs/voice-commands.md](../../docs/voice-commands.md), что в интерфейсе старт и пауза представлены одной кнопкой.
- [ ] Выполнить `npm run lint` и `npm run test`.
