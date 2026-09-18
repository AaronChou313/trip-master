import { createRouter, createWebHashHistory } from 'vue-router';
import TripsView from '../views/TripsView.vue';
import WorkspaceView from '../views/WorkspaceView.vue';
import SettingsView from '../views/SettingsView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Trips', component: TripsView },
    { path: '/trips/:id', name: 'Workspace', component: WorkspaceView },
    { path: '/settings', name: 'Settings', component: SettingsView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
});

export default router;
