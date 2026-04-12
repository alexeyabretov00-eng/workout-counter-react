# Задачи: универсальный компонент `Badge`

План: [./plan.md](./plan.md)

## Чеклист

- [ ] Создать `src/components/Badge/Badge.styled.tsx`: общая база пилюли (эквивалент нынешнего `pillBase`) и ветвление по transient `$variant` с токенами из `theme.palette` (как в текущих `WorkoutStatusBar*` бейджах).
- [ ] Создать `src/components/Badge/Badge.tsx`: пропсы `children`, `variant` (и при необходимости экспорт типа варианта); рендер через корневой styled-элемент с префиксом виджета (например `BadgeRoot`).
- [ ] Добавить `src/components/Badge/index.ts` с явным реэкспортом `Badge` и типов.
- [ ] Обновить `src/components/index.ts`: явный реэкспорт `Badge` (и типов при наличии).
- [ ] В `src/components/WorkoutStatusBar/WorkoutStatusBar.tsx` вычислять `variant` для модели, камеры, голоса и заметки о паузе по правилам из плана; заменить разметку на `Badge`.
- [ ] Удалить из `src/components/WorkoutStatusBar/WorkoutStatusBar.styled.tsx` styled-компоненты пилюль, перенесённые в `Badge`; сохранить `WorkoutStatusBarRoot` и `WorkoutStatusBarCameraError` (или эквивалент без смены вида).
- [ ] Запустить `npm test` и `npm run build`; при необходимости ручная проверка статус-бара.

После завершения цикла: третий коммит — перенос каталога `specs/refactor/badge/` в `specs/refactor/_archive/badge/` и правка относительных ссылок в markdown при необходимости.
