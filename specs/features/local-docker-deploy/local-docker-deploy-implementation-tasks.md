# Задачи: локальный Docker

План: [local-docker-deploy-plan.md](./local-docker-deploy-plan.md).

## Чеклист

- [ ] Добавить `.dockerignore` (исключить `node_modules`, `dist`, git, логи и т.п.).
- [ ] Добавить multi-stage `Dockerfile`: стадия сборки (`npm ci`, `npm run build`), стадия nginx со копированием `dist/` и конфигом SPA fallback.
- [ ] Добавить конфиг nginx для приложения (корень = статика, `try_files` → `index.html` для client-side routes).
- [ ] Добавить `docker-compose.yml` (или `compose.yaml`) с сервисом веб-приложения, пробросом порта и `build: .`.
- [ ] Обновить `README.md`: раздел с командами `docker build` / `docker compose`, URL, примечание про камеру/localhost.
- [ ] Ручная проверка по плану: сборка, открытие UI, deep link по маршруту, при необходимости — камера на localhost.
