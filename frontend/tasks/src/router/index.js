import { createRouter, createWebHistory } from 'vue-router';
import TaskManager from '../views/TaskManager.vue';
import TaskEditor from '../views/TaskEditor.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: TaskManager,
    },
    {
      path:'/tasks/:id',
      name: 'TaskDetails',
      component: TaskEditor,
    }
  ]
})

export default router