import axios from 'axios'
import { getUserIdFromCookie } from '@/utils/cookie.js'
const config = {
  baseUrl: 'http://localhost:3000/'
}

function createInstance() {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL
  })
}

const instance = createInstance()

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
    withDiary: JSON.parse(sessionStorage.getItem(getUserIdFromCookie())).user.withDiary
  })
}
function getWithDiaryBoardCount() {
  return instance.post(`withDiary/withDiary_count`, {
    withDiary: JSON.parse(sessionStorage.getItem(getUserIdFromCookie()))?.user.withDiary
  })
}
function writeBoard(formData, name) {
  if (name === 'withDiary') {
    formData.append(
      'withDiaryNum',
      JSON.parse(sessionStorage.getItem(getUserIdFromCookie()))?.user.withDiary
    )
  }
  return instance.post(`${name}/${name}_write`, formData)
}
function getContentById(name, id) {
  return instance.post(`${name}/${name}_detail`, {
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
  getContentById
}
