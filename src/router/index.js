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
            path: '/sd',
            name: 'sd',
            component: () => import('../views/sd'),
          },
          {
            path: '/endpoints',
            name: 'endpoints',
            component: () => import('../views/endpoints'),
          },
          {
            path: '/logging',
            name: 'logging',
            component: () => import('../views/logging'),
          },
          {
            path: '/import',
            name: 'import',
            component: () => import('../views/import'),
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
