import { createRouter, createWebHistory } from 'vue-router'
import MainViewVue from '../views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainViewVue
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue')
    }
  ]
})

export default router
