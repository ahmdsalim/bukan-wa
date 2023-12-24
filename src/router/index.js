import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainchat',
      component: () => import('../views/MainChat.vue')
    }
  ]
})

export default router
