import Vue from 'vue'
import Vuex from 'vuex'
import serviceconfig from './serviceconfig'
import availableHosts from './availablehosts'
import httpSecure from './httpSecure'
import isCollapse from './isCollapse'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    serviceconfig,
    availableHosts,
    httpSecure,
    isCollapse,
  },
})
