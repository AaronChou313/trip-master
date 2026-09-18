<template>
  <div id="app-shell">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <header v-if="!isWorkspace" class="site-header">
      <router-link to="/" class="brand"><span>TM</span>TripMaster</router-link>
      <nav aria-label="主要导航">
        <router-link to="/">我的旅行</router-link>
        <router-link to="/settings">设置</router-link>
      </nav>
      <span class="local-badge">本地模式</span>
    </header>
    <router-view />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const route = useRoute();
    return { isWorkspace: computed(() => route.name === 'Workspace') };
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap');
:root { color-scheme: light; --ink: #243028; --muted: #6f7972; --paper: #f6f7f3; --accent: #1f6b52; font-family: 'Manrope', 'Noto Sans SC', system-ui, sans-serif; font-synthesis: none; }
* { box-sizing: border-box; }
html { min-width: 320px; min-height: 100%; background: var(--paper); scroll-behavior: smooth; }
body { min-width: 320px; min-height: 100%; margin: 0; background: var(--paper); }
button, input, select, textarea { font-family: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible { outline: 3px solid rgba(31,107,82,.22); outline-offset: 2px; }
.skip-link { position: fixed; z-index: 100; top: 10px; left: 10px; padding: 9px 12px; color: white; background: #1f6b52; border-radius: 6px; transform: translateY(-160%); transition: transform .18s ease; }
.skip-link:focus { transform: translateY(0); }
.site-header { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; min-height: 66px; padding: 0 max(24px, calc((100% - 1180px) / 2)); background: rgba(249,250,247,.94); border-bottom: 1px solid #e2e5e0; backdrop-filter: blur(12px); }
.brand { display: flex; align-items: center; gap: 10px; color: #243129; font-size: 15px; font-weight: 700; text-decoration: none; letter-spacing: -.02em; }
.brand span { display: grid; width: 29px; height: 29px; place-items: center; color: #f4f7f3; background: #29483a; border-radius: 7px; font: 700 9px/1 monospace; letter-spacing: .04em; }
.site-header nav { display: flex; align-self: stretch; gap: 28px; }
.site-header nav a { position: relative; display: flex; align-items: center; color: #727c75; font-size: 12px; font-weight: 650; text-decoration: none; }
.site-header nav a.router-link-exact-active { color: #1f6b52; }
.site-header nav a.router-link-exact-active::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 2px; background: #1f6b52; }
.local-badge { justify-self: end; color: #6f7b73; font-size: 10px; font-weight: 650; letter-spacing: .06em; }
::selection { color: #fff; background: #356f58; }
::-webkit-scrollbar { width: 9px; height: 9px; }
::-webkit-scrollbar-track { background: #eef0ec; }
::-webkit-scrollbar-thumb { background: #bcc5be; border: 2px solid #eef0ec; border-radius: 8px; }
@media (max-width: 640px) { .site-header { grid-template-columns: 1fr auto; padding: 0 15px; } .site-header nav { gap: 18px; } .local-badge { display: none; } }
</style>
