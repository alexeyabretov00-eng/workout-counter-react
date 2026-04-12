# Задачи: универсальный компонент `Badge`

План: [./plan.md](./plan.md)

## Чеклист

- [x] Создать `src/components/Badge/Badge.styled.tsx`: общая база пилюли (эквивалент нынешнего `pillBase`) и ветвление по transient `$variant` с токенами из `theme.palette` (как в текущих `WorkoutStatusBar*` бейджах).
- [x] Создать `src/components/Badge/Badge.tsx`: пропсы `children`, `variant` (и при необходимости экспорт типа варианта); рендер через корневой styled-элемент с префиксом виджета (например `BadgeRoot`).
- [x] Добавить `src/components/Badge/index.ts` с явным реэкспортом `Badge` и типов.
- [x] Обновить `src/components/index.ts`: явный реэкспорт `Badge` (и типов при наличии).
- [x] В `src/components/WorkoutStatusBar/WorkoutStatusBar.tsx` вычислять `variant` для модели, камеры, голоса и заметки о паузе по правилам из плана; заменить разметку на `Badge`.
- [x] Удалить из `src/components/WorkoutStatusBar/WorkoutStatusBar.styled.tsx` styled-компоненты пилюль, перенесённые в `Badge`; сохранить `WorkoutStatusBarRoot` и `WorkoutStatusBarCameraError` (или эквивалент без смены вида).
- [x] Запустить `npm test` и `npm run build`; при необходимости ручная проверка статус-бара.

После завершения цикла: третий коммит — перенос каталога `specs/refactor/badge/` в `specs/refactor/_archive/badge/` и правка относительных ссылок в markdown при необходимости.
