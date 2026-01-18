<template>
  <AuthCardLayout :title="$t('auth.signUpTitle')" :description="$t('auth.signUpDescription')">
    <template #default>
      <form role="form">
        <div class="mb-4">
          <label class="form-label">
            {{ $t('profile.fields.image') }}
            <span class="label-optional">({{ $t('profile.fields.optional') }})</span>
          </label>
          <div class="avatar-wrapper">
            <div class="avatar-preview" :class="{ empty: !avatarPreview }">
              <img v-if="avatarPreview" :src="avatarPreview" alt="avatar preview" />
              <span v-else>{{ $t('profile.fields.imagePlaceholder') }}</span>
            </div>
            <div class="d-flex gap-3 flex-wrap align-items-center">
              <input
                ref="avatarInput"
                type="file"
                class="d-none"
                accept="image/*"
                :disabled="isSubmitting"
                @change="handleAvatarSelect"
              />
              <button
                type="button"
                class="image-link text-highlight"
                :disabled="isSubmitting"
                @click="triggerAvatarSelect"
              >
                {{ $t('profile.actions.uploadImage') }}
              </button>
              <button
                type="button"
                class="image-link text-danger"
                :class="{ disabled: isSubmitting || !avatarPreview }"
                :disabled="isSubmitting || !avatarPreview"
                @click="clearAvatar"
              >
                {{ $t('profile.actions.removeImage') }}
              </button>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('authLabels.username') }}</label>
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
          <label class="form-label">{{ $t('authLabels.password') }}</label>
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
          <label class="form-label">{{ $t('authLabels.email') }}</label>
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
          <label class="form-label">{{ $t('authLabels.name') }}</label>
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
    </template>
  </AuthCardLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { useI18n } from 'vue-i18n'
import AuthCardLayout from '@/components/auth/AuthCardLayout.vue'

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
const avatarInput = ref(null)
const avatarPreview = ref('')
const isSubmitting = ref(false)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

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

const handleAvatarSelect = (event) => {
  const [file] = event.target.files || []
  if (!file) return
  if (!ALLOWED_TYPES.includes(file.type)) {
    Swal.fire({ title: t('profile.alerts.imageType'), icon: 'warning' })
    event.target.value = ''
    return
  }
  if (file.size > MAX_IMAGE_SIZE) {
    Swal.fire({ title: t('profile.alerts.imageSize'), icon: 'warning' })
    event.target.value = ''
    return
  }
  clearAvatar()
  avatarPreview.value = URL.createObjectURL(file)
  event.target.value = ''
}

const clearAvatar = () => {
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarPreview.value = ''
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}

const triggerAvatarSelect = () => {
  if (isSubmitting.value) return
  avatarInput.value?.click()
}

const signUp = async () => {
  if (confirmUsername.value && confirmPassword.value && confirmName.value) {
    isSubmitting.value = true
    try {
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
        clearAvatar()

        await router.push('/')
      } else {
        await Swal.fire({
          title: t('auth.signUpAlerts.fail'),
          icon: 'error'
        })
      }
    } finally {
      isSubmitting.value = false
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

onBeforeUnmount(() => {
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value)
  }
})
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
.avatar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.avatar-preview {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 1px dashed #ced4da;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #fdfdfd;
  margin-bottom: 0.5rem;
}
.avatar-preview.empty span {
  color: #adb5bd;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
}
.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
  background: none;
  border: none;
  padding: 0;
  transition: transform 0.15s ease, color 0.15s ease;
}
.image-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.image-link:not(:disabled):hover {
  transform: scale(1.05);
}
.image-link.text-highlight {
  color: #e49c7f !important;
  font-weight: 700;
}
.image-link.text-danger {
  color: #c53030 !important;
  font-weight: 700;
}
.image-link.text-danger.disabled {
  color: #adb5bd !important;
  -webkit-text-fill-color: #adb5bd !important;
  transform: none;
}
</style>
