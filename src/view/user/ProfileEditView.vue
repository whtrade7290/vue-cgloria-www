<template>
  <AuthCardLayout :title="t('profile.title')" :description="t('profile.description')">
    <template #default>
      <form class="profile-form" @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="form-label">{{ t('profile.fields.image') }}</label>
          <div class="avatar-wrapper">
            <div class="avatar-preview" :class="{ empty: !currentImage }">
              <img v-if="currentImage" :src="currentImage" alt="profile" />
              <span v-else>{{ t('profile.fields.imagePlaceholder') }}</span>
            </div>
            <div class="d-flex gap-3 flex-wrap align-items-center">
              <input
                ref="fileInput"
                type="file"
                class="d-none"
                accept="image/*"
                :disabled="loading"
                @change="handleImageSelect"
              />
              <button
                type="button"
                class="image-link text-highlight"
                :disabled="loading"
                @click="triggerFileSelect"
              >
                {{ t('profile.actions.uploadImage') }}
              </button>
              <button
                type="button"
                class="image-link text-danger"
                :class="{ disabled: loading || (!imageFile && !form.profileImageUrl) }"
                :disabled="loading || (!imageFile && !form.profileImageUrl)"
                @click="handleRemoveImage"
              >
                {{ t('profile.actions.removeImage') }}
              </button>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('profile.fields.username') }}</label>
          <input
            v-model="form.username"
            type="text"
            class="form-control form-control-lg"
            disabled
          />
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('profile.fields.name') }}</label>
          <input
            v-model.trim="form.name"
            type="text"
            class="form-control form-control-lg"
            :disabled="loading"
            @input="handleNameInput"
          />
          <span
            v-if="nameStatus.touched && nameMessage"
            :class="['field-feedback', { error: nameStatus.invalid }]"
            >{{ nameMessage }}</span
          >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('profile.fields.email') }}</label>
          <input
            v-model.trim="form.email"
            type="email"
            class="form-control form-control-lg"
            :disabled="loading"
            @input="handleEmailInput"
          />
          <span
            v-if="emailStatus.touched && emailMessage"
            :class="['field-feedback', { error: emailStatus.invalid }]"
            >{{ emailMessage }}</span
          >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ t('profile.fields.password') }}</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control form-control-lg"
            :placeholder="t('profile.fields.password')"
            :disabled="loading"
            @input="handlePasswordInput"
          />
        </div>
        <div class="mb-4">
          <label class="form-label">{{ t('profile.fields.confirmPassword') }}</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="form-control form-control-lg"
            :placeholder="t('profile.fields.confirmPassword')"
            :disabled="loading"
            @input="handlePasswordInput"
          />
          <span
            v-if="passwordStatus.touched && passwordMessage"
            :class="['field-feedback', { error: passwordStatus.invalid }]"
            >{{ passwordMessage }}</span
          >
        </div>
        <div class="d-flex justify-content-end gap-2 flex-wrap">
          <button
            type="button"
            class="btn btn-outline-secondary"
            :disabled="loading"
            @click="resetForm"
          >
            {{ t('profile.actions.reset') }}
          </button>
          <button type="submit" class="btn bg-gradient-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ t('profile.actions.save') }}
          </button>
        </div>
      </form>
    </template>
  </AuthCardLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import AuthCardLayout from '@/components/auth/AuthCardLayout.vue'

const store = useStore()
const router = useRouter()
const { t } = useI18n()

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const form = reactive({
  id: null,
  username: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  profileImageUrl: ''
})

const NAME_REGEX = /^[\u3040-\u30FF\uAC00-\uD7A3\u4E00-\u9FFFa-zA-Z]+$/
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/

const getRelativeProfilePath = (value) => {
  if (!value || typeof value !== 'string') return ''
  const trimmedValue = value.trim()
  if (!trimmedValue) return ''
  const toRelative = (path) => {
    const idx = path.indexOf('/uploads/profile/')
    return idx !== -1 ? path.slice(idx) : path
  }
  if (/^https?:\/\//i.test(trimmedValue)) {
    const url = new URL(trimmedValue)
    return toRelative(url.pathname)
  }
  if (/^\/\//.test(trimmedValue)) {
    return toRelative(trimmedValue.replace(/^\/\/[^/]+/, ''))
  }
  if (/^[\w.-]+:\d+\//.test(trimmedValue)) {
    return toRelative(trimmedValue.replace(/^[\w.-]+:\d+/, ''))
  }
  const normalizedPath = trimmedValue.replace(/^\/+/, '')
  if (normalizedPath.startsWith('uploads/profile/')) {
    return `/${normalizedPath}`
  }
  return normalizedPath ? `/${normalizedPath}` : ''
}

const buildProfileImageUrl = (value) => {
  if (!value) return ''
  if (value.startsWith('blob:')) return value
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  const relative = getRelativeProfilePath(value)
  if (relative) {
    return `${baseUrl}${relative}`
  }
  return baseUrl ? `${baseUrl}/${value.replace(/^\/+/, '')}` : value
}

const loading = ref(false)
const original = ref({ name: '', email: '', profileImageUrl: '' })
const imageFile = ref(null)
const imagePreview = ref('')
const removeImageFlag = ref(false)
const fileInput = ref(null)

const currentImage = computed(
  () => imagePreview.value || buildProfileImageUrl(form.profileImageUrl)
)

const nameStatus = reactive({ touched: false, invalid: false, messageKey: '' })
const emailStatus = reactive({ touched: false, invalid: false, messageKey: '' })
const passwordStatus = reactive({ touched: false, invalid: false, messageKey: '' })

const nameMessage = computed(() => (nameStatus.messageKey ? t(nameStatus.messageKey) : ''))
const emailMessage = computed(() => (emailStatus.messageKey ? t(emailStatus.messageKey) : ''))
const passwordMessage = computed(() =>
  passwordStatus.messageKey ? t(passwordStatus.messageKey) : ''
)

const resetFieldStatus = (status) => {
  status.touched = false
  status.invalid = false
  status.messageKey = ''
}

const resetValidationStates = () => {
  resetFieldStatus(nameStatus)
  resetFieldStatus(emailStatus)
  resetFieldStatus(passwordStatus)
}

const validateNameField = (force = false) => {
  if (force && !nameStatus.touched) {
    nameStatus.touched = true
  }
  if (!nameStatus.touched) return true
  if (!form.name || !NAME_REGEX.test(form.name)) {
    nameStatus.invalid = true
    nameStatus.messageKey = 'profile.alerts.invalidName'
    return false
  }
  nameStatus.invalid = false
  nameStatus.messageKey = ''
  return true
}

const validateEmailField = (force = false) => {
  if (force && !emailStatus.touched) {
    emailStatus.touched = true
  }
  if (!emailStatus.touched) return true
  if (!form.email || !EMAIL_REGEX.test(form.email)) {
    emailStatus.invalid = true
    emailStatus.messageKey = 'profile.alerts.invalidEmail'
    return false
  }
  emailStatus.invalid = false
  emailStatus.messageKey = ''
  return true
}

const validatePasswordField = (force = false) => {
  if (force && !passwordStatus.touched) {
    passwordStatus.touched = true
  }
  if (!passwordStatus.touched) return true
  const hasPassword = !!form.password
  const hasConfirm = !!form.confirmPassword

  if (hasPassword && form.password.length < 8) {
    passwordStatus.invalid = true
    passwordStatus.messageKey = 'profile.alerts.passwordShort'
    return false
  }

  if ((hasPassword || hasConfirm) && form.password !== form.confirmPassword) {
    passwordStatus.invalid = true
    passwordStatus.messageKey = 'profile.alerts.passwordMismatch'
    return false
  }

  passwordStatus.invalid = false
  passwordStatus.messageKey = ''
  return true
}

const handleNameInput = () => {
  if (!nameStatus.touched) {
    nameStatus.touched = true
  }
  validateNameField()
}

const handleEmailInput = () => {
  if (!emailStatus.touched) {
    emailStatus.touched = true
  }
  validateEmailField()
}

const handlePasswordInput = () => {
  if (!passwordStatus.touched) {
    passwordStatus.touched = true
  }
  validatePasswordField()
}

const loadProfile = async () => {
  const storedData = localStorage.getItem(getUserIdFromCookie())
  const parsed = storedData ? JSON.parse(storedData) : null

  if (!parsed?.user?.username) {
    await Swal.fire({
      title: t('profile.alerts.notLoggedIn'),
      icon: 'warning'
    })
    router.push({ name: 'login' })
    return false
  }

  try {
    const response = await store.dispatch('SEARCH_USER', { searchUser: parsed.user.username })
    const fetchedUser = response?.data
    if (!fetchedUser?.id) {
      throw new Error('User not found')
    }

    form.id = fetchedUser.id
    form.username = fetchedUser.username ?? parsed.user.username ?? ''
    form.name = fetchedUser.name ?? parsed.user.name ?? ''
    form.email = fetchedUser.email ?? parsed.user.email ?? ''
    form.password = ''
    form.confirmPassword = ''
    form.profileImageUrl = getRelativeProfilePath(
      fetchedUser.profileImageUrl ??
        fetchedUser.profile_image_url ??
        fetchedUser.writerProfileImageUrl ??
        fetchedUser.writer_profile_image_url ??
        parsed.user.profileImageUrl ??
        ''
    )
    removeImageFlag.value = false
    original.value = {
      name: form.name,
      email: form.email,
      profileImageUrl: form.profileImageUrl
    }
    resetValidationStates()
    return true
  } catch (error) {
    console.error('Failed to fetch user profile', error)
    await Swal.fire({
      title: t('profile.alerts.fail'),
      icon: 'error'
    })
    router.push({ name: 'login' })
    return false
  }
}

const resetForm = () => {
  form.name = original.value.name
  form.email = original.value.email
  form.password = ''
  form.confirmPassword = ''
  form.profileImageUrl = original.value.profileImageUrl
  removeImageFlag.value = false
  clearImageSelection()
  resetValidationStates()
}

const updateStoredUser = ({ name, email, profileImageUrl }) => {
  const storedData = localStorage.getItem(getUserIdFromCookie())
  if (!storedData) return
  const parsed = JSON.parse(storedData)
  if (!parsed?.user) return

  if (typeof name === 'string') {
    parsed.user.name = name
  }
  if (typeof email === 'string') {
    parsed.user.email = email
  }
  if (profileImageUrl !== undefined) {
    const normalized = getRelativeProfilePath(profileImageUrl)
    parsed.user.profileImageUrl = normalized
    parsed.user.profile_image_url = normalized
    parsed.user.writerProfileImageUrl = normalized
    parsed.user.writer_profile_image_url = normalized
  }

  localStorage.setItem(getUserIdFromCookie(), JSON.stringify(parsed))
}

const updateStoreUser = ({ name, email, profileImageUrl }) => {
  if (!store.state.user || Object.keys(store.state.user).length === 0) return
  const updated = { ...store.state.user }
  if (typeof name === 'string') {
    updated.name = name
  }
  if (typeof email === 'string') {
    updated.email = email
  }
  if (profileImageUrl !== undefined) {
    updated.profileImageUrl = profileImageUrl
    updated.profile_image_url = profileImageUrl
    updated.writerProfileImageUrl = profileImageUrl
    updated.writer_profile_image_url = profileImageUrl
  }
  store.commit('SET_USER', updated)
}

const revokePreview = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = ''
  }
}

const clearImageSelection = () => {
  imageFile.value = null
  revokePreview()
  removeImageFlag.value = false
}

const handleImageSelect = (event) => {
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
  clearImageSelection()
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  event.target.value = ''
}

const handleRemoveImage = () => {
  if (imageFile.value) {
    clearImageSelection()
  } else if (form.profileImageUrl) {
    removeImageFlag.value = true
    form.profileImageUrl = ''
  }
}

const triggerFileSelect = () => {
  if (loading.value) return
  fileInput.value?.click()
}

const validateForm = () => {
  const isNameValid = validateNameField(true)
  const isEmailValid = validateEmailField(true)
  const shouldForcePassword = !!form.password || !!form.confirmPassword
  const isPasswordValid = validatePasswordField(shouldForcePassword)

  return isNameValid && isEmailValid && isPasswordValid
}

const submitForm = async () => {
  if (!validateForm() || !form.id) return

  const basePayload = {
    id: form.id,
    name: form.name.trim(),
    email: form.email.trim()
  }

  if (form.password) {
    basePayload.password = form.password
  }

  if (removeImageFlag.value) {
    basePayload.removeProfileImage = true
  }

  let payload = basePayload
  if (imageFile.value) {
    payload = new FormData()
    payload.append('data', JSON.stringify(basePayload))
    payload.append('profileImage', imageFile.value)
  }

  loading.value = true
  try {
    const result = await store.dispatch('UPDATE_PROFILE', payload)
    if (result && result.success === false) {
      throw new Error('update failed')
    }
    const updatedName = result.user?.name ?? basePayload.name
    const updatedEmail = result.user?.email ?? basePayload.email
    const updatedImage =
      result.user?.profileImageUrl ?? result.profileImageUrl ?? form.profileImageUrl
    const normalizedImage = getRelativeProfilePath(updatedImage)

    const updatePayload = {
      name: updatedName,
      email: updatedEmail,
      profileImageUrl: normalizedImage
    }
    updateStoredUser(updatePayload)
    updateStoreUser(updatePayload)
    form.name = updatedName
    form.email = updatedEmail
    form.profileImageUrl = normalizedImage
    original.value = { name: updatedName, email: updatedEmail, profileImageUrl: normalizedImage }
    removeImageFlag.value = false
    form.password = ''
    form.confirmPassword = ''
    clearImageSelection()
    resetValidationStates()
    await Swal.fire({
      title: t('profile.alerts.success'),
      icon: 'success'
    })
  } catch (error) {
    console.error('Profile update failed', error)
    await Swal.fire({
      title: t('profile.alerts.fail'),
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})

onBeforeUnmount(() => {
  revokePreview()
})
</script>

<style scoped>
.profile-form .btn {
  min-width: 120px;
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
  transition:
    transform 0.15s ease,
    color 0.15s ease;
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
.field-feedback {
  display: block;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  color: #198754;
}
.field-feedback.error {
  color: #c53030;
}
</style>
