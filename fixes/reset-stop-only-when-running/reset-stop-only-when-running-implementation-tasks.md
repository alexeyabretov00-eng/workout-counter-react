# Задачи: «Сброс» и «Стоп» только при активном выполнении

План: [reset-stop-only-when-running-plan.md](./reset-stop-only-when-running-plan.md)

- [ ] `src/App.tsx`: `disabled` для **Сброс** и **Стоп**, если не выполняется `isRunning && !isRestCountdownActive`; голос — команды сброса и остановки сессии только при том же условии.
- [ ] `README.md`, `docs/voice-commands.md`, `docs/architecture.md`: описание согласовано с UI и голосом.
