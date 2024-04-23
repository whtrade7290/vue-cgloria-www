import { createStore } from 'vuex'
export default createStore({
  state: {
    sidemenu: {}
  },
  getters: {},
  actions: {
    FETCH_SIDEMENU({ commit }, sidemenu) {
      commit('SET_SIDEMENU', sidemenu)
    }
  },
  mutations: {
    SET_SIDEMENU(state, sidemenu) {
      state.sidemenu = sidemenu
    }
  }
})
