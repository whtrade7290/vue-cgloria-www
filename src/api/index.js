import axios from 'axios'

const config = {
  baseUrl: 'http://localhost:3000/'
}
function getBoardList({ name }) {
  return axios.post(`${config.baseUrl}${name} `)
}
function getBoardCount(name) {
  return axios.get(`${config.baseUrl}${name}_count`)
}
async function requestLogin(username, password) {
  try {
    const response = await axios.post(`${config.baseUrl}login`, {
      username: username,
      password: password
    })
    return response.data
  } catch (error) {
    console.error('error login')
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
function writeBoard(title, content, name) {
  return axios.post(`${config.baseUrl}write_${name}`, {
    title: title,
    content: content,
    name: name,
    writer: JSON.parse(sessionStorage.getItem(1)).username
  })
}
function getContentById(name, id) {
  return axios.post(`${config.baseUrl}detail/${name}`, {
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
