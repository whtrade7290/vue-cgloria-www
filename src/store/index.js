import { createStore } from 'vuex'
export default createStore({
  state: {
    sidemenu: {}
  },
  getters: {},
  actions: {
    FETCH_SIDEMENU({ commit }, sidemenu) {
      commit('SET_SIDEMENU', sidemenu)
      console.log('routeName: ', sidemenu)
    }
  },
  mutations: {
    SET_SIDEMENU(state, sidemenu) {
      console.log('sidemenu: ', sidemenu)
      state.sidemenu = sidemenu
    }
  }
})
