import Vue from 'vue'
const state = {
  availableHosts: [],
}

const getters = {
  availableHosts: state => {
    return state.availableHosts
  },
}

const actions = {}

const mutations = {
  setAvailableHosts: (state, obj) => {
    state.availableHosts = obj
    Vue.ls.set('availableHosts', obj)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
