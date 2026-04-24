# Задачи: динамическая регистрация редьюсеров модулей

План: [./plan.md](./plan.md)

## Чеклист

- [x] Добавить `src/store/reducerRegistry.ts` с загрузкой модульных `reducer`-экспортов из `src/modules/*/index.ts`.
- [x] Перевести `src/store/store.ts` на `ReducerRegistry`, оставив `auth` статическим редьюсером.
- [x] Добавить в `src/modules/AdminModule/index.ts` экспорт `reducer` с ключом `admin`.
- [x] Добавить в `src/modules/HomeModule/index.ts` экспорт `reducer` с ключом `home`.
- [x] Проверить изменённые файлы через `ReadLints` и устранить новые ошибки.
