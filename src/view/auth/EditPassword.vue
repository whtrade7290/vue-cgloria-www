<template>
  <AuthCardLayout
    :title="t('auth.editPassword.title')"
    :description="t('auth.editPassword.description')"
  >
    <template #default>
      <form role="form">
        <div class="mb-3">
          <label class="form-label">{{ t('authLabels.username') }}</label>
          <input
            type="text"
            class="form-control form-control-lg"
            :placeholder="t('auth.editPassword.usernamePlaceholder')"
            :aria-label="t('auth.editPassword.usernamePlaceholder')"
            aria-describedby="email-addon"
            v-model="username"
            @focusout="checkingUsername"
          />
          <span :class="usernameClass ? 'green' : 'red'">{{ usernameMsg }}</span>
        </div>

        <div class="mb-3">
          <label class="form-label">{{ t('authLabels.password') }}</label>
          <input
            type="password"
            class="form-control form-control-lg"
            :placeholder="t('auth.editPassword.passwordPlaceholder')"
            :aria-label="t('auth.editPassword.passwordPlaceholder')"
            aria-describedby="password-addon"
            v-model="password1"
            @focusout="checkingPassword"
          />
          <input
            type="password"
            class="form-control form-control-lg mt-2"
            :placeholder="t('auth.editPassword.passwordPlaceholder')"
            :aria-label="t('auth.editPassword.passwordPlaceholder')"
            aria-describedby="password-addon"
            v-model="password2"
            @focusout="checkingPassword"
          />
          <span :class="passwordClass ? 'red' : 'green'">{{ passwordMsg }}</span>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('authLabels.email') }}</label>
          <input
            type="text"
            class="form-control form-control-lg"
            :placeholder="t('auth.editPassword.emailPlaceholder')"
            v-model="email"
            @focusout="checkingEmail"
          />
          <span :class="emailClass ? 'red' : 'green'">{{ emailMsg }}</span>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('authLabels.name') }}</label>
          <input
            type="text"
            class="form-control form-control-lg"
            :placeholder="t('auth.editPassword.namePlaceholder')"
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
            {{ t('auth.editPassword.button') }}
          </button>
        </div>
      </form>
    </template>
  </AuthCardLayout>
</template>

<script setup>
import { ref, onMounted, toValue, computed } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { useI18n } from 'vue-i18n'
import AuthCardLayout from '@/components/auth/AuthCardLayout.vue'

const { t } = useI18n()

const store = useStore()
const router = useRouter()
const route = useRoute()

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
    usernameClass.value = false
    usernameMsgKey.value = 'auth.warnings.usernameRequired'
  } else if (!usernameRegex.test(username.value)) {
    confirmUsername.value = false
    usernameClass.value = false
    usernameMsgKey.value = 'auth.warnings.usernameInvalid'
  } else {
    await store.dispatch('SEARCH_USER', { searchUser: username.value })

    if (store.state.user) {
      confirmUsername.value = true
      usernameClass.value = true
      usernameMsgKey.value = 'auth.editPassword.usernameFound'
    } else {
      confirmUsername.value = false
      usernameClass.value = false
      usernameMsgKey.value = 'auth.editPassword.usernameNotFound'
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
        title: t('auth.editPassword.success'),
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
        title: t('auth.editPassword.fail'),
        icon: 'error'
      })
    }
  } else {
    await Swal.fire({
      title: t('auth.editPassword.invalidInput'),
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
</script>

<style scoped>
.bg-img {
  background-image: url('/jesus.png');
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
