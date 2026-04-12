# Задачи: вынести select из `App.tsx`

План: [./select-plan.md](./select-plan.md)

## Чеклист

- [x] Создать `src/components/Select/Select.tsx` с одним компонентом `Select` (label + нативный select + options из пропсов).
- [x] Добавить `src/components/Select/Select.css` со стилями поля и подписи; импортировать его в `Select.tsx`.
- [x] Перенести из `src/App.css` в `Select.css` правила, относящиеся к подписи и `<select>` в controls; оставить в `App.css` раскладку `.controls` и стили кнопок; внешний вид без регрессии.
- [x] Добавить `src/components/Select/index.ts` с явным реэкспортом компонента.
- [x] Добавить `src/components/index.ts` с явным реэкспортом из `./Select`.
- [x] Подключить `Select` в `src/App.tsx` для выбора упражнения и для выбора длительности отдыха; сохранить текущие `id`, подписи, `disabled` и преобразование значения для минут.
- [x] Запустить тесты и сборку проекта; убедиться в отсутствии регрессии.

После выполнения реализации каталог `specs/refactor/select/` переносится в `specs/refactor/_archive/select/` отдельным коммитом цикла (см. корневой `README.md`).
