# TripMaster

TripMaster 是一个以地图为核心、本地优先的旅行规划工作台。用户可以从城市路线开始，在同一界面完成每日地点安排、拖拽排序、交通 Segment 管理和预算统计。

## 当前核心流程

```text
新建旅行 → 添加城市 → 选择某天 → 地图搜索地点 → 直接加入
         → 拖拽排序 → 更新 Segment → 自动汇总预算
```

核心数据结构：

```text
Trip
└── CityStay
    └── Day
        ├── Stop
        └── Segment
```

- 默认无需登录。
- Trip 数据保存在浏览器 IndexedDB。
- 每份 Trip 可导入、导出为带 `schemaVersion` 的 JSON 文件。
- 交通集中存储为 Segment；市内与城际使用同一结构。
- 高德 JavaScript API 可选。未配置时仍可编辑行程、排序、估算时间、统计预算，但不会用直线伪装真实路线。

## 本地运行

```bash
cd frontend
npm install
npm run dev
```

打开 `http://localhost:8082`。

构建静态版本：

```bash
cd frontend
npm run build
```

## 地图配置

复制示例环境文件并填写高德 Web JavaScript API Key：

```bash
cp frontend/.env.development.example frontend/.env.development
```

```dotenv
VUE_APP_AMAP_KEY=your_key
```

地点搜索和真实路线由 `placeSearchService` 与 `routeService` 隔离。后续替换地图或票务服务时不需要修改 Trip 数据模型。

## 目录说明

```text
frontend/src/domain/trip.js              # Trip 聚合模型、Segment、预算派生
frontend/src/services/tripRepository.js  # IndexedDB 与 Trip 文件导入导出
frontend/src/services/routeService.js    # 真实路线适配和离线估算
frontend/src/views/TripsView.vue         # 我的旅行
frontend/src/views/WorkspaceView.vue     # 旅行工作台
frontend/src/views/SettingsView.vue      # 设置
```

`backend/` 保留为旧版云端能力的参考实现，不是本地核心流程的运行依赖。登录、云同步、分享与协作待后续按需接入。
