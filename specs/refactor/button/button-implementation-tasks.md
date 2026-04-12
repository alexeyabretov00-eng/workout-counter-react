# Задачи: вынести кнопки из `App.tsx`

План: [./button-plan.md](./button-plan.md)

## Чеклист

- [x] Создать `src/components/Button/Button.tsx` с компонентом `Button` (`type="button"`, пропсы `children`, `onClick`, `disabled`, опционально `aria-label`).
- [x] Добавить `src/components/Button/Button.css` и перенести в него стили из `App.css` для `.controls button` (включая `:hover` и `:disabled`); использовать явный класс на `<button>`.
- [x] Добавить `src/components/Button/index.ts` с явным реэкспортом.
- [x] Обновить `src/components/index.ts`: явный реэкспорт `Button` (и типов при наличии).
- [x] Заменить три кнопки в `src/App.tsx` на `Button`; сохранить логику кликов, `disabled` и `aria-label`.
- [x] Убрать из `src/App.css` перенесённые правила кнопок, оставить раскладку `.controls`.
- [x] Запустить тесты и сборку; убедиться в отсутствии регрессии.

После завершения реализации каталог `specs/refactor/button/` переносится в `specs/refactor/_archive/button/` отдельным коммитом цикла (см. корневой `README.md`).
