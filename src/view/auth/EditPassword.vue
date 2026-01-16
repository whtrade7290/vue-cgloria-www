<template>
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div
            class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0 mx-auto signup-container"
          >
            <div class="card card-plain">
              <div class="card-header pb-0 text-left">
                <h4 class="font-weight-bolder">비밀번호 재설정</h4>
                <p class="mb-0">God is my light in darkness</p>
              </div>
              <div class="card-body">
                <form role="form">
                  <div class="mb-3">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="acount"
                      aria-label="Email"
                      aria-describedby="email-addon"
                      v-model="username"
                      @focusout="checkingUsername"
                    />
                    <span :class="usernameClass ? 'green' : 'red'">{{ usernameMsg }}</span>
                  </div>

                  <div class="mb-3">
                    <input
                      type="password"
                      class="form-control form-control-lg"
                      placeholder="Password"
                      aria-label="Password"
                      aria-describedby="password-addon"
                      v-model="password1"
                      @focusout="checkingPassword"
                    />
                    <input
                      type="password"
                      class="form-control form-control-lg mt-2"
                      placeholder="Password"
                      aria-label="Password"
                      aria-describedby="password-addon"
                      v-model="password2"
                      @focusout="checkingPassword"
                    />
                    <span :class="passwordClass ? 'red' : 'green'">{{ passwordMsg }}</span>
                  </div>
                  <div class="mb-3">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="email"
                      v-model="email"
                      @focusout="checkingEmail"
                    />
                    <span :class="emailClass ? 'red' : 'green'">{{ emailMsg }}</span>
                  </div>
                  <div class="mb-3">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="name"
                      v-model="name"
                      @focusout="checkingName"
                    />
                    <span :class="nameClass ? 'red' : 'green'">{{ nameMsg }}</span>
                  </div>
                  <div class="text-center">
                    <button
                      type="button"
                      class="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0"
                      @click="editPassword"
                    >
                      비밀번호 재설정
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
          >
            <div
              class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center bg-img"
            >
              <h4 class="mt-5 text-white font-weight-bolder">
                "그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라 이전 것은 지나갔으니 보라 새
                것이 되었도다"
              </h4>
              <p class="text-white">고린도후서 5장 17절</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, toValue } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const usernameMsg = ref('')
const usernameClass = ref(false)

const password1 = ref('')
const password2 = ref('')
const passwordMsg = ref('')
const passwordClass = ref(false)

const name = ref('')
const nameClass = ref(false)
const nameMsg = ref('')

const email = ref('')
const emailClass = ref(false)
const emailMsg = ref('')

const confirmUsername = ref(false)
const confirmPassword = ref(false)
const confirmName = ref(false)
const confirmEmail = ref(false)

const checkingUsername = async () => {
  const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/

  if (username.value === '') {
    confirmUsername.value = false
    usernameClass.value = false
    usernameMsg.value = '계정을 4자 이상 입력해주세요.'
  } else if (!usernameRegex.test(username.value)) {
    confirmUsername.value = false
    usernameClass.value = false
    usernameMsg.value = '계정은 4자 이상 16자 이하의 영문자, 숫자, 밑줄(_)만 사용할 수 있습니다.'
  } else {
    await store.dispatch('SEARCH_USER', { searchUser: username.value })

    if (store.state.user) {
      confirmUsername.value = true
      usernameClass.value = true
      usernameMsg.value = 'ID를 찾았습니다.'
    } else {
      confirmUsername.value = false
      usernameClass.value = false
      usernameMsg.value = '등록되어 있지 않은 ID입니다.'
    }

    inputUserResult(toValue(store.state.user))
  }
}

const inputUserResult = (user) => {
  if (confirmUsername.value) {
    name.value = user.name
    email.value = user.email
    confirmName.value = true
    confirmEmail.value = true
  } else {
    name.value = ''
    email.value = ''
    confirmName.value = false
    confirmEmail.value = false
  }
}

const checkingPassword = async () => {
  if (password1.value.length < 4) {
    confirmPassword.value = false
    passwordClass.value = true
    passwordMsg.value = '비밀번호는 4자리 이상 입력해주세요.'
  } else if (password1.value !== password2.value) {
    confirmPassword.value = false
    passwordClass.value = true
    passwordMsg.value = '비밀번호가 일치하지 않습니다.'
  } else {
    passwordClass.value = false
    passwordMsg.value = '사용가능한 패스워드 입니다.'
    confirmPassword.value = true
  }
}

const checkingEmail = async () => {
  // 이메일 형식 검증용 정규식
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/

  if (email.value.length === 0) {
    confirmEmail.value = false
    emailClass.value = true
    emailMsg.value = '메일을 입력해주세요.'
  } else if (!emailRegex.test(email.value)) {
    confirmEmail.value = false
    emailClass.value = true
    emailMsg.value = '메일이 올바르지 않습니다.'
  } else {
    confirmEmail.value = true
    emailClass.value = false
    emailMsg.value = '사용 가능한 메일입니다.'
  }
}

const checkingName = async () => {
  const nameRegex = /^[\u3040-\u30FF\uAC00-\uD7A3\u4E00-\u9FFFa-zA-Z]+$/

  if (name.value.length === 0) {
    confirmName.value = false
    nameClass.value = true
    nameMsg.value = '이름을 입력해주세요.'
  } else if (!nameRegex.test(name.value)) {
    confirmName.value = false
    nameClass.value = true
    nameMsg.value = '이름은 히라가나, 가타카나, 한글, 한자, 영문자만 포함할 수 있습니다.'
  } else {
    nameClass.value = false
    nameMsg.value = '사용가능한 이름 입니다.'
    confirmName.value = true
  }
}

const storedData = localStorage.getItem(getUserIdFromCookie())
const accessToken = storedData ? JSON.parse(storedData).token : ''
const refreshToken = storedData ? JSON.parse(storedData).refreshToken : ''

const editPassword = async () => {
  if (confirmUsername.value && confirmPassword.value && confirmName.value) {
    const result = await store.dispatch('EDIT_PASSWORD', {
      username: username.value,
      password: password1.value,
      email: email.value,
      name: name.value
    })

    if (result) {
      await Swal.fire({
        title: '비밀번호 재설정이 완료 되었습니다.',
        icon: 'success'
      })

      confirmUsername.value = false
      confirmPassword.value = false
      confirmName.value = false
      confirmEmail.value = false
      username.value = ''
      password1.value = ''
      password2.value = ''
      name.value = ''

      await logout()

      await router.push('/login')
    } else {
      await Swal.fire({
        title: '비밀번호 재설정 문제가 발생했습니다.\n 관리자에게 문의해주세요.',
        icon: 'error'
      })
    }
  } else {
    await Swal.fire({
      title: '입력하신 회원 정보를 다시 확인해주세요.',
      icon: 'error'
    })
  }
}

const logout = async () => {
  localStorage.removeItem(getUserIdFromCookie())
  document.cookie = 'userId=;'
  await Swal.fire({
    title: t('modalMsg.editPasswordlogouted'),
    icon: 'success'
  }).then(async () => {
    await store.dispatch('CHECKING_TOKEN', { accessToken: '', refreshToken: '' })
    store.dispatch('CLEAR_STATE')
    router.push('/')
  })
}

const apiBaseUrl = import.meta.env.VITE_API_URL

document.documentElement.style.setProperty('--background-image-url', `url('/jesus.png')`)
</script>

<style scoped>
.bg-img {
  background-image: var(--background-image-url);
  background-color: rgba(0, 0, 0, 0.5);
  background-size: cover;
  background-blend-mode: multiply;
}
.red {
  color: red;
  font-size: 0.8rem;
}
.green {
  color: green;
  font-size: 0.8rem;
}
.page-header {
  background-color: #fff;
}
</style>
