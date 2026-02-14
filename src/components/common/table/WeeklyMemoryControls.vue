<template>
  <section class="memory-range-card">
    <div class="memory-range-card__header">
      <p class="memory-range-card__eyebrow">
        {{ $t('table.memoryControls.subtitle') }}
      </p>
      <h4 class="memory-range-card__title">
        {{ $t('table.memoryControls.title') }}
      </h4>
      <p class="memory-range-card__description">
        {{ $t('table.memoryControls.description') }}
      </p>
    </div>
    <div class="memory-range-card__body">
      <div class="memory-range-card__inputs">
        <div class="memory-range-card__field">
          <label for="memoryFrom">{{ $t('table.memoryControls.from') }}</label>
          <input id="memoryFrom" v-model="memoryRange.from" type="date" />
        </div>
        <span class="memory-range-card__divider">~</span>
        <div class="memory-range-card__field">
          <label for="memoryTo">{{ $t('table.memoryControls.to') }}</label>
          <input id="memoryTo" v-model="memoryRange.to" type="date" />
        </div>
        <button class="btn bg-gradient-primary mb-0" :disabled="!canSearch" @click="handleSearch">
          {{ $t('table.memoryControls.searchButton') }}
        </button>
      </div>
      <p v-if="searchResultCount !== null" class="memory-range-card__result">
        검색 결과 {{ searchResultCount }}건이 조회되었습니다.
      </p>
      <div v-if="hasSearched" class="memory-range-card__actions">
        <button class="btn btn-outline-primary" @click="handleCopy">
          {{ $t('table.memoryControls.copyButton') }}
        </button>
        <button class="btn btn-outline-secondary" @click="handleDownload">
          {{ $t('table.memoryControls.downloadButton') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { requestRememberBibleDownload } from '@/api/index'
import { getUserIdFromCookie } from '@/utils/cookie.ts'

const emit = defineEmits(['search', 'copy', 'download'])
const router = useRouter()
const { t } = useI18n()

const memoryRange = reactive({
  from: '',
  to: ''
})
const searchResultCount = ref(null)
const memoryResults = ref([])
const hasSearched = ref(false)
const canSearch = computed(() => Boolean(memoryRange.from) && Boolean(memoryRange.to))

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
  const result = await Swal.fire({
    title: t('alerts.loginRequired'),
    text: t('alerts.loginRequired'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('button.login'),
    cancelButtonText: t('button.cancel')
  })
  if (result.isConfirmed) {
    router.push({
      name: 'login',
      query: { redirect: router.currentRoute.value.fullPath }
    })
  }
  return false
}

const ensureLoginForDownloads = async () => {
  if (isUserLoggedIn()) return true
  await promptLoginForDownload()
  return false
}

const payload = () => ({
  from: memoryRange.from,
  to: memoryRange.to
})

const extractVerseList = (responseData) => {
  if (Array.isArray(responseData)) return responseData
  if (responseData && typeof responseData === 'object') {
    if (Array.isArray(responseData.list)) return responseData.list
    if (Array.isArray(responseData.items)) return responseData.items
    if (Array.isArray(responseData.data)) return responseData.data
    if (Array.isArray(responseData.verses)) return responseData.verses
  }
  return []
}

const resolveResultCount = (response, listLength) => {
  const data = response?.data
  if (typeof data === 'number') return data
  if (Array.isArray(data)) return data.length
  if (data && typeof data === 'object') {
    if (Number.isFinite(data.count)) return Number(data.count)
    if (Number.isFinite(data.total)) return Number(data.total)
    if (Array.isArray(data.list)) return data.list.length
    if (Array.isArray(data.items)) return data.items.length
    if (Array.isArray(data.verses)) return data.verses.length
  }
  return listLength ?? null
}

const fetchMemoryRangeData = async (params) => {
  const response = await requestRememberBibleDownload({
    fromDate: params.from,
    toDate: params.to
  })
  const list = extractVerseList(response?.data)
  memoryResults.value = list
  const count = resolveResultCount(response, list.length)
  return {
    list,
    count: Number.isFinite(count) ? count : list.length
  }
}

const handleSearch = async () => {
  const params = payload()
  try {
    const { count } = await fetchMemoryRangeData(params)
    searchResultCount.value = count
    hasSearched.value = true
  } catch (error) {
    console.error('Failed to request memory verse download', error)
    searchResultCount.value = null
    memoryResults.value = []
    hasSearched.value = false
  }
  emit('search', params)
}

const formatVerseReference = (verse, index) => {
  const label = verse?.long_label || verse?.longLabel || verse?.book || ''
  const chapter = verse?.chapter ?? verse?.Chapter ?? verse?.chapterNumber ?? ''
  const paragraph = verse?.paragraph ?? verse?.Paragraph ?? verse?.verse ?? ''
  return `${index + 1}. ${label} ${chapter}장 ${paragraph}절`
}

const formatVerseSentence = (verse) => {
  return (
    verse?.sentence ||
    verse?.text ||
    verse?.content ||
    `${verse?.long_label || verse?.book || ''} ${verse?.chapter || ''}장 ${verse?.paragraph || ''}절`
  )
}

const buildDownloadText = (range, verses) => {
  const lines = [`${range.from} ~ ${range.to} 암송말씀`]
  verses.forEach((verse, idx) => {
    lines.push(formatVerseReference(verse, idx))
    lines.push(formatVerseSentence(verse))
    lines.push('')
  })
  lines.push(
    '※ 성경구절 상/하 구분은 되어있지 않으니 상/하 구분에 대해서는 공지사항의 주일예배순서 게시물을 참조 부탁드립니다.'
  )
  return lines.join('\n').trim()
}

const triggerTextDownload = (content, range) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const safeFrom = range.from || 'start'
  const safeTo = range.to || 'end'
  anchor.href = url
  anchor.download = `암송구절_${safeFrom}-${safeTo}.txt`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

const ensureMemoryData = async (params) => {
  if (!memoryResults.value.length) {
    const { list } = await fetchMemoryRangeData(params)
    memoryResults.value = list
  }
  return memoryResults.value
}

const handleCopy = async () => {
  const params = payload()
  const allowed = await ensureLoginForDownloads()
  if (!allowed) return
  try {
    await ensureMemoryData(params)
    const content = buildDownloadText(params, memoryResults.value)
    await navigator.clipboard.writeText(content)
    await Swal.fire({
      title: '암송 구절이 복사되었습니다.',
      icon: 'success',
      confirmButtonText: t('button.confirm')
    })
  } catch (error) {
    console.error('Failed to copy memory verses', error)
    await Swal.fire({
      title: '암송 구절 복사에 실패하였습니다.',
      icon: 'error',
      confirmButtonText: t('button.confirm')
    })
  }
  emit('copy', params)
}

const handleDownload = async () => {
  const params = payload()
  const allowed = await ensureLoginForDownloads()
  if (!allowed) return
  try {
    await ensureMemoryData(params)
    const content = buildDownloadText(params, memoryResults.value)
    triggerTextDownload(content, params)
    await Swal.fire({
      title: '암송 구절 파일이 다운로드되었습니다.',
      icon: 'success',
      confirmButtonText: t('button.confirm')
    })
  } catch (error) {
    console.error('Failed to download memory verses', error)
    await Swal.fire({
      title: '암송 구절 다운로드에 실패하였습니다.',
      icon: 'error',
      confirmButtonText: t('button.confirm')
    })
  }
  emit('download', params)
}
</script>

<style scoped>
.memory-range-card {
  border: 1px solid #e4e9f2;
  border-radius: 1.25rem;
  padding: 2rem 2rem;
  margin-bottom: 2rem;
  background: #fefefe;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.06);
}
.memory-range-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.35rem;
}
.memory-range-card__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}
.memory-range-card__description {
  color: #64748b;
  margin-bottom: 1.25rem;
}
.memory-range-card__body {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}
.memory-range-card__inputs {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.memory-range-card__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.memory-range-card__field input {
  min-width: 180px;
  border: 1px solid #d4dae3;
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
}
.memory-range-card__divider {
  font-size: 1.25rem;
  color: #94a3b8;
  font-weight: 600;
}
.memory-range-card__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.memory-range-card__result {
  margin: 0;
  font-size: 0.95rem;
  color: #475569;
  font-weight: 600;
  width: 100%;
}
.memory-range-card__actions .btn {
  min-width: 140px;
}

@media (max-width: 768px) {
  .memory-range-card {
    padding: 1.25rem;
  }
  .memory-range-card__body {
    flex-direction: column;
    align-items: stretch;
  }
  .memory-range-card__inputs {
    width: 100%;
  }
  .memory-range-card__field input {
    width: 100%;
  }
  .memory-range-card__actions .btn {
    width: 100%;
  }
}
</style>
