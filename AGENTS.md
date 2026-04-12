# Инструкции для агента (кратко)

Ниже — сжатые обязательные пункты; подробности только в связанных правилах, без дублирования текста здесь.

1. **Фичи, фиксы и рефакторинг:** перед правками кода — каталог `specs/features/<имя>/`, `specs/fixes/<имя>/` или `specs/refactor/<имя>/` (план + чеклист; рефакторинг — см. правило); затем реализация; цикл из **трёх отдельных коммитов** (план → реализация → архив). Что именно в каждый коммит и когда `specs/refactor/`: [.cursor/rules/feature-planning.mdc](.cursor/rules/feature-planning.mdc).
2. **Коммиты:** разрешение на этап работы **не** равно разрешению на `git commit`; перед каждым коммитом — список изменений, явный вопрос пользователю и явное согласие на фиксацию. [.cursor/rules/three-commits-with-confirmation.mdc](.cursor/rules/three-commits-with-confirmation.mdc).
3. **Зависимости:** в `package.json` только точные версии; после любого изменения зависимостей — удалить `node_modules` и `package-lock.json`, затем `npm install`. [.cursor/rules/dependency-install-clean-reinstall.mdc](.cursor/rules/dependency-install-clean-reinstall.mdc).
4. **todo.md:** выполнил задачу из бэклога — обнови соответствующие строки в `todo.md` в том же цикле. [.cursor/rules/todo-update-on-request.mdc](.cursor/rules/todo-update-on-request.mdc).
5. **Импорты в `src`:** между папками — из барреля (`index.ts`), явные реэкспорты, без `export *`. [.cursor/rules/imports-via-index.mdc](.cursor/rules/imports-via-index.mdc).
