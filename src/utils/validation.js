import Swal from 'sweetalert2'


export const VALIDATION_TITLE = (title) => {

  if(title.length === 0){

        Swal.fire({
          title: '제목을 입력해주세요.',
          icon: 'warning',
        })

        return true
  }

  return false

}

export const VALIDATION_CONTENT = (content) => {

  if(content.length === 0){

        Swal.fire({
          title: '글 내용을 입력해주세요.',
          icon: 'warning',
        })

        return true
  }

  return false

}

export const VALIDATION_FILES = (files) => {

  if(files.length === 0){

        Swal.fire({
          title: '사진을 업로드해주세요.',
          icon: 'warning',
        })

        return true
  }

  return false

}

export const VALIDATION_USERNAME = (username) => {

  if(username.length < 4){

        Swal.fire({
          title: '아이디를 4자리 이상 입력해주세요.',
          icon: 'warning',
        })

        return true
  }

  return false

}

export const VALIDATION_PASSWORD = (password) => {

  if(password.length < 4){

        Swal.fire({
          title: '비밀번호를 8자리 이상 입력해주세요.',
          icon: 'warning',
        })

        return true
  }

  return false

}