# 后端快速开始

## 1. 安装依赖

```bash
cd backend
npm install
```

## 2. 配置环境变量

```bash
cp .env.example .env
```

至少需要填写：

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `AMAP_API_KEY`

## 3. 初始化数据库

```bash
npm run db:init
```

如果需要导入仓库内旧数据：

```bash
npm run db:migrate
```

如果需要导入 `datas_to_import` 中的文件：

```bash
npm run db:import
```

## 4. 启动服务

```bash
npm run dev
```

服务地址：`http://localhost:3000`

健康检查：

```bash
curl http://localhost:3000/health
```

OpenAPI：

```bash
curl http://localhost:3000/api/openapi.json
```
