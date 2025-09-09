import { createRouter, createWebHistory } from 'vue-router';
import TaskEditor from '../views/TaskEditor.vue';
import Auth from "../views/Auth.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: () => import('../views/TaskManager.vue'), meta: { requiresAuth: true },
    },
    {
      path:'/tasks/:id',
      name: 'TaskDetails',
      component: TaskEditor,
    },
    { path: '/auth', component: Auth },
  ]
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return '/auth';
  }
});

export default router