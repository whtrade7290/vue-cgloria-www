import axios from 'axios'
import { getUserIdFromCookie } from '@/utils/cookie.js'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000
})

// console.log('instance.config: ', instance)
// instance.config.Authorization = accessToken

instance.interceptors.request.use(
  (config) => {
    const storedData = sessionStorage.getItem(getUserIdFromCookie())

    const accessToken = storedData ? JSON.parse(storedData).token : ''

    if (accessToken) {
      if (!config.headers) {
        config.headers = {}
      }

      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
