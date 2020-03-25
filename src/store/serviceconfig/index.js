import Vue from 'vue'

const state = {
  serviceConfig: {
    extra_config: [],
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
  addExtraConfig(state, { name, config }) {
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
