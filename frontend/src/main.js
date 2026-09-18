import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

window.APP_CONFIG = {
  AMAP_KEY: process.env.VUE_APP_AMAP_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

const app = createApp(App);
app.use(router);
app.mount('#app');
