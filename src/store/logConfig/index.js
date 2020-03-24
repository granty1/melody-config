import Vue from 'vue'
const state = {
  loggingConfig: {},
}

const getters = {
  /**
   * 返回Vuex中的整个logging对象
   */
  loggingConfig: state => {
    return state.loggingConfig
  },
}

const actions = {
  /**
   * 更新或移除serviceConfig级别下extra_config中的base logger配置
   * @param {*} store
   * @param {*} param1  { logging: logging对象, add: 是否为更新操作}
   */
  updateBaseLogger(store, { logging, add }) {
    this.commit('updateLoggingState', logging)
    const { commit } = store
    if (add) {
      if (logging.base != null) {
        commit('addOrRemoveExtraConfig', {
          key: 'melody_gologging',
          value: logging.base,
          operation: 'add',
        })
      }
    } else {
      commit('addOrRemoveExtraConfig', {
        key: 'melody_gologging',
        value: null,
        operation: 'remove',
      })
    }
  },
  /**
   * 更新或移除serviceConfig级别下extra_config中的logstash配置
   * @param {*} store
   * @param {*} add 是否为更新操作
   */
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
  /**
   * 更新或移除serviceConfig级别下extra_config中的gelf配置
   * @param {*} store
   * @param {*} param1 { logging: logging对象, add:是否为更新操作 }
   */
  updateGelf(store, { logging, add }) {
    this.commit('updateLoggingState', logging)
    const { commit } = store
    if (add) {
      if (logging.gelf != null) {
        commit('addOrRemoveExtraConfig', {
          key: 'melody_gelf',
          value: logging.gelf,
          operation: 'add',
        })
      }
    } else {
      commit('addOrRemoveExtraConfig', {
        key: 'melody_gelf',
        value: null,
        operation: 'remove',
      })
    }
  },
  /**
   * 更新或移除serviceConfig级别下extra_config中的metrics配置
   * @param {*} store
   * @param {*} param1 { logging: logging对象, add: 是否为更新操作 }
   */
  updateMetrics(store, { logging, add }) {
    this.commit('updateLoggingState', logging)
    const { commit } = store
    if (add) {
      if (logging.metrics != null) {
        commit('addOrRemoveExtraConfig', {
          key: 'melody_metrics',
          value: logging.metrics,
          operation: 'add',
        })
      }
    } else {
      commit('addOrRemoveExtraConfig', {
        key: 'melody_metrics',
        value: null,
        operation: 'remove',
      })
    }
  },
  updateInflux(store, { logging, add }) {
    this.commit('updateLoggingState', logging)
    const { commit } = store
    if (add) {
      if (logging.metrics != null) {
        commit('addOrRemoveExtraConfig', {
          key: 'melody_influxdb',
          value: logging.influx,
          operation: 'add',
        })
      }
    } else {
      commit('addOrRemoveExtraConfig', {
        key: 'melody_influxdb',
        value: null,
        operation: 'remove',
      })
    }
  },
}

const mutations = {
  /**
   * 更新Vuex和Local Storage中的logging对象
   * @param {*} state
   * @param {*} loggingObj logging对象
   */
  updateLoggingState(state, loggingObj) {
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
