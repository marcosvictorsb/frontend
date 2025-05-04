import AppLayout from '@/layout/AppLayout.vue'
import authGuard from '@/middleware/AuthGuard'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Auth/Login.vue'),
    },
    {
      path: '/hub',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'hub',
          meta: { title: 'Pagina inicial' },
          component: () => import('@/views/Hub/Hub.vue'),
          beforeEnter: authGuard,
        },
        {
          path: '/financas',
          name: 'financas',
          meta: { title: 'Finanças Pessoais' },
          component: () => import('@/views/Financas/Dashboard.vue'),
          beforeEnter: authGuard,
        },
        {
          path: '/transacoes',
          name: 'transacoes',
          meta: { title: 'Transacoes Financeiras' },
          component: () => import('@/views/pages/Transactions.vue'),
          beforeEnter: authGuard,
        },
      ],
    },
  ],
})

export default router
