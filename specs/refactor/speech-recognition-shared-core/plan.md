# План: разделение `useSpeechRecognition` на общий и доменный слои

## 1. Контекст

`src/modules/HomeModule/hooks/useSpeechRecognition.ts` сейчас объединяет инфраструктуру браузерного `SpeechRecognition` и доменные команды тренировки (`eventBus`, `updateHomeModuleState`, выбор упражнения, rest-команды). Это усложняет повторное использование и тестирование.

## 2. Цель

- Вынести общий слой работы с Web Speech API в `src/hooks`.
- Оставить в `HomeModule` только интерпретацию фраз и доменные побочные эффекты.
- Сохранить текущее наблюдаемое поведение (статусы голоса, обработка видимости вкладки, авто-рестарт и cooldown команд).

## 3. Область изменений

- Новый общий хук `src/hooks/useBrowserSpeechRecognition.ts`.
- Обновление `src/modules/HomeModule/hooks/useSpeechRecognition.ts` для использования общего хука.
- Обновление барреля `src/hooks/index.ts`.

## 4. Проверка отсутствия регрессии

- `npm run test -- src/modules/HomeModule/containers/ExerciseControlBarContainer/__tests__/ExerciseControlBarContainer.test.tsx src/modules/HomeModule/selectors/__tests__/HomeModuleSelectors.test.ts`
- `npm run build`

## 5. Риски

- Потеря части поведения при авто-рестарте `SpeechRecognition`.
- Изменение тайминга обновления `voiceStatus` при переключении видимости вкладки.
