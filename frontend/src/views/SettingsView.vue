<template>
  <main class="settings-page" id="main-content">
    <header><p>TripMaster / 设置</p><h1>设置</h1><span>核心规划默认在本机运行，不需要账号。</span></header>
    <section>
      <div><h2>本地数据</h2><p>旅行数据保存在浏览器 IndexedDB 中。请定期从旅行工作台导出整份 Trip JSON 作为备份。</p></div>
      <dl><div><dt>存储位置</dt><dd>当前浏览器 · IndexedDB</dd></div><div><dt>文件格式</dt><dd>TripMaster JSON · schema v3</dd></div><div><dt>账号</dt><dd>无需登录</dd></div></dl>
    </section>
    <section>
      <div><h2>地图与路线</h2><p>地点搜索和真实路线通过高德 JavaScript API 适配层接入。没有 Key 时，旅行、排序、预算和导入导出仍可使用。</p></div>
      <dl><div><dt>地图服务</dt><dd>{{ mapAvailable ? '已连接' : '未配置 / 未加载' }}</dd></div><div><dt>降级策略</dt><dd>估算时间，不绘制直线伪装路线</dd></div></dl>
    </section>
    <section class="future-section">
      <div><h2>后续能力</h2><p>登录、云同步、分享和多人协作保留为后续增强能力，不阻塞当前的本地工作流。</p></div>
      <span>尚未启用</span>
    </section>
  </main>
</template>

<script>
export default { name: 'SettingsView', data: () => ({ mapAvailable: Boolean(globalThis.AMap) }) };
</script>

<style scoped>
.settings-page { width: min(980px, calc(100% - 48px)); margin: 0 auto; padding: 82px 0 100px; color: #27332c; }
header { margin-bottom: 58px; }
header p { margin: 0 0 12px; color: #7e8881; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
header h1 { margin: 0; font-size: 58px; line-height: 1; letter-spacing: -.055em; }
header span { display: block; margin-top: 18px; color: #69746d; }
section { display: grid; grid-template-columns: .9fr 1.1fr; gap: 70px; padding: 32px 0; border-top: 1px solid #dce1dc; }
h2 { margin: 0 0 10px; font-size: 22px; letter-spacing: -.03em; }
section p { max-width: 440px; margin: 0; color: #747e77; font-size: 13px; line-height: 1.65; }
dl { margin: 0; }
dl div { display: flex; justify-content: space-between; gap: 20px; padding: 12px 0; border-bottom: 1px solid #e7eae6; font-size: 12px; }
dt { color: #7c857f; }
dd { margin: 0; color: #35433b; font-weight: 650; text-align: right; }
.future-section > span { align-self: start; justify-self: end; padding: 8px 10px; color: #7b6840; background: #eee7d8; border-radius: 5px; font-size: 11px; font-weight: 650; }
@media (max-width: 700px) { section { grid-template-columns: 1fr; gap: 24px; } }
</style>
