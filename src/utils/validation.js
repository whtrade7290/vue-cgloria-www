import Swal from 'sweetalert2'

export const VALIDATION_TITLE = (title) => {
  if (title.length === 0) {
    Swal.fire({
      title: '제목을 입력해주세요.',
      icon: 'warning'
    })

    return true
  }

  return false
}

export const VALIDATION_CONTENT = (content) => {
  if (content.length === 0) {
    Swal.fire({
      title: '글 내용을 입력해주세요.',
      icon: 'warning'
    })

    return true
  }

  return false
}

export const VALIDATION_FILES = (files, newFiles) => {
  const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png']

  const filesExceedLimit = newFiles.some((file) => file.size > maxSizeInBytes)
  const hasInvalidFileType = newFiles.some((file) => !allowedTypes.includes(file.type))

  if (files.length + newFiles.length > 6) {
    Swal.fire({
      title: '업로드는 최대 6개까지 가능합니다.',
      icon: 'warning'
    })
    return false
  } else if (filesExceedLimit) {
    Swal.fire({
      title: '업로드 가능한 파일 사이즈는 5MB까지입니다.',
      icon: 'warning'
    })
    return false
  } else if (hasInvalidFileType) {
    Swal.fire({
      title: '업로드 가능한 파일 형식은 JPEG, PNG입니다.',
      icon: 'warning'
    })
    return false
  } else {
    return true
  }
}

export const VALIDATION_USERNAME = (username) => {
  if (username.length < 4) {
    Swal.fire({
      title: '아이디를 4자리 이상 입력해주세요.',
      icon: 'warning'
    })

    return true
  }

  return false
}

export const VALIDATION_PASSWORD = (password) => {
  if (password.length < 4) {
    Swal.fire({
      title: '비밀번호를 8자리 이상 입력해주세요.',
      icon: 'warning'
    })

    return true
  }

  return false
}
