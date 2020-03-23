const state = {
  isCollapse: false,
}

const getters = {
  isCollapse: state => {
    return state.isCollapse
  },
}

const actions = {}

const mutations = {
  setIsCollapse: (state, obj) => {
    state.isCollapse = obj
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
