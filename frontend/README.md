# TripMaster Frontend

Vue 3 + Webpack 5 单页应用。核心功能完全在浏览器运行，默认不需要后端、数据库或账号。

## 运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 可选地图配置

```bash
cp .env.development.example .env.development
```

填写 `VUE_APP_AMAP_KEY` 后启用高德底图、地点搜索和真实市内路线。没有 Key 时使用本地点位目录与路线估算，其他功能保持可用。

## 正式页面

- `/`：我的旅行
- `/trips/:id`：旅行工作台
- `/settings`：设置

数据写入 IndexedDB。导入和导出以整份 Trip JSON 为单位，当前 schema 版本为 3。
