import axios from 'axios'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import store from '@/store/index'
import Swal from 'sweetalert2'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 2000
})

let isAccessTokenValid = false

// request header에 토큰 추가
instance.interceptors.request.use(
  async (config) => {
    const storedData = localStorage.getItem(getUserIdFromCookie())

    const accessToken = storedData ? JSON.parse(storedData).token : ''
    const refreshToken = storedData ? JSON.parse(storedData).refreshToken : ''

    if (!isAccessTokenValid) {
      isAccessTokenValid = true
      const result = await store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })
      // 1 이면 refresh / access 둘다 만료
      if (result.success === 1) {
        const hasAlerted = sessionStorage.getItem('logoutAlerted')
        if (hasAlerted && Number(hasAlerted)) {
          Swal.fire({
            title: '세션이 만료되었습니다. 다시 로그인해 주세요.',
            icon: 'warning'
          }).then(() => {
            localStorage.removeItem(getUserIdFromCookie())
            sessionStorage.setItem('logoutAlerted', 0) // 알림이 뜬 상태 기록
          })
        }
      }
    }

    if (accessToken) {
      if (!config.headers) {
        config.headers = {}
      }

      config.headers.Authorization = `Bearer ${accessToken}`
      config.headers['x-refresh-token'] = refreshToken
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
