import Vue from 'vue'
import Vuex from 'vuex'
import serviceconfig from './serviceconfig'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    serviceconfig,
  },
})
