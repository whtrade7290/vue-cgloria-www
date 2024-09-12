import { instance } from '@/api/intercept.js'
import axios from 'axios'
import { getUserIdFromCookie } from '@/utils/cookie.js'
const config = {
  baseUrl: 'http://localhost:3000/'
}

function getBoardList(obj) {
  const { name, startRow, pageSize } = obj
  return instance.post(`${name}/${name}`, {
    startRow: startRow,
    pageSize: pageSize
  })
}
function getBoardCount(name) {
  return instance.get(`${name}/${name}_count`)
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
  const { startRow, pageSize } = obj
  return instance.post(`withDiary/withDiary`, {
    startRow: startRow,
    pageSize: pageSize,
    withDiary: JSON.parse(localStorage.getItem(getUserIdFromCookie())).user.withDiary
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
  return instance.post('/withDiary/make_withDiary', {
    teamName: teamName,
    userIdList: userIdList
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
  makeWithDiary
}
