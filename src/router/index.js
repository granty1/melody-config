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
        component: () => import('../layout/SideBarLayout'),
        children: [
          {
            path: '/',
            name: 'dashboard',
            component: () => import('../views/dashboard'),
          },
          {
            path: '/service',
            name: 'service',
            component: () => import('../views/service'),
          },
          {
            path: '/service-discovery',
            name: 'service-discovery',
            component: () => import('../views/servicediscovery'),
          },
          {
            path: '*',
            component: () => import('../views/error/404'),
          },
        ],
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
