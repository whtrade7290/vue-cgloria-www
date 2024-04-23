import { createStore } from 'vuex'
import { getBoardList, requestLogin, getTrainingData } from '@/api/index'

export default createStore({
  state: {
    sidemenu: {},
    dataList: [],
    training: {}
  },
  getters: {},
  actions: {
    FETCH_SIDEMENU({ commit }, sidemenu) {
      commit('SET_SIDEMENU', sidemenu)
    },
    async FETCH_BOARDLIST({ commit }, name) {
      const res = await getBoardList(name)
      console.log('res: ', res)
      commit('SET_BOARDLIST', res.data)
      return res
    },
    async FETCH_TRAINING_DATA({ commit }, id) {
      const res = await getTrainingData(id)
      console.log('res: ', res)
      commit('SET_TRAINING', res.data)
      return res
    },
    async LOGIN({ commit }, { username, password }) {
      const res = await requestLogin(username, password)
      if (res.status === 200) {
        sessionStorage.setItem(1, JSON.stringify(res.data[0]))
      }
      return res
    }
  },
  mutations: {
    SET_SIDEMENU(state, sidemenu) {
      state.sidemenu = sidemenu
    },
    SET_BOARDLIST(state, item) {
      console.log('item: ', item)
      state.dataList = item
    },
    SET_TRAINING(state, item) {
      state.training = item
    }
  }
})
