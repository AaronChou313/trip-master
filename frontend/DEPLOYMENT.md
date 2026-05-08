# 前端部署说明

## 构建

```bash
cd frontend
npm install
npm run build
```

构建输出目录为 `dist/`。

## 关键环境变量

部署前确认以下变量已正确配置：

- `VUE_APP_API_BASE_URL`
- `VUE_APP_AMAP_KEY`
- `NODE_ENV=production`

示例参考 [frontend/.env.production.example](/home/aaron/alex/trip-master/frontend/.env.production.example)。

## 静态部署要求

- 需要托管 `dist/` 目录
- 需要支持单页应用入口回退到 `index.html`
- 后端 API 需允许前端域名访问

## Vercel

- Build Command: `npm run build`
- Output Directory: `dist`
- 环境变量在平台控制台中配置，不要写回仓库
