import Vue from 'vue'
import Vuex from 'vuex'
import serviceconfig from './serviceconfig'
import logConfig from './logConfig'
import address from './address'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    serviceconfig,
    logConfig,
    address,
  },
})
