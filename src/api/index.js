import { instance } from '@/api/intercept.js'
import axios from 'axios'
import { getUserIdFromCookie } from '@/utils/cookie.js'
const config = {
  baseUrl: import.meta.env.VITE_API_URL
}

function getBoardList(obj) {
  const { name, startRow, pageSize, searchWord } = obj
  return instance.post(`${name}/${name}`, {
    startRow: startRow,
    pageSize: pageSize,
    searchWord: searchWord
  })
}
function getBoardCount({ name, searchWord }) {
  return instance.get(`${name}/${name}_count`, {
    params: {
      searchWord: searchWord
    }
  })
}
async function requestLogin(username, password) {
  try {
    const response = await axios.post(`${config.baseUrl}signIn`, {
      username: username,
      password: password
    })
    return response.data
  } catch (error) {
    console.error(error, 'error login')
  }
}
function getWithDiaryBoardList(obj) {
  const { startRow, pageSize, roomId } = obj
  return instance.post(`withDiary/withDiary`, {
    startRow: startRow,
    pageSize: pageSize,
    roomId: roomId
  })
}
function getWithDiaryBoardCount(id) {
  return instance.post(`withDiary/withDiary_count`, {
    id: id
  })
}
function writeBoard(formData, name) {
  if (name === 'withDiary') {
    formData.append(
      'withDiaryNum',
      JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user.withDiary
    )
  }
  return instance.post(`${name}/${name}_write`, formData)
}
function getContentById(name, id) {
  return instance.post(`${name}/${name}_detail`, {
    id: id
  })
}
function getPhotoContentById(name, id) {
  return instance.post(`${name}/${name}_detail`, {
    id: id
  })
}

function deleteBoard(name, id, deleteKey) {
  return instance.post(`${name}/${name}_delete`, {
    id: id,
    deleteKey: deleteKey
  })
}

function deletePhotoBoard(name, id, deleteKeyList) {
  return instance.post(`${name}/${name}_delete`, {
    id: id,
    deleteKeyList: deleteKeyList
  })
}

function editBoard(formData, name) {
  if (name === 'withDiary') {
    formData.append(
      'withDiaryNum',
      JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user.withDiary
    )
  }
  return instance.post(`${name}/${name}_edit`, formData)
}

function editPhotoBoard(formData, name) {
  return instance.post(`${name}/${name}_edit`, formData)
}

function getMainColumn(name) {
  return instance.get(`${name}/main_${name}`)
}

function getMainClassMeeting(name) {
  return instance.get(`${name}/main_${name}`)
}

function getMainTestimony(name) {
  return instance.get(`${name}/main_${name}`)
}

function getMainSermon(name) {
  return instance.get(`${name}/main_${name}`)
}

function getMainWeekly(name) {
  return instance.get(`${name}/main_${name}`)
}

function writeComment(boardId, boardName, comment, writerName, writer) {
  return instance.post(`comment/comment_write`, {
    boardId: boardId,
    boardName: boardName,
    comment: comment,
    writerName: writerName,
    writer: writer
  })
}

function getCommentList(boardId, boardName) {
  return instance.post(`comment/comment`, { boardId: boardId, boardName: boardName })
}

function checkToken(accessToken, refreshToken) {
  return instance.post(`/check_Token`, {
    accessToken,
    refreshToken
  })
}

function getUserByUsername(username) {
  return instance.post('/find_user', {
    username: username
  })
}

function makeWithDiary(teamName, userIdList) {
  const user = JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user
  if (!user) {
    return null
  }
  return instance.post('/withDiary/make_withDiary', {
    teamName: teamName,
    userIdList: userIdList,
    creator: user.id ?? 0,
    creator_name: user.name ?? ''
  })
}

function fetchWithDiaryRoomList(userId) {
  return instance.post('/withDiary/fetch_withDiaryList', {
    userId: userId
  })
}

function fetchWithDiaryRoom(roomId) {
  return instance.post('/withDiary/fetch_withDiary', {
    roomId: roomId
  })
}

function signUp(username, password, name) {
  return instance.post('/signUp', {
    username: username,
    password: password,
    name: name
  })
}

function fetchDisapproveUsers() {
  return instance.get('/disapproveUsers')
}

function updateApproveStatus(id) {
  return instance.post('/updateApproveStatus', {
    id: id
  })
}
export {
  getBoardList,
  requestLogin,
  getWithDiaryBoardList,
  getBoardCount,
  getWithDiaryBoardCount,
  writeBoard,
  getContentById,
  getPhotoContentById,
  deleteBoard,
  deletePhotoBoard,
  editBoard,
  editPhotoBoard,
  getMainColumn,
  getMainClassMeeting,
  getMainTestimony,
  getMainSermon,
  getMainWeekly,
  writeComment,
  getCommentList,
  checkToken,
  getUserByUsername,
  makeWithDiary,
  fetchWithDiaryRoomList,
  fetchWithDiaryRoom,
  signUp,
  fetchDisapproveUsers,
  updateApproveStatus
}
