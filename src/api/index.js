import axios from 'axios'

const config = {
  baseUrl: 'http://localhost:8080/'
}
function getBoardList(name) {
  return axios.get(`${config.baseUrl}${name}`)
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

export { getBoardList, requestLogin, getTrainingData }
