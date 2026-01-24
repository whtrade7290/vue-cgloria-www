import { createStore } from 'vuex'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import {
  getBoardList,
  requestLogin,
  getWithDiaryBoardList,
  getWithDiaryAll,
  getBoardCount,
  getWithDiaryBoardCount,
  writeBoard,
  getContentById,
  deleteBoard,
  editBoard,
  writeComment,
  getCommentList,
  checkToken,
  getUserByUsername,
  makeWithDiary,
  fetchWithDiaryRoomList,
  fetchWithDiaryRoom,
  signUp,
  editPassword,
  updateProfile,
  fetchDisapproveUsers,
  approveUser,
  fetchDiaryRoomUsers,
  removeDiaryRoomUser,
  removeDiaryRoom,
  deleteCommentRequest,
  updateCommentRequest
} from '@/api/index'
import { getUserIdFromCookie } from '@/utils/cookie.ts'

export default createStore({
  state: {
    bootstrap,
    sidemenu: {},
    dataList: [],
    photoList: [],
    training: {},
    count: 0,
    photoCount: 0,
    isLogin: false,
    detail: {},
    mainContents: [],
    CommentList: [],
    user: {},
    role: '',
    rooms: [],
    room: {},
    disapproveUsers: [],
    pendingRequests: 0
  },
  getters: {
    checkLogin() {
      return !localStorage.getItem(getUserIdFromCookie())
    },
    isGlobalLoading(state) {
      return state.pendingRequests > 0
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
    async FETCH_BOARDCOUNT({ commit }, obj) {
      const res = await getBoardCount(obj)
      commit('SET_BOARDCOUNT', res.data)
      return res
    },
    async FETCH_WITHDIARY_DATALIST({ commit }, obj) {
      const res = await getWithDiaryBoardList(obj)
      commit('SET_BOARDLIST', res.data)
      return res
    },
    async FETCH_WITHDIARY_BOARDCOUNT({ commit }, id, searchWord = '') {
      const res = await getWithDiaryBoardCount(id, searchWord)
      commit('SET_BOARDCOUNT', res.data)
      return res
    },
    async FETCH_PHOTO_DATALIST({ commit }, obj) {
      const res = await getBoardList(obj)
      commit('SET_PHOTO_DATALIST', res.data)
      return res
    },
    async FETCH_PHOTO_DATACOUNT({ commit }, obj) {
      const res = await getBoardCount(obj)
      commit('SET_PHOTO_DATACOUNT', res.data)
      return res
    },
    async LOGIN({ commit }, { username, password }) {
      const res = await requestLogin(username, password)

      if (res && res.success) {
        const { user } = res
        const profileImageUrl =
          user?.profileImageUrl ||
          user?.profile_image_url ||
          user?.writerProfileImageUrl ||
          user?.writer_profile_image_url ||
          ''
        const normalizedUser = { ...user, profileImageUrl }
        const normalizedResponse = { ...res, user: normalizedUser }
        localStorage.setItem(user.id, JSON.stringify(normalizedResponse))
        document.cookie = `userId=${user.id};`
      }
      return res
    },
    async SIGN_UP({ commit }, formData) {
      const result = await signUp(formData)

      if (result.data && result.status === 200) {
        return result.data
      } else {
        return false
      }
    },
    async EDIT_PASSWORD({ commit }, { username, password, name, email }) {
      const result = await editPassword(username, password, name, email)

      if (result.data && result.status === 200) {
        return result.data
      } else {
        return false
      }
    },
    async UPDATE_PROFILE(_, payload) {
      const res = await updateProfile(payload)
      return res.data
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
      const detailData = res?.data ?? {}
      let parsedFiles = []
      if (detailData.files) {
        try {
          parsedFiles = JSON.parse(detailData.files)
        } catch (error) {
          console.warn('Failed to parse files JSON', error)
        }
      }

      const fileUrlList = parsedFiles.map((file) => {
        return {
          filename: file.filename,
          date: file.date,
          extension: file.extension,
          originalName: file.originalname
        }
      })

      const data = {
        id: Number(detailData.id),
        title: detailData.title,
        content: detailData.content,
        writer: detailData.writer,
        writer_name: detailData.writer_name,
        writerProfileImageUrl: detailData.writerProfileImageUrl,
        files: fileUrlList,
        mainContent: detailData.mainContent,
        create_at: detailData.create_at,
        update_at: detailData.update_at,
        deleted: detailData.deleted
      }

      if (res.status === 200) {
        commit('SET_DETAIL', data)
      }
      return res
    },
    async DELETE_BOARD({ commit }, { name, id, deleteKeyList }) {
      const result = await deleteBoard(name, id, deleteKeyList)
      return result.data
    },
    async EDIT_BOARD({ commit }, { formData, name }) {
      const res = await editBoard(formData, name)
      return res.status === 200
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
    },
    async SEARCH_USER({ commit }, { searchUser }) {
      const res = await getUserByUsername(searchUser)
      if (res.status === 200) {
        commit('SET_USER', res.data)
      }
      return res
    },
    async MAKE_WITHDIARY({ commit }, { teamName, userIdList }) {
      const res = await makeWithDiary(teamName, userIdList)
      return res.data
    },
    async FETCH_WITHDIARY_ROOM_LIST({ commit }, { userId }) {
      const res = await fetchWithDiaryRoomList(userId)
      if (res.status === 200) {
        commit('SET_ROOMS', res.data)
      }
      return res.data
    },
    async FETCH_WITHDIARY_ROOM({ commit }, { roomId }) {
      const res = await fetchWithDiaryRoom(roomId)
      if (res.status === 200) {
        commit('SET_ROOM', res.data)
      }
      return res.data
    },
    async FETCH_WITHDIARY_ALL({ commit }) {
      const res = await getWithDiaryAll()
      commit('SET_ROOMS', res.data)
    },
    async FETCH_DIARY_ROOM_USERS(_, diaryRoomId) {
      const res = await fetchDiaryRoomUsers(diaryRoomId)
      return res.data
    },
    async REMOVE_DIARY_ROOM_USER(_, { diaryRoomId, userId }) {
      const res = await removeDiaryRoomUser({ diaryRoomId, userId })
      return res.data
    },
    async REMOVE_DIARY_ROOM(_, diaryRoomId) {
      const res = await removeDiaryRoom(diaryRoomId)
      return res.data
    },
    async DELETE_COMMENT(_, payload) {
      const res = await deleteCommentRequest(payload)
      return res.data
    },
    async UPDATE_COMMENT(_, payload) {
      const res = await updateCommentRequest(payload)
      return res.data
    },
    async CLEAR_STATE({ commit }) {
      commit('SET_BOARDLIST', [])
      commit('SET_BOARDCOUNT', 0)
      commit('SET_DETAIL', {})
      commit('SET_MAIN_CONTENTS', [])
      commit('SET_COMMENTLIST', [])
      commit('SET_USER', {})
      commit('SET_USER_ROLE', '')
      commit('SET_ROOMS', [])
      commit('SET_ROOM', {})
    },
    async FIND_DISAPPROVE_USERS({ commit }) {
      const res = await fetchDisapproveUsers()

      if (res.data || res.data.length > 0) {
        commit('SET_DISAPPROVE_USERS', res.data)
      }
    },
    async APPROVE_USER({ commit }, id) {
      const res = await approveUser(id)

      return res.data
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
    SET_PHOTO_DATALIST(state, item) {
      state.photoList = item
    },
    SET_PHOTO_DATACOUNT(state, item) {
      state.photoCount = item
    },
    SET_LOGINED(state, item) {
      state.isLogin = item
    },
    SET_DETAIL(state, item) {
      state.detail = item
    },
    SET_MAIN_CONTENTS(state, item) {
      state.mainContents = item
    },
    SET_COMMENTLIST(state, item) {
      state.CommentList = item
    },
    SET_USER(state, item) {
      state.user = item
    },
    SET_USER_ROLE(state, item) {
      state.role = item
    },
    SET_ROOMS(state, item) {
      state.rooms = item
    },
    SET_ROOM(state, item) {
      state.room = item
    },
    SET_DISAPPROVE_USERS(state, item) {
      state.disapproveUsers = item
    },
    INCREMENT_PENDING_REQUESTS(state) {
      state.pendingRequests += 1
    },
    DECREMENT_PENDING_REQUESTS(state) {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1)
    }
  }
})
