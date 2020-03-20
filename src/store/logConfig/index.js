import Vue from 'vue'
const state = {
  loggingConfig: {},
}

const getters = {
  loggingConfig: state => {
    return state.loggingConfig
  },
}

const actions = {
  updateLogging(store, logging) {
    this.commit('updateState', logging)
    if (logging.base != null) {
      const { commit } = store
      commit('addOrRemoveExtraConfig', {
        key: 'melody_gologging',
        value: logging.base,
        operation: 'add',
      })
    }
  },
  removeBaseLogging(store) {
    const { commit } = store
    commit('addOrRemoveExtraConfig', { key: 'melody_gologging', value: null, operation: 'remove' })
  },
  updateLogStash(store, add) {
    const { commit } = store
    if (add) {
      commit('addOrRemoveExtraConfig', {
        key: 'melody_logstash',
        value: { enabled: true },
        operation: 'add',
      })
    } else {
      commit('addOrRemoveExtraConfig', {
        key: 'melody_logstash',
        value: null,
        operation: 'remove',
      })
    }
  },
}

const mutations = {
  updateState(state, loggingObj) {
    state.loggingConfig = loggingObj
    Vue.ls.set('logging', loggingObj)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
