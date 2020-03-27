import Vue from 'vue'

const state = {
  serviceConfig: {
    extra_config: {},
    endpoints: [],
  },
  activeCards: [],
}

// getters
const getters = {
  serviceConfig: state => {
    return state.serviceConfig
  },
  activeCards: state => {
    return state.activeCards
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
  removeUselessPropsAtServiceConfigLevel(state) {
    for (let prop in state.serviceConfig) {
      if (prop === 'extra_config') {
        continue
      }
      if (prop === 'endpoints') {
        continue
      }
      if (
        state.serviceConfig.prop === '' ||
        state.serviceConfig.prop === [] ||
        state.serviceConfig.prop === {}
      ) {
        delete state.serviceConfig[prop]
        Vue.ls.set('config', state.serviceConfig)
      }
    }
  },
  /**
   * 在ServiceConfig中添加新的endpoint
   * @param {*} state
   * @param {*} endpointConfig 要添加的endpoint
   */
  addEndpointConfig(state, endpointConfig) {
    if (endpointConfig && endpointConfig != null) {
      if (state.serviceConfig.endpoints === undefined) {
        state.serviceConfig['endpoints'] = []
      }
      state.serviceConfig.endpoints.push(endpointConfig)
      Vue.ls.set('config', state.serviceConfig)
      let _obj = JSON.stringify(state.serviceConfig)
      let objClone = JSON.parse(_obj)
      this.commit('updateServiceConfig', objClone)
    }
  },
  updateEndpointConfig(state, endpointConfig) {
    if (endpointConfig && endpointConfig != null) {
      if (state.serviceConfig.endpoints === undefined) {
        state.serviceConfig['endpoints'] = endpointConfig
      }
      Vue.ls.set('config', state.serviceConfig)
      let _obj = JSON.stringify(state.serviceConfig)
      let objClone = JSON.parse(_obj)
      this.commit('updateServiceConfig', objClone)
    }
  },
  /**
   * 根据name去移除或添加
   * @param {*} state
   * @param {*} name 更改状态的card name
   */
  modifyActiveCards(state, name) {
    let actives = state.activeCards
    let index = actives.indexOf(name)
    if (index != -1) {
      actives.splice(index, 1)
      this.commit('updateActiveCards', actives)
    } else {
      actives.push(name)
      this.commit('updateActiveCards', actives)
    }
  },
  /**
   * 更新Ls和Vuex中的activeCards
   * @param {*} state
   * @param {*} actives 当前需要激活的card的name
   */
  updateActiveCards(state, actives) {
    if (actives != null) {
      state.activeCards = actives
      Vue.ls.set('active_cards', actives)
    }
  },
  setExtraConfig(state, { name, config }) {
    state.serviceConfig.extra_config[name] = config
    Vue.ls.set('config', state.serviceConfig)
  },
  removeExtraConfig(state, { name }) {
    delete state.serviceConfig.extra_config[name]
    Vue.ls.set('config', state.serviceConfig)
  },
  addOrRemoveExtraConfig(state, config) {
    let serviceConfig = state.serviceConfig
    switch (config.operation) {
      case 'add':
        if (serviceConfig['extra_config'] != undefined) {
          serviceConfig['extra_config'][config.key] = config.value
        } else {
          let obj = {}
          obj[config.key] = config.value
          serviceConfig['extra_config'] = obj
        }
        break
      case 'remove':
        if (serviceConfig['extra_config'] && serviceConfig['extra_config'][config.key]) {
          delete serviceConfig['extra_config'][config.key]
        }
        break
      default:
        break
    }
    this.commit('updateServiceConfig', serviceConfig)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
