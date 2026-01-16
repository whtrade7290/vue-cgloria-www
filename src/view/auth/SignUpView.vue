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
                <h4 class="font-weight-bolder">{{ $t('auth.signUpTitle') }}</h4>
                <p class="mb-0">{{ $t('auth.signUpDescription') }}</p>
              </div>
              <div class="card-body">
                <form role="form">
                  <div class="mb-3">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      :placeholder="$t('auth.accountPlaceholder')"
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
                      :placeholder="$t('auth.passwordPlaceholder')"
                      aria-label="Password"
                      aria-describedby="password-addon"
                      v-model="password1"
                      @focusout="checkingPassword"
                    />
                    <input
                      type="password"
                      class="form-control form-control-lg mt-2"
                      :placeholder="$t('auth.passwordPlaceholder')"
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
                      :placeholder="$t('auth.emailPlaceholder')"
                      v-model="email"
                      @focusout="checkingEmail"
                    />
                    <span :class="emailClass ? 'red' : 'green'">{{ emailMsg }}</span>
                  </div>
                  <div class="mb-3">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      :placeholder="$t('auth.namePlaceholder')"
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
                      {{ $t('auth.signUpButton') }}
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
                {{ $t('auth.verse') }}
              </h4>
              <p class="text-white">{{ $t('auth.verseReference') }}</p>
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
import { useRoute, useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { useI18n } from 'vue-i18n'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const username = ref('')
const usernameMsgKey = ref('')
const usernameMsg = computed(() => (usernameMsgKey.value ? t(usernameMsgKey.value) : ''))
const usernameClass = ref(false)

const password1 = ref('')
const password2 = ref('')
const passwordMsgKey = ref('')
const passwordMsg = computed(() => (passwordMsgKey.value ? t(passwordMsgKey.value) : ''))
const passwordClass = ref(false)

const name = ref('')
const nameClass = ref(false)
const nameMsgKey = ref('')
const nameMsg = computed(() => (nameMsgKey.value ? t(nameMsgKey.value) : ''))

const email = ref('')
const emailClass = ref(false)
const emailMsgKey = ref('')
const emailMsg = computed(() => (emailMsgKey.value ? t(emailMsgKey.value) : ''))

const confirmUsername = ref(false)
const confirmPassword = ref(false)
const confirmName = ref(false)
const confirmEmail = ref(false)

const checkingUsername = async () => {
  const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/

  if (username.value === '') {
    confirmUsername.value = false
    usernameMsgKey.value = 'auth.warnings.usernameRequired'
    usernameClass.value = true
  } else if (!usernameRegex.test(username.value)) {
    confirmUsername.value = false
    usernameClass.value = true
    usernameMsgKey.value = 'auth.warnings.usernameInvalid'
  } else {
    await store.dispatch('SEARCH_USER', { searchUser: username.value })

    if (store.state.user) {
      confirmUsername.value = false
      usernameClass.value = true
      usernameMsgKey.value = 'auth.warnings.usernameDuplicate'
    } else {
      usernameClass.value = false
      usernameMsgKey.value = 'auth.warnings.usernameAvailable'
      confirmUsername.value = true
    }
  }
}

const checkingPassword = async () => {
  if (password1.value.length < 4) {
    confirmPassword.value = false
    passwordClass.value = true
    passwordMsgKey.value = 'auth.warnings.passwordShort'
  } else if (password1.value !== password2.value) {
    confirmPassword.value = false
    passwordClass.value = true
    passwordMsgKey.value = 'auth.warnings.passwordMismatch'
  } else {
    passwordClass.value = false
    passwordMsgKey.value = 'auth.warnings.passwordAvailable'
    confirmPassword.value = true
  }
}

const checkingEmail = async () => {
  // Regex for validating email format
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/

  if (email.value.length === 0) {
    confirmEmail.value = false
    emailClass.value = true
    emailMsgKey.value = 'auth.warnings.emailRequired'
  } else if (!emailRegex.test(email.value)) {
    confirmEmail.value = false
    emailClass.value = true
    emailMsgKey.value = 'auth.warnings.emailInvalid'
  } else {
    confirmEmail.value = true
    emailClass.value = false
    emailMsgKey.value = 'auth.warnings.emailAvailable'
  }
}

const checkingName = async () => {
  const nameRegex = /^[\u3040-\u30FF\uAC00-\uD7A3\u4E00-\u9FFFa-zA-Z]+$/

  if (name.value.length === 0) {
    confirmName.value = false
    nameClass.value = true
    nameMsgKey.value = 'auth.warnings.nameRequired'
  } else if (!nameRegex.test(name.value)) {
    confirmName.value = false
    nameClass.value = true
    nameMsgKey.value = 'auth.warnings.nameInvalid'
  } else {
    nameClass.value = false
    nameMsgKey.value = 'auth.warnings.nameAvailable'
    confirmName.value = true
  }
}

const storedData = localStorage.getItem(getUserIdFromCookie())
const accessToken = storedData ? JSON.parse(storedData).token : ''
const refreshToken = storedData ? JSON.parse(storedData).refreshToken : ''

const signUp = async () => {
  if (confirmUsername.value && confirmPassword.value && confirmName.value) {
    const result = await store.dispatch('SIGN_UP', {
      username: username.value,
      password: password1.value,
      email: email.value,
      name: name.value
    })

    if (result) {
      if (route.params.isQr) {
        const updatedUser = await store.dispatch('APPROVE_USER', result.id)
        if (updatedUser.isApproved) {
          await Swal.fire({
            title: t('auth.signUpAlerts.successImmediate'),
            icon: 'success'
          })
        }
      } else {
        await Swal.fire({
          title: t('auth.signUpAlerts.successPending'),
          icon: 'success'
        })
      }

      confirmUsername.value = false
      confirmPassword.value = false
      confirmName.value = false
      confirmEmail.value = false
      username.value = ''
      password1.value = ''
      password2.value = ''
      name.value = ''

      await router.push('/')
    } else {
      await Swal.fire({
        title: t('auth.signUpAlerts.fail'),
        icon: 'error'
      })
    }
  } else {
    await Swal.fire({
      title: t('auth.signUpAlerts.invalidInput'),
      icon: 'error'
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
