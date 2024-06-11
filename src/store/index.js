import { createStore } from 'vuex'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import {
  getBoardList,
  requestLogin,
  getTrainingData,
  getTrainingBoardList,
  getBoardCount,
  getTrainingBoardCount,
  writeBoard,
  getContentById
} from '@/api/index'

export default createStore({
  state: {
    bootstrap,
    sidemenu: {},
    dataList: [],
    training: {},
    count: 0,
    isLogIned: false,
    detail: {}
  },
  getters: {
    checkLogin() {
      return !sessionStorage.getItem(1)
    }
  },
  actions: {
    FETCH_SIDEMENU({ commit }, sidemenu) {
      commit('SET_SIDEMENU', sidemenu)
    },
    async FETCH_BOARDLIST({ commit }, obj) {
      const res = await getBoardList(obj)
      commit('SET_BOARDLIST', res.data)
      return res
    },
    async FETCH_BOARDCOUNT({ commit }, name) {
      const res = await getBoardCount(name)
      commit('SET_BOARDCOUNT', res.data[0]['count(*)'])
      return res
    },
    async FETCH_TRAINING_DATA({ commit }, id) {
      const res = await getTrainingData(id)

      commit('SET_TRAINING', res.data)
      return res
    },
    async FETCH_TRAINING_BOARDCOUNT({ commit }, obj) {
      const res = await getTrainingBoardCount(obj)
      commit('SET_BOARDCOUNT', res.data[0]['count(*)'])
      return res
    },
    async FETCH_TRAINING_DATALIST({ commit }, obj) {
      const res = await getTrainingBoardList(obj)
      commit('SET_BOARDLIST', res.data)
      return res
    },
    async LOGIN({ commit }, { username, password }) {
      const res = await requestLogin(username, password)

      if (res && res.success) {
        const { user } = res
        sessionStorage.setItem(user.id, JSON.stringify(res))
      }
      return res
    },
    async CHECKING_SESSION({ commit }, isLogIned) {
      commit('SET_LOGINED', isLogIned)
    },
    async WRITE_BOARD({ commit }, { title, content, name }) {
      const res = await writeBoard(title, content, name)
      return res.status === 200
    },
    async FETCH_CONTENT_DETAIL({ commit }, { name, id }) {
      const res = await getContentById(name, id)
      if (res.status === 200) {
        commit('SET_DETAIL', res.data[0])
      }
      // console.log('id: ', id)
      return res
    }
  },
  mutations: {
    SET_SIDEMENU(state, sidemenu) {
      state.sidemenu = sidemenu
    },
    SET_BOARDLIST(state, item) {
      state.dataList = item
    },
    SET_TRAINING(state, item) {
      state.training = item
    },
    SET_BOARDCOUNT(state, item) {
      state.count = item
    },
    SET_LOGINED(state, item) {
      state.isLogIned = item
    },
    SET_DETAIL(state, item) {
      state.detail = item
    }
  }
})
