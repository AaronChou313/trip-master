# 前端部署说明

## 构建

```bash
cd frontend
npm install
npm run build
```

构建输出目录为 `dist/`。

## 可选环境变量

如需在线地图、地点搜索和真实路线，配置 `VUE_APP_AMAP_KEY`。不配置时仍可构建和使用本地规划功能。

示例参考 [frontend/.env.production.example](/home/aaron/alex/trip-master/frontend/.env.production.example)。

## 静态部署要求

- 需要托管 `dist/` 目录
- 应用使用 Hash 路由，不需要额外的 SPA 回退规则
- 核心数据写入当前浏览器的 IndexedDB，不依赖后端 API

## Vercel

- Build Command: `npm run build`
- Output Directory: `dist`
- 环境变量在平台控制台中配置，不要写回仓库
