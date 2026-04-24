# Задачи: разделение `useSpeechRecognition` на общий и доменный слои

Ссылка на план: [plan.md](./plan.md).

## Чеклист

- [x] Добавить `src/hooks/useBrowserSpeechRecognition.ts` с общей логикой Web Speech API и статусами `VoiceStatus`.
- [x] Перевести `src/modules/HomeModule/hooks/useSpeechRecognition.ts` на общий хук, оставив доменные команды `HomeModule`.
- [x] Обновить `src/hooks/index.ts` явным реэкспортом нового хука.
- [ ] Проверить регрессию: `npm run test -- src/modules/HomeModule/containers/ExerciseControlBarContainer/__tests__/ExerciseControlBarContainer.test.tsx src/modules/HomeModule/selectors/__tests__/HomeModuleSelectors.test.ts` и `npm run build` (тесты прошли; `build` падает на существующих ошибках типов в `StatusBarContainer.test.tsx` и `HomeModuleSlice.test.ts` про поле `isPaused`).
