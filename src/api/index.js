import axios from 'axios'

const config = {
  baseUrl: 'http://localhost:8080/'
}
function getBoardList({ name, startRow, pageSize }) {
  console.log('name: ', name)
  console.log('startRow: ', startRow)
  console.log('pageSize: ', pageSize)
  return axios.post(`${config.baseUrl}${name} `, {
    startRow: startRow,
    pageSize: pageSize
  })
}
function getBoardCount(name) {
  console.log('name: ', name)
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
function getTrainingBoardList({ name, trainingNum }) {
  return axios.post(`${config.baseUrl}${name}`, {
    training_num: trainingNum
  })
}

export { getBoardList, requestLogin, getTrainingData, getTrainingBoardList, getBoardCount }
