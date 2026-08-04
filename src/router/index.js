import KreirajMM from '@/views/KreirajMM.vue'
import Login from '@/views/Login.vue'
import OdabirMM from '@/views/OdabirMM.vue'
import PregledMM from '@/views/PregledMM.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'odabirmm',
        component: OdabirMM
      },
      {
        path: '/pregledmm/:mm_uid',
        name: 'pregledmm',
        component: PregledMM,
        props: true
      },
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/kreirajmm',
        name: 'kreirajmm',
        component: KreirajMM
      }
    ],
})

export default router