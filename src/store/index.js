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
  editBoard,
  editPhotoBoard,
  getMainColumn,
  getMainClassMeeting,
  getMainTestimony,
  getMainSermon,
  getMainWeekly,
  writeComment,
  getCommentList,
  checkToken
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
    detail: {},
    mainContents: [],
    CommentList: []
  },
  getters: {
    checkLogin() {
      return !localStorage.getItem(getUserIdFromCookie())
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
    async FETCH_WITHDIARY_BOARDCOUNT({ commit }, withDiaryNum) {
      const res = await getWithDiaryBoardCount(withDiaryNum)
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
        localStorage.setItem(user.id, JSON.stringify(res))
        document.cookie = `userId=${user.id};`
      }
      return res
    },
    async CHECKING_TOKEN({ commit }, { accessToken, refreshToken }) {
      const result = await checkToken(accessToken, refreshToken)

      if (result.data.success === 0) {
        // 새로 만들어진 access Token으로 바꾸기
        const storedData = localStorage.getItem(getUserIdFromCookie())
        const parsingUserData = storedData ? JSON.parse(storedData) : {}
        parsingUserData.token = result.data.accessToken
        localStorage.setItem(getUserIdFromCookie(), JSON.stringify(parsingUserData))
      }

      commit('SET_LOGINED', result.data.success === 2 || result.data.success === 0)
      return result.data
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
      const isEmptyObject = (obj) => Object.keys(obj).length === 0
      console.log('res.data: ', res.data)
      let data = {}

      if (res.data !== null || res.data !== undefined || isEmptyObject(res.data.files)) {
        const fileUrlList = JSON.parse(res.data.files ?? '').map((file) => {
          return {
            // fileUrl: `https://cgloria-bucket.s3.ap-northeast-1.amazonaws.com/cgloria-photo/${file.date}${file.filename}${file.extension}`,
            filename: file.filename,
            date: file.date,
            extension: file.extension
          }
        })

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
      }

      if (res.status === 200) {
        commit('SET_DETAIL', data)
      }
      return res
    },
    async DELETE_BOARD({ commit }, { name, id, deleteKeyList }) {
      console.log('deleteKeyList: ', deleteKeyList)
      const result = await deleteBoard(name, id, deleteKeyList)
      return result.data
    },
    async EDIT_BOARD({ commit }, { formData, name }) {
      const res = await editBoard(formData, name)
      return res.status === 200
    },
    async EDIT_PHOTO_BOARD({ commit }, { formData, name }) {
      const res = await editPhotoBoard(formData, name)
      return res.status === 200
    },
    async FETCH_MAIN_CONTENTS({ commit }, name) {
      const sermon = await getMainSermon('sermon')
      const weekly = await getMainWeekly('weekly')
      const column = await getMainColumn('column')
      const classMeeting = await getMainClassMeeting('classMeeting')
      const testimony = await getMainTestimony('testimony')

      const res = [column.data, classMeeting.data, testimony.data, sermon.data, weekly.data]

      if (column.status === 200 && classMeeting.status === 200 && testimony.status == 200) {
        commit('SET_MAIN_CONTENTS', res)
      }
      return res
    },
    async WRITE_COMMENT({ commit }, { boardId, boardName, comment, writerName, writer }) {
      const res = await writeComment(boardId, boardName, comment, writerName, writer)
      return res.status === 200
    },
    async FETCH_COMMENT({ commit }, { boardId, boardName }) {
      const res = await getCommentList(boardId, boardName)
      if (res.status === 200) {
        commit('SET_COMMENTLIST', res.data)
      }
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
    SET_BOARDCOUNT(state, item) {
      state.count = item
    },
    SET_LOGINED(state, item) {
      state.isLogIned = item
    },
    SET_DETAIL(state, item) {
      state.detail = item
    },
    SET_MAIN_CONTENTS(state, item) {
      state.mainContents = item
    },
    SET_COMMENTLIST(state, item) {
      state.CommentList = item
    }
  }
})
