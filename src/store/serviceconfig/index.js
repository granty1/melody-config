const state = {
  serviceConfig: {
    backends: [],
  },
}

// getters
const getters = {
  serviceConfig: state => {
    return state.serviceConfig
  },
}

// actions
const actions = {}

// mutations
const mutations = {
  addBackend(state, { backend }) {
    state.serviceConfig.backends.push(backend)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
