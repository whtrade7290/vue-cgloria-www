<template>
  <section>
    <div class="container">
      <div class="detail-card">
        <div>
          <h2>{{ store.state.detail.title || '' }}</h2>
        </div>
        <div class="detail-meta">
          <div>
            <div class="writer-profile">
              <div v-if="writerProfileImage" class="writer-avatar">
                <img :src="writerProfileImage" :alt="writerName" />
              </div>
              <div v-else class="writer-avatar writer-avatar--placeholder">
                {{ writerInitial }}
              </div>
              <div>
                <p class="writer-name">
                  {{ writerName }}
                </p>
              </div>
            </div>
            <div class="d-flex justify-content-start">
              <div style="margin-right: 0.8rem; margin-left: 0.5rem">
                <a href="javascript:;" class="material-symbols-outlined" @click="contentCopy">
                  share
                </a>
              </div>
              <div style="margin-right: 0.3rem">
                <span class="material-symbols-outlined"> comment </span>
              </div>
              <div style="font-size: 1rem">{{ commentCount }}</div>
            </div>
          </div>
          <div>
            <p style="margin-top: 0.2rem; font-size: 1rem; font-weight: 500">
              {{ formatDate(store.state.detail.create_at) || '' }}
            </p>
          </div>
        </div>
        <div class="content-box">
          <div v-if="imageUrl" class="img-container">
            <img
              :key="store.state.detail.id"
              :src="imageUrl"
              :alt="store.state.detail.title"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width="300"
              height="200"
            />
            <button
              type="button"
              class="download-link"
              @click="downloadAttachment(imageUrl, store.state.detail.filename)"
            >
              <span class="material-symbols-outlined">download</span>
              <span>{{ $t('button.download') }}</span>
            </button>
          </div>
          <div v-else-if="pdfAttachment" class="file-chip-group">
            <a class="file-chip" :href="pdfAttachment.url" target="_blank" rel="noopener">
              <span class="material-symbols-outlined file-chip__icon">picture_as_pdf</span>
              <span class="file-chip__name">{{ pdfAttachment.name }}</span>
            </a>
            <button
              type="button"
              class="download-link download-link--chip"
              @click="downloadAttachment(pdfAttachment.url, pdfAttachment.name)"
            >
              <span class="material-symbols-outlined">download</span>
              <span>{{ $t('button.download') }}</span>
            </button>
          </div>
          <div class="content-container" v-html="sanitizedContent"></div>
        </div>
        <div class="button-box">
          <a
            href="javascript:;"
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0 btn-style"
            @click="goToBoardList"
            >{{ $t('button.toList') }}</a
          >
          <a
            href="javascript:;"
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0 btn-style"
            v-show="isWriter"
            @click="goToEditPage"
            >{{ $t('button.edit') }}</a
          >
          <a
            href="javascript:;"
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0 btn-style"
            v-show="isWriter"
            @click="deleteBoard"
            >{{ $t('button.delete') }}</a
          >
        </div>
      </div>
      <CommentComponent v-if="isLogin" @commentCount="handleCommentCount"></CommentComponent>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import Swal from 'sweetalert2'
import CommentComponent from '@/components/common/CommentComponent.vue'
import { formatDate } from '@/utils/dateFormat'
import { useI18n } from 'vue-i18n'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { t } = useI18n()
const commentCount = ref(0)

const isLogin = computed(() => {
  return JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user ? true : false
})

const sanitizedContent = computed(() => sanitizeHtml(store.state.detail.content || ''))
const writerName = computed(
  () => store.state.detail.writer_name ?? store.state.detail.writer ?? ''
)
const normalizeProfileImage = (value) => {
  if (!value || typeof value !== 'string') return ''
  const trimmedValue = value.trim()
  if (!trimmedValue) return ''
  if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue
  if (/^\/\//.test(trimmedValue)) {
    return `${window?.location?.protocol || 'https:'}${trimmedValue}`
  }
  if (/^[\w.-]+:\d+\//.test(trimmedValue)) {
    return `${window?.location?.protocol || 'https:'}//${trimmedValue.replace(/^\/+/, '')}`
  }
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  const normalizedPath = trimmedValue.replace(/^\/+/, '')
  return baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`
}

const writerProfileImage = computed(() => {
  const detail = store.state.detail || {}
  const rawValue =
    detail.writerProfileImageUrl ||
    detail.writer_profile_image_url ||
    ''
  return normalizeProfileImage(rawValue)
})
const writerInitial = computed(() => {
  if (!writerName.value) return 'C'
  return writerName.value.trim().charAt(0).toUpperCase()
})

const handleCommentCount = (count) => {
  commentCount.value = count
}

const contentCopy = async () => {
  const content = store.state.detail.content
  navigator.clipboard.writeText(stripHtmlTags(content))

  await Swal.fire({
    title: t('alerts.copySuccess'),
    icon: 'success'
  })
}

function stripHtmlTags(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string input')
  }

  // 임시 요소를 사용하여 HTML 태그를 제거
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = input

  // 텍스트 콘텐츠를 반환
  return tempDiv.textContent || tempDiv.innerText || ''
}

function goToBoardList() {
  router.push({
    name: route.params.name,
    query: {
      pageNum: route.query.pageNum,
      roomId: route.query.roomId,
      searchWord: route.query.searchWord
    }
  })
}

const isWriter = computed(() => {
  const localUser = JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user

  if (!localUser) return false

  return localUser.username === store.state.detail.writer || localUser.role === 'ADMIN'
})

const goToEditPage = () => {
  router.push({
    name: 'edit',
    query: { name: route.params.name, id: store.state.detail.id }
  })
}

const deleteBoard = () => {
  Swal.fire({
    title: t('alerts.deleteConfirmTitle'),
    text: t('alerts.deleteConfirmText'),
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: t('alerts.deleteConfirmNo'),
    confirmButtonText: t('alerts.deleteConfirmYes')
  }).then(async (result) => {
    if (result.isConfirmed) {
      let deleteKey = ''

      if (store.state.detail.uuid && store.state.detail.filename && store.state.detail.extension) {
        deleteKey = `uploads/${store.state.detail.uuid}_${store.state.detail.filename}`
      }

      const result = await store.dispatch('DELETE_BOARD', {
        name: route.params.name,
        id: store.state.detail.id,
        deleteKey: deleteKey
      })
      if (result) {
        Swal.fire({
          title: t('alerts.deleteSuccess'),
          icon: 'success'
        }).then(() => {
          router.go(-1)
        })
      }
    }
  })
}

const imageUrl = ref(null)
const pdfAttachment = ref(null)

const downloadAttachment = async (url, filename) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Download failed')
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(objectUrl)
  } catch (error) {
    console.error('download error', error)
    await Swal.fire({
      title: t('alerts.downloadError'),
      icon: 'error'
    })
  }
}

onMounted(() => {
  // 컴포넌트가 마운트된 후에 이미지 URL을 설정
  if (store.state.detail.uuid && store.state.detail.filename && store.state.detail.extension) {
    const fileUrl = `${import.meta.env.VITE_API_URL}uploads/${store.state.detail.uuid}_${store.state.detail.filename}`
    const normalizedExtension = store.state.detail.extension.replace('.', '').toLowerCase()

    if (normalizedExtension === 'pdf') {
      pdfAttachment.value = {
        url: fileUrl,
        name: store.state.detail.filename
      }
      imageUrl.value = null
    } else {
      imageUrl.value = fileUrl
      pdfAttachment.value = null
    }
  }
})
</script>

<style scoped>
.border-line {
  border-top: 1px #dddddd solid;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.comment-display-box {
  font-size: 1.2rem;
  width: 50rem;
  /* height: 20rem; */
  margin: 2rem 0 0 2.5rem;
  overflow-y: scroll;
}
.comment-container {
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  padding: 2.5rem 0 2.5rem 0;
}
.comment-box {
  width: 60rem;
  /* height: 35rem; */
  background-color: #fff;
  display: flex;
  justify-content: center;
  border-radius: 1rem;
  padding: 1rem;
}
.comment-info-box {
  width: 55rem;
  height: 2.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  /* background-color: yellow; */
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 7rem;
  margin-bottom: 5rem;
  border-radius: 1.5rem;
  padding: 3rem;
  overflow-x: hidden;
  background-color: #fff;
}
.detail-card {
  width: 100%;
  height: 80%;
}
.detail-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}
.writer-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.writer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f5c6aa;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.writer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.writer-avatar--placeholder {
  background: linear-gradient(310deg, #f7e7dc 0%, #f5c6aa 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
}
.writer-name {
  margin: 0.15rem 0 0;
  font-size: 1.3rem;
  font-weight: 700;
}
.user-info {
  display: flex;
}
.font-style {
  font-size: 3rem;
}
.content-box {
  width: 100%;
  height: 85%;
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem 0 1.5rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.button-box {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}
.img-container {
  height: 100%;
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율을 유지하면서 컨테이너에 맞게 조정 */
}
.file-chip-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.file-chip {
  width: 100%;
  max-width: 22rem;
  min-height: 17rem;
  border: 1px dashed #c0c4d5;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin: 1rem auto 0;
  text-align: center;
  color: #344767;
  background-color: #f8f9fc;
  text-decoration: none;
}
.file-chip__icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #f5365c;
}
.file-chip__name {
  font-size: 1rem;
  word-break: break-all;
}
.download-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.9rem;
  color: #344767;
  border: 1px solid rgba(52, 71, 103, 0.2);
  background-color: rgba(248, 249, 252, 0.9);
}
.download-link--chip {
  width: 100%;
  justify-content: center;
}
.download-link span.material-symbols-outlined {
  font-size: 1.1rem;
}
.content-container {
  margin-top: 2rem;
  white-space: pre-line;
}

.btn-style {
  width: 110px;
  height: 100%;
}

p {
  word-wrap: break-word; /* 긴 단어를 자동으로 줄바꿈 */
  white-space: normal; /* 기본적인 줄바꿈 설정 */
}
@media (max-width: 425px) {
  .container {
    padding: 1.5rem;
  }
  .btn-style {
    font-size: 0.48rem;
  }
}

@media (min-width: 1400px) {
  section {
    padding-left: 5rem;
    padding-right: 5rem;
  }
}
</style>
