import { createRouter, createWebHashHistory } from 'vue-router';
import PoisView from '../views/PoisView.vue';
import ItineraryView from '../views/ItineraryView.vue';
import BudgetView from '../views/BudgetView.vue';
import MemosView from '../views/MemosView.vue';
import GuideView from '../views/GuideView.vue';
import ProfileView from '../views/ProfileView.vue';
import DeployCheck from '../views/DeployCheck.vue';

const routes = [
  {
    path: '/',
    redirect: '/guide'
  },
  {
    path: '/pois',
    name: 'Pois',
    component: PoisView
  },
  {
    path: '/itinerary',
    name: 'Itinerary',
    component: ItineraryView
  },
  {
    path: '/budget',
    name: 'Budget',
    component: BudgetView
  },
  {
    path: '/memos',
    name: 'Memos',
    component: MemosView
  },
  {
    path: '/guide',
    name: 'Guide',
    component: GuideView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView
  },
  {
    path: '/deploy-check',
    name: 'DeployCheck',
    component: DeployCheck
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;