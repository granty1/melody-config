import Vue from 'vue'

const state = {
  serviceConfig: {},
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
  /**
   * 更新Vuex与Local Storage中的全局ServiceConfig对象
   * @param {*} state
   * @param {*} config ServiceConfig对象
   */
  updateServiceConfig(state, config) {
    if (config != null || !('undefined' === typeof config)) {
      state.serviceConfig = config
      Vue.ls.set('config', state.serviceConfig)
    }
  },
  /**
   * 删除ServiceConfig级别无用属性
   * @param {*} state
   * @param {*} props 要删除的无用的属性的集合
   */
  removeUselessPropsAtServiceConfigLevel(state, props) {
    props.forEach(p => {
      let config = state.serviceConfig
      if (p in config && !('undefined' === typeof config[p]) && '' == config[p]) {
        delete config[p]
        this.commit('updateServiceConfig', config)
      }
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
