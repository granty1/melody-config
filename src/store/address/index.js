import Vue from 'vue'
const state = {
  addressList: [],
}

const getters = {
  addressList: state => {
    return state.addressList
  },
}

const actions = {}

const mutations = {
  setAddressList: (state, obj) => {
    state.addressList = obj
    Vue.ls.set('addressList', obj)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
