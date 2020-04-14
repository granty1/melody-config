import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { Loading } from 'element-ui'

import '@/core/init'

Vue.config.productionTip = false

// let loadingInstance

// router.beforeResolve((to, from , next) => {
//   loadingInstance = Loading.service({
//     fullscreen: true,
//     text: 'Loading...',
//     background: 'rgba(255, 255, 255, 1)',
//   })
//   setTimeout(() => {
//     next()
//     loadingInstance.close()
//   },500)

// })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
