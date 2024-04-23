import axios from 'axios'

const config = {
  baseUrl: 'http://localhost:8080/'
}
function getBoardList() {
  return axios.get(`${config.baseUrl}notice`)
}

export { getBoardList }
