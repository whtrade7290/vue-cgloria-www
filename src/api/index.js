import axios from 'axios'
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
function getTrainingData(id) {
  return axios.post(`${config.baseUrl}training`, {
    id: id
  })
}
function getTrainingBoardList({ name, trainingNum, startRow, pageSize }) {
  return axios.post(`${config.baseUrl}${name}`, {
    training_num: trainingNum,
    startRow: startRow,
    pageSize: pageSize
  })
}
function getTrainingBoardCount({ name, trainingNum }) {
  return axios.post(`${config.baseUrl}${name}_count`, { training_num: trainingNum })
}
function writeBoard(formData, name) {
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
  getTrainingData,
  getTrainingBoardList,
  getBoardCount,
  getTrainingBoardCount,
  writeBoard,
  getContentById
}
