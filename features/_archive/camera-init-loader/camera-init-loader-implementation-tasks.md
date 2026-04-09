# Задачи: лоадер при инициализации камеры

Связанный план: [camera-init-loader-plan.md](./camera-init-loader-plan.md).

---

- [x] **1.** Добавить в `useCameraStream` состояние инициализации камеры и сброс в `finally` в `startCamera`.
- [x] **2.** Пробросить флаг из `useWorkoutSession` наружу.
- [x] **3.** В `App.tsx` и `App.css`: оверлей на `.stage`, отключение «Старт» на время инициализации.
- [x] **4.** В `App.tsx`: не обрабатывать голосовой «старт», пока `isCameraInitializing` (избежать параллельных `startCamera`).
