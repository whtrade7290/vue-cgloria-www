import axios from 'axios'

const config = {
  baseUrl: 'http://localhost:8080/'
}
function getBoardList({ name, startRow, pageSize }) {
  return axios.post(`${config.baseUrl}${name} `, {
    startRow: startRow,
    pageSize: pageSize
  })
}
function getBoardCount(name) {
  return axios.get(`${config.baseUrl}${name}_count`)
}
function requestLogin(username, password) {
  return axios.post(`${config.baseUrl}login`, {
    username: username,
    password: password
  })
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
function writeBoard(title, content) {
  return axios.post(`${config.baseUrl}sermon_write`, {
    title: title,
    content: content,
    writer: JSON.parse(sessionStorage.getItem(1)).username
  })
}

export {
  getBoardList,
  requestLogin,
  getTrainingData,
  getTrainingBoardList,
  getBoardCount,
  getTrainingBoardCount,
  writeBoard
}
