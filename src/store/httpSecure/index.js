import Vue from 'vue'
const state = {
  safeConfig: {},
}

const getters = {
  /**
   * 返回Vuex中的safe Config对象
   */
  safeConfig: state => {
    return state.safeConfig
  },
}

const actions = {
  /**
   * 更新或移除serviceConfig级别下extra_config中的http secure配置
   * @param {*} store
   * @param {*} param1 { safe: 全局safe配置, add: 是否是更新操作 }
   */
  updateHttpSecure(store, { safe, add }) {
    this.commit('updateHttpSecure', safe)
    const { commit } = store
    if (add) {
      if (safe && safe.config != null) {
        commit('addOrRemoveExtraConfig', {
          key: 'melody_httpsecure',
          value: safe.config,
          operation: 'add',
        })
      }
    } else {
      commit('addOrRemoveExtraConfig', {
        key: 'melody_httpsecure',
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
  updateHttpSecure(state, safeObj) {
    state.safeConfig = safeObj
    Vue.ls.set('safe', safeObj)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
