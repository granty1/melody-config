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
  delProps(...props) {
    props.forEach(p => {
      let config  = state.serviceConfig
      if (p in config && !('undefined' === typeof config.p) && ('' == config.p)) {
        delete state.serviceConfig.p
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
