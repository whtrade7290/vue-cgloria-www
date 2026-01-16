<template>
  <section style="background-color: #fff">
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0 mx-auto">
            <div class="card card-plain">
              <div class="card-header pb-0 text-left">
                <h4 class="font-weight-bolder">{{ t('auth.login.title') }}</h4>
                <p class="mb-0">{{ t('auth.login.description') }}</p>
              </div>
              <div class="card-body">
                <form role="form">
                  <div class="mb-3">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      :placeholder="t('auth.login.usernamePlaceholder')"
                      :aria-label="t('auth.login.usernameAria')"
                      aria-describedby="email-addon"
                      v-model="username"
                    />
                  </div>
                  <div class="mb-3">
                    <input
                      type="password"
                      class="form-control form-control-lg"
                      :placeholder="t('auth.login.passwordPlaceholder')"
                      :aria-label="t('auth.login.passwordAria')"
                      aria-describedby="password-addon"
                      v-model="password"
                      @keyup.enter="login"
                    />
                  </div>
                  <div class="text-center">
                    <button
                      type="button"
                      class="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0"
                      @click="login"
                    >
                      {{ t('button.login') }}
                    </button>
                  </div>
                </form>
              </div>
              <div class="card-footer text-center pt-0 px-lg-2 px-1">
                <p class="mb-4 text-sm mx-auto">
                  <router-link to="/signUp" class="text-primary text-gradient font-weight-bold"
                    >{{ t('auth.signUpButton') }}</router-link
                  >
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
                {{ t('auth.verse') }}
              </h4>
              <p class="text-white">{{ t('auth.verseReference') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { VALIDATION_USERNAME, VALIDATION_PASSWORD } from '@/utils/validation'
import { useI18n } from 'vue-i18n'

const store = useStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const storedData = localStorage.getItem(getUserIdFromCookie())
const accessToken = storedData ? JSON.parse(storedData).token : ''
const refreshToken = storedData ? JSON.parse(storedData).refreshToken : ''
const { t } = useI18n()

async function login() {
  if (VALIDATION_USERNAME(username.value)) return
  if (VALIDATION_PASSWORD(password.value)) return

  const response = await store.dispatch('LOGIN', {
    username: username.value,
    password: password.value
  })
  if (response && response.success && localStorage.getItem(response.user.id)) {
    Swal.fire({
      title: t('modalMsg.login'),
      icon: 'success'
    }).then(async () => {
      await store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })
      sessionStorage.setItem('logoutAlerted', 1)
      store.commit('SET_USER_ROLE', response.user.role)
      router.push('/')
    })
  } else {
    Swal.fire({
      title: t('modalMsg.loginFail'),
      icon: 'error'
    }).then(() => {
      username.value = ''
      password.value = ''
    })
  }
}

onMounted(async () => {
  if (store.state.isLogin) return
  await store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })
  if (store.state.isLogin) {
    Swal.fire({
      title: t('modalMsg.logined'),
      icon: 'success'
    }).then(() => {
      router.back()
    })
  }
})

const onEnter = () => {
  console.log('test')
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

.container {
  background-color: #fff;
}
</style>
