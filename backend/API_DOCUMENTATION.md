# TripMaster API 文档

## 基础信息

- 基础地址：`http://localhost:3000`
- 认证方式：`Authorization: Bearer <token>`
- 内容类型：`application/json`

## 系统接口

### `GET /`

返回服务信息、文档地址和主要接口列表。

### `GET /health`

返回应用健康状态和数据库连接状态。

### `GET /api/docs`

返回 OpenAPI 地址。

### `GET /api/openapi.json`

返回完整 OpenAPI JSON。

## 认证接口

### `POST /api/auth/register`

请求体：

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

### `POST /api/auth/login`

请求体：

```json
{
  "username": "alice",
  "password": "secret123"
}
```

### `GET /api/auth/me`

返回当前用户信息。

### `PUT /api/auth/me`

请求体：

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "currentPassword": "old-secret",
  "newPassword": "new-secret"
}
```

`currentPassword` 和 `newPassword` 只在修改密码时需要。

### `DELETE /api/auth/me`

请求体：

```json
{
  "password": "secret123"
}
```

## 业务接口

- `GET|POST|DELETE /api/pois`
- `GET|POST|PUT|DELETE /api/itineraries`
- `GET|POST|PUT|DELETE /api/budgets`
- `GET|POST|PUT|DELETE /api/memos`
- `GET /api/amap/place/text`

具体字段请以 [backend/docs/openapi.json](/home/aaron/alex/trip-master/backend/docs/openapi.json) 为准。
