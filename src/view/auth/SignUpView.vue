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
                      type="email"
                      class="form-control form-control-lg"
                      placeholder="Email"
                      aria-label="Email"
                      aria-describedby="email-addon"
                      v-model="username"
                    />
                  </div>
                  <div class="mb-3">
                    <input
                      type="password"
                      class="form-control form-control-lg"
                      placeholder="Password"
                      aria-label="Password"
                      aria-describedby="password-addon"
                      v-model="password"
                    />
                  </div>
                  <div class="form-check form-switch">
                    <!-- <input class="form-check-input" type="checkbox" id="rememberMe" /> -->
                    <!-- <label class="form-check-label" for="rememberMe">기억하기</label> -->
                  </div>
                  <div class="text-center">
                    <button
                      type="button"
                      class="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0"
                      @click="login"
                    >
                      회원가입
                    </button>
                  </div>
                </form>
              </div>
              <div class="card-footer text-center pt-0 px-lg-2 px-1">
                <p class="mb-4 text-sm mx-auto">
                  회원가입 문의는
                  <router-link to="/sign_up" class="text-primary text-gradient font-weight-bold"
                    >담당자</router-link
                  >에게 연락 바랍니다.
                </p>
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
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import { VALIDATION_USERNAME, VALIDATION_PASSWORD } from '@/utils/validation.js'

const store = useStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const storedData = localStorage.getItem(getUserIdFromCookie())
const accessToken = storedData ? JSON.parse(storedData).token : ''
const refreshToken = storedData ? JSON.parse(storedData).refreshToken : ''

async function login() {

  if(VALIDATION_USERNAME(username.value)) return 
  if(VALIDATION_PASSWORD(password.value)) return 

  const response = await store.dispatch('LOGIN', {
    username: username.value,
    password: password.value
  })
  if (response && response.success && localStorage.getItem(response.user.id)) {
    Swal.fire({
      title: '로그인 되었습니다.',
      icon: 'success'
    }).then(async () => {
      await store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })
      sessionStorage.setItem('logoutAlerted', 1)
      router.push('/')
    })
  } else {
    Swal.fire({
      title: '로그인에 실패하였습니다.',
      icon: 'error'
    }).then(() => {
      username.value = ''
      password.value = ''
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
  background-image: url('@/assets/img/jesus.png');
  background-color: rgba(0, 0, 0, 0.5);
  background-size: cover;
  background-blend-mode: multiply;
}
</style>
