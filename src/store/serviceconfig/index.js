import Vue from 'vue'

const state = {
  serviceConfig: {},
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
  removeUselessPropsAtServiceConfigLevel(state, props) {
    props.forEach(p => {
      let config = state.serviceConfig
      if (p in config && !('undefined' === typeof config[p]) && '' == config[p]) {
        delete config[p]
        this.commit('updateServiceConfig', config)
      }
    })
  },
  /**
   * 根据ame去移除或添加
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
   * 增加Ls和Vuex中的activeCards
   * @param {*} state
   * @param {*} actives 当前需要激活的card的name
   */
  addActiveCards(state, name) {
    let actives = state.activeCards
    let index = actives.indexOf(name)
    if (index == -1) {
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
}

export default {
  state,
  getters,
  actions,
  mutations,
}
