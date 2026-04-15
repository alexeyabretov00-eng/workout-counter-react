# REST API: аутентификация (префикс `/api`)

Все пути ниже задаются **относительно префикса** `/api` (например `POST /api/login`).

Общий формат ошибки:

```json
{
  "error": {
    "code": "STRING",
    "message": "Человекочитаемое сообщение"
  }
}
```

| Метод и путь | Тело запроса | Успех | Ошибки |
|--------------|--------------|-------|--------|
| `GET /health` | — | `200` `{ "ok": true }` | — |
| `POST /register` | `{ "login": string, "password": string }` | `201` `{ "user": { "id": number, "login": string } }` + `Set-Cookie` httpOnly | `400` `VALIDATION_ERROR`, `409` `LOGIN_IN_USE` |
| `POST /login` | `{ "login": string, "password": string }` | `200` `{ "user": { "id": number, "login": string } }` + `Set-Cookie` httpOnly | `400` `VALIDATION_ERROR`, `401` `INVALID_CREDENTIALS` |
| `POST /logout` | `{}` (JSON) | `200` `{ "ok": true }`, сброс cookie | — |
| `GET /me` | Cookie с JWT | `200` `{ "user": { "id": number, "login": string } }` | `401` `UNAUTHORIZED` |
| `GET /ping-protected` | Cookie с JWT | `200` `{ "ok": true, "login": string }` | `401` `UNAUTHORIZED` |

**Cookie:** имя `auth_token`, атрибуты `HttpOnly`, `SameSite=Lax`, путь `/`, срок жизни 7 суток. В продакшене при HTTPS можно выставить `COOKIE_SECURE=true` на сервере.

**Ограничение частоты:** для `POST /login` и `POST /register` применяется базовый rate limit (см. код сервера).

**CORS:** не используется; клиент обращается к API с того же origin, что и SPA.
