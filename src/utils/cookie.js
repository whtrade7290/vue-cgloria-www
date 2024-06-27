export function getUserIdFromCookie() {
  const cookies = document.cookie.split('; ')
  for (let cookie of cookies) {
    const [name, value] = cookie.split('=')
    if (name === 'userId') {
      return decodeURIComponent(value) // 필요에 따라 디코딩하여 반환
    }
  }
  return null // userId 쿠키가 없는 경우
}
