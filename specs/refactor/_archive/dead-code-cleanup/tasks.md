# Задачи: убрать неиспользуемые публичные экспорты

План: `specs/refactor/dead-code-cleanup/plan.md`

## Чеклист

- [x] Убрать неиспользуемый экспорт `AuthClient` из API-барреля и файла клиента.
- [x] Убрать неиспользуемый экспорт `routes` из барреля роутов.
- [x] Убрать неиспользуемый экспорт `HomeModuleSlice` из store-барреля HomeModule.
- [x] Убрать неиспользуемые реэкспорты styled-элементов `AppPageContent` и `AppPageLayoutRoot` из публичных баррелей `App/components`.
- [x] Прогнать `npm run lint`.
