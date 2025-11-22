import { instance } from '@/api/intercept.js'
import axios from 'axios'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
const config = {
  baseUrl: import.meta.env.VITE_API_URL
}

/* ------------------------- 게시판 관련 ------------------------- */
export async function getBoardList(obj) {
  const { name, startRow, pageSize, searchWord } = obj
  return await instance.post(`${name}/${name}`, { startRow, pageSize, searchWord, board: name })
}

export async function getBoardCount({ name, searchWord }) {
  return await instance.post(`${name}/${name}_count`, { searchWord, board: name })
}

/* ------------------------- 로그인 / 회원 ------------------------- */
export async function requestLogin(username, password) {
  try {
    const response = await axios.post(`${config.baseUrl}signIn`, { username, password })
    return response.data
  } catch (error) {
    console.error(error, 'error login')
  }
}

export async function signUp(username, password, name, email) {
  return await instance.post('/signUp', { username, password, name, email })
}

/* ------------------------- withDiary 관련 ------------------------- */
export async function getWithDiaryBoardList(obj) {
  const { startRow, pageSize, roomId } = obj
  return await instance.post('withDiary/withDiary', { startRow, pageSize, roomId })
}

export async function getWithDiaryBoardCount(id) {
  return await instance.post('withDiary/withDiary_count', { id })
}

export async function getWithDiaryAll() {
  return await instance.get('withDiary/withDiary_all')
}

export async function makeWithDiary(teamName, userIdList) {
  const user = JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user
  if (!user) return null

  return await instance.post('/withDiary/make_withDiary', {
    teamName,
    userIdList,
    creator: user.id ?? 0,
    creator_name: user.name ?? ''
  })
}

export async function fetchWithDiaryRoomList(userId) {
  return await instance.post('/withDiary/fetch_withDiaryList', { userId })
}

export async function fetchWithDiaryRoom(roomId) {
  return await instance.post('/withDiary/fetch_withDiary', { roomId })
}

/* ------------------------- 게시판 CRUD ------------------------- */
export async function writeBoard(formData, name) {
  if (name === 'withDiary') {
    formData.append(
      'withDiaryNum',
      JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user.withDiary
    )
  }
  return await instance.post(`${name}/${name}_write`, formData)
}

export async function editBoard(formData, name) {
  if (name === 'withDiary') {
    formData.append(
      'withDiaryNum',
      JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user.withDiary
    )
  }
  return await instance.post(`${name}/${name}_edit`, formData)
}

export async function editPhotoBoard(formData, name) {
  return await instance.post(`${name}/${name}_edit`, formData)
}

export async function getContentById(name, id) {
  return await instance.post(`${name}/${name}_detail`, { id, board: name })
}

export async function getPhotoContentById(name, id) {
  return await instance.post(`${name}/${name}_detail`, { id, board: name })
}

export async function deleteBoard(name, id, deleteKey) {
  return await instance.post(`${name}/${name}_delete`, { id, deleteKey })
}

export async function deletePhotoBoard(name, id, deleteKeyList) {
  return await instance.post(`${name}/${name}_delete`, { id, deleteKeyList, board: name })
}

/* ------------------------- 메인 콘텐츠 ------------------------- */
export async function getMainColumn(name) {
  return await instance.post(`${name}/main_${name}`, { board: name })
}

export async function getMainClassMeeting(name) {
  return await instance.post(`${name}/main_${name}`, { board: name })
}

export async function getMainTestimony(name) {
  return await instance.post(`${name}/main_${name}`, { board: name })
}

export async function getMainSermon(name) {
  return await instance.post(`${name}/main_${name}`, { board: name })
}

export async function getMainWeekly(name) {
  return await instance.post(`${name}/main_${name}`, { board: name })
}

/* ------------------------- 댓글 ------------------------- */
export async function writeComment(boardId, boardName, comment, writerName, writer) {
  return await instance.post('comment/comment_write', {
    boardId,
    boardName,
    comment,
    writerName,
    writer
  })
}

export async function getCommentList(boardId, boardName) {
  return await instance.post('comment/comment', { boardId, boardName })
}

/* ------------------------- 토큰 / 유저 ------------------------- */
export async function checkToken(accessToken, refreshToken) {
  return await instance.post('/check_Token', { accessToken, refreshToken })
}

export async function getUserByUsername(username) {
  return await instance.post('/find_user', { username })
}

/* ------------------------- 승인 관리 ------------------------- */
export async function fetchDisapproveUsers() {
  return await instance.get('/disapproveUsers')
}

export async function updateApproveStatus(id) {
  return await instance.post('/updateApproveStatus', { id })
}
