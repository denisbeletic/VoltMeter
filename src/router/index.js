import Analitika from '@/views/Analitika.vue'
import KreirajMM from '@/views/KreirajMM.vue'
import Login from '@/views/Login.vue'
import OdabirMM from '@/views/OdabirMM.vue'
import PlacanjeRacuna from '@/views/PlacanjeRacuna.vue'
import PregledMM from '@/views/PregledMM.vue'
import PregledRacuna from '@/views/PregledRacuna.vue'
import UrediMM from '@/views/UrediMM.vue'
import UrediOcitanja from '@/views/UrediOcitanja.vue'
import UrediUredaje from '@/views/UrediUredaje.vue'
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
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/kreirajmm',
        name: 'kreirajmm',
        component: KreirajMM
      },
      {
        path: '/pregledmm/:mm_uid',
        name: 'pregledmm',
        component: PregledMM,
      },
            {
        path: '/pregledmm/:mm_uid/uredimm',
        name: 'uredimm',
        component: UrediMM,
      },
      {
        path: '/pregledmm/:mm_uid/urediocitanja',
        name: 'urediocitanja',
        component: UrediOcitanja,
      },
      {
        path: '/pregledmm/:mm_uid/urediuredaje',
        name: 'urediuredaje',
        component: UrediUredaje,
      },
      {
        path: '/pregledmm/:mm_uid/pregledracuna',
        name: 'pregledracuna',
        component: PregledRacuna,
      },
      {
        path: '/pregledmm/:mm_uid/pregledracuna/:racun_uid/placanjeracuna',
        name: 'placanjeracuna',
        component: PlacanjeRacuna,
      },
      {
        path: '/pregledmm/:mm_uid/analitika',
        name: 'analitika',
        component: Analitika,
      },
    ],
})

export default router