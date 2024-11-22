<template>
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0 mx-auto">
            <div class="card card-plain">
              <div class="card-header pb-0 text-left">
                <h4 class="font-weight-bolder">회원가입</h4>
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
                    <span :class="usernameClass ? 'red' : 'green'">{{ usernameMsg }}</span>
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
                      placeholder="name"
                      aria-label="Email"
                      aria-describedby="email-addon"
                      v-model="name"
                      @focusout="checkingName"
                    />
                    <span :class="nameClass ? 'red' : 'green'">{{ nameMsg }}</span>
                  </div>
                  <div class="text-center">
                    <button
                      type="button"
                      class="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0"
                      @click="signUp"
                    >
                      회원가입
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
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import { VALIDATION_USERNAME, VALIDATION_PASSWORD } from '@/utils/validation.js'

const store = useStore()
const router = useRouter()

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

let confirmUsername = false
let confirmPassword = false
let confirmName = false

const checkingUsername = async () => {
  const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/

  if (username.value === '') {
    confirmUsername = false
    usernameMsg.value = '계정을 4자 이상 입력해주세요.'
    usernameClass.value = true
  } else if (!usernameRegex.test(username.value)) {
    confirmUsername = false
    usernameClass.value = true
    usernameMsg.value = '계정은 4자 이상 16자 이하의 영문자, 숫자, 밑줄(_)만 사용할 수 있습니다.'
  } else {
    await store.dispatch('SEARCH_USER', { searchUser: username.value })

    if (store.state.user) {
      confirmUsername = false
      usernameClass.value = true
      usernameMsg.value = '이미 사용중인 계정입니다..'
    } else {
      usernameClass.value = false
      usernameMsg.value = '사용 가능한 계정입니다.'
      confirmUsername = true
    }
  }
}

const checkingPassword = async () => {
  if (password1.value.length < 4) {
    confirmPassword = false
    passwordClass.value = true
    passwordMsg.value = '비밀번호는 4자리 이상 입력해주세요.'
  } else if (password1.value !== password2.value) {
    confirmPassword = false
    passwordClass.value = true
    passwordMsg.value = '비밀번호가 일치하지 않습니다.'
  } else {
    passwordClass.value = false
    passwordMsg.value = '사용가능한 패스워드 입니다.'
    confirmPassword = true
  }
}

const checkingName = async () => {
  const nameRegex = /^[\u3040-\u30FF\uAC00-\uD7A3\u4E00-\u9FFFa-zA-Z]+$/

  if (name.value.length === 0) {
    confirmName = false
    nameClass.value = true
    nameMsg.value = '이름을 입력해주세요.'
  } else if (!nameRegex.test(name.value)) {
    confirmName = false
    nameClass.value = true
    nameMsg.value = '이름은 히라가나, 가타카나, 한글, 한자, 영문자만 포함할 수 있습니다.'
  } else {
    nameClass.value = false
    nameMsg.value = '사용가능한 이름 입니다.'
    confirmName = true
  }
}

const storedData = localStorage.getItem(getUserIdFromCookie())
const accessToken = storedData ? JSON.parse(storedData).token : ''
const refreshToken = storedData ? JSON.parse(storedData).refreshToken : ''

const signUp = async () => {
  if (confirmUsername && confirmPassword && confirmName) {
    const result = await store.dispatch('SIGN_UP', {
      username: username.value,
      password: password1.value,
      name: name.value
    })

    if (result) {
      await Swal.fire({
        title:
          '회원가입 신청이 완료 되었습니다.\n 관리자 승인 후 활성화 되니 \n 조금만 기다려주세요.',
        icon: 'success'
      })

      confirmUsername = false
      confirmPassword = false
      confirmName = false
      username.value = ''
      password1.value = ''
      password2.value = ''
      name.value = ''

      await router.push('/')
    } else {
      await Swal.fire({
        title: '회원가입에 문제가 발생했습니다.\n 관리자에게 문의해주세요.',
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

onMounted(async () => {
  if (store.state.isLogIned) return
  await store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })
  if (store.state.isLogIned) {
    Swal.fire({
      title: '이미 로그인 되었습니다.',
      icon: 'success'
    }).then(() => {
      router.back()
    })
  }
})
</script>

<style scoped>
.bg-img {
  background-image: url('https://160.251.179.146:3000/uploads/assets/jesus.png');
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
</style>
