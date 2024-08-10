import { createStore } from 'vuex'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import {
  getBoardList,
  requestLogin,
  getWithDiaryBoardList,
  getBoardCount,
  getWithDiaryBoardCount,
  writeBoard,
  getContentById,
  getPhotoContentById,
  deleteBoard,
  editBoard
} from '@/api/index'
import { getUserIdFromCookie } from '@/utils/cookie.js'

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
      return !sessionStorage.getItem(getUserIdFromCookie())
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
      commit('SET_BOARDCOUNT', res.data)
      return res
    },
    async FETCH_WITHDIARY_BOARDCOUNT({ commit }, obj) {
      console.log('excute')
      const res = await getWithDiaryBoardCount(obj)
      commit('SET_BOARDCOUNT', res.data)
      return res
    },
    async FETCH_WITHDIARY_DATALIST({ commit }, obj) {
      const res = await getWithDiaryBoardList(obj)
      commit('SET_BOARDLIST', res.data)
      return res
    },
    async LOGIN({ commit }, { username, password }) {
      const res = await requestLogin(username, password)

      if (res && res.success) {
        const { user } = res
        sessionStorage.setItem(user.id, JSON.stringify(res))
        document.cookie = `userId=${user.id};`
      }
      return res
    },
    async CHECKING_SESSION({ commit }, isLogIned) {
      commit('SET_LOGINED', isLogIned)
    },
    async WRITE_BOARD({ commit }, { formData, name }) {
      const res = await writeBoard(formData, name)
      return res.status === 200
    },
    async FETCH_CONTENT_DETAIL({ commit }, { name, id }) {
      const res = await getContentById(name, id)
      if (res.status === 200) {
        commit('SET_DETAIL', res.data)
      }
      return res
    },
    async FETCH_PHOTO_CONTENT_DETAIL({ commit }, { name, id }) {
      const res = await getPhotoContentById(name, id)

      let data = {}

      if (res.data !== null || res.data !== undefined) {
        const fileUrlList = JSON.parse(res.data.files ?? '').map((file) => {
          return {
            fileUrl: `http://localhost:3000/uploads/${file.filename}_${file.date}.${file.extension}`,
            filename: file.filename
          }
        })

        console.log('fileUrlList: ', fileUrlList)

        data = {
          id: Number(res.data.id),
          title: res.data.title,
          content: res.data.content,
          writer: res.data.writer,
          files: fileUrlList,
          create_at: res.data.create_at,
          update_at: res.data.update_at,
          deleted: res.data.deleted
        }

        console.log('data: ', data)
      }

      if (res.status === 200) {
        commit('SET_DETAIL', data)
      }
      return res
    },
    async DELETE_BOARD({ commit }, { name, id }) {
      const result = await deleteBoard(name, id)
      return result.data
    },
    async EDIT_BOARD({ commit }, { formData, name }) {
      const res = await editBoard(formData, name)
      return res.status === 200
    }
  },
  mutations: {
    SET_SIDEMENU(state, sidemenu) {
      state.sidemenu = sidemenu
    },
    SET_BOARDLIST(state, item) {
      state.dataList = item
    },
    SET_BOARDCOUNT(state, item) {
      state.count = item
    },
    SET_LOGINED(state, item) {
      state.isLogIned = item
    },
    SET_DETAIL(state, item) {
      console.log('item: ', item)
      state.detail = item
    }
  }
})
