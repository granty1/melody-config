import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../layout/BaseLayout'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/home'),
      },
      {
        path: '*',
        component: () => import('../views/error/404'),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
