<template>
  <CardContainer :title="headerTitle">
    <div class="plan-wrapper">
      <div class="description-row">
        <div class="description">
          <p class="description-text">
            {{ t('biblePlan.description') }}
            <span class="notice-text">{{ t('biblePlan.notice.japanesePending') }}</span>
          </p>
          <div class="status-col" v-if="statusMessage || downloadReady">
            <p v-if="statusMessage" :class="['status-text', statusType]">{{ statusMessage }}</p>
            <p v-if="downloadReady" class="status-text info">
              {{ t('biblePlan.messages.ready') }}
            </p>
          </div>
        </div>
        <div class="input-inline">
          <label class="form-label mb-2" for="plan-days">{{ t('biblePlan.form.daysLabel') }}</label>
          <input
            id="plan-days"
            type="number"
            min="1"
            step="1"
            inputmode="numeric"
            class="form-control form-control-lg days-input"
            :placeholder="t('biblePlan.form.daysPlaceholder')"
            v-model.trim="daysInput"
            :disabled="isGenerating"
          />
          <div class="helper-text">{{ t('biblePlan.form.helper') }}</div>
          <div v-if="daysError" class="error-text">{{ daysError }}</div>
          <div class="button-group">
            <button
              type="button"
              class="btn bg-gradient-primary"
              :disabled="disableGenerate"
              @click="handleGenerate"
            >
              <span
                v-if="isGenerating"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              {{ t('biblePlan.actions.generate') }}
            </button>
            <button
              v-if="downloadReady"
              type="button"
              class="btn btn-outline-primary"
              :disabled="!downloadReady"
              @click="downloadPlan"
            >
              {{ t('biblePlan.actions.download') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </CardContainer>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import CardContainer from '@/components/common/card/CardContainer.vue'
import { SMALLGROUP } from '@/data/sidemenu.js'
import { requestBiblePlan } from '@/api/index'
import { getUserIdFromCookie } from '@/utils/cookie.ts'

const store = useStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

store.dispatch('FETCH_SIDEMENU', SMALLGROUP)
const obj = ref(SMALLGROUP.find((item) => item.path === route.name) || null)

const headerTitle = computed(() => 'biblePlan.title')

const daysInput = ref('365')
const daysError = ref('')
const isGenerating = ref(false)
const downloadUrl = ref('')
const downloadName = ref('')
const statusMessage = ref('')
const statusType = ref('info')
const lastGeneratedDays = ref(null)

const downloadReady = computed(() => Boolean(downloadUrl.value))
const disableGenerate = computed(() => isGenerating.value || !isValidDays(daysInput.value))
const isUserLoggedIn = () => {
  try {
    const storedData = localStorage.getItem(getUserIdFromCookie())
    const parsed = storedData ? JSON.parse(storedData) : null
    return Boolean(parsed?.user?.id)
  } catch {
    return false
  }
}

const promptLoginForDownload = async () => {
  await Swal.fire({
    title: t('alerts.loginRequired'),
    text: t('alerts.loginRequired'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('button.login'),
    cancelButtonText: t('button.cancel')
  }).then((result) => {
    if (result.isConfirmed) {
      router.push({
        name: 'login',
        query: { redirect: route.fullPath }
      })
    }
  })
}

const ensureDownloadAccess = async () => {
  if (isUserLoggedIn()) return true
  await promptLoginForDownload()
  return false
}

const isValidDays = (value) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0
}

watch(daysInput, () => {
  daysError.value = ''
})

const validateDaysInput = () => {
  const parsed = Number(daysInput.value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    daysError.value = t('biblePlan.messages.invalidDays')
    return null
  }
  daysError.value = ''
  return parsed
}

const resetDownload = () => {
  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value)
  }
  downloadUrl.value = ''
  downloadName.value = ''
}

const extractFilename = (disposition, days) => {
  if (typeof disposition !== 'string') {
    return `성경통독표(${days}일).csv`
  }
  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
  if (matches && matches[1]) {
    const value = matches[1].replace(/['"]/g, '')
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  return `성경통독표(${days}일).csv`
}

const parseErrorMessage = async (error) => {
  const defaultMessage = t('biblePlan.messages.error')
  const data = error?.response?.data
  if (!data) return defaultMessage
  if (data instanceof Blob) {
    try {
      const text = await data.text()
      const parsed = JSON.parse(text)
      return parsed?.error || defaultMessage
    } catch {
      return defaultMessage
    }
  }
  if (typeof data === 'object' && data?.error) {
    return data.error
  }
  if (typeof data === 'string' && data.length > 0) {
    return data
  }
  return defaultMessage
}

const handleGenerate = async () => {
  const parsedDays = validateDaysInput()
  if (!parsedDays || isGenerating.value) return
  isGenerating.value = true
  statusMessage.value = ''
  statusType.value = 'info'

  try {
    const response = await requestBiblePlan(parsedDays)
    const blobData =
      response.data instanceof Blob ? response.data : new Blob([response.data], { type: 'text/csv' })

    resetDownload()
    downloadUrl.value = URL.createObjectURL(blobData)
    downloadName.value = extractFilename(response.headers?.['content-disposition'], parsedDays)
    lastGeneratedDays.value = parsedDays
    statusMessage.value = t('biblePlan.messages.success', { days: parsedDays })
    statusType.value = 'success'
  } catch (error) {
    resetDownload()
    statusMessage.value = await parseErrorMessage(error)
    statusType.value = 'error'
    console.error('Failed to generate bible plan', error)
  } finally {
    isGenerating.value = false
  }
}

const downloadPlan = async () => {
  if (!downloadUrl.value) return
  const allowed = await ensureDownloadAccess()
  if (!allowed) return
  const anchor = document.createElement('a')
  anchor.href = downloadUrl.value
  anchor.download =
    downloadName.value || `성경통독표(${lastGeneratedDays.value ?? ''}일).csv`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

onBeforeUnmount(() => {
  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value)
  }
})
</script>

<style scoped>
.plan-wrapper {
  max-width: 720px;
  margin: 0 auto;
}
.description-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}
.description {
  flex: 1 1 320px;
  color: #344767;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.description-text {
  margin: 0;
}
.notice-text {
  display: block;
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.input-inline {
  display: flex;
  flex-direction: column;
  flex: 0 0 260px;
}
.days-input {
  max-width: 360px;
}
.helper-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.25rem;
}
.error-text {
  color: #c53030;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
.status-col {
  flex: 1 1 auto;
  min-width: 160px;
}
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}
.status-text {
  margin-top: 1.5rem;
  font-weight: 600;
}
.status-text.success {
  color: #198754;
}
.status-text.error {
  color: #c53030;
}
.status-text.info {
  color: #6c757d;
}
</style>
