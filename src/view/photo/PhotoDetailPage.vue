<template>
  <section>
    <div class="container">
      <div class="detail-card">
        <div>
          <h2>{{ store.state.detail.title || '' }}</h2>
        </div>
        <div style="display: flex; justify-content: space-between">
          <div>
            <div class="d-flex justify-content-start">
              <div style="margin-right: 0.8rem">
                <span style="font-size: 3rem" class="material-symbols-outlined">
                  account_circle
                </span>
              </div>
              <div>
                <p style="margin-top: 0.15rem; font-size: 1.3rem; font-weight: 700">
                  {{ store.state.detail.writer_name ?? store.state.detail?.writer ?? '' }}
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
          <div class="img-container">
            <div class="attachment-wrapper" v-for="item in filePreviewItems" :key="item.id">
              <template v-if="item.type === 'image'">
                <a :href="item.url" data-fancybox>
                  <img
                    :src="item.url"
                    :alt="item.name"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    width="300"
                    height="200"
                  />
                </a>
                <button type="button" class="download-link" @click="handleDownload(item)">
                  <span class="material-symbols-outlined">download</span>
                  <span>{{ $t('button.download') }}</span>
                </button>
              </template>
              <div v-else class="file-chip-group">
                <a class="file-chip" :href="item.url" target="_blank" rel="noopener">
                  <span class="material-symbols-outlined file-chip__icon">picture_as_pdf</span>
                  <span class="file-chip__name">{{ item.name }}</span>
                </a>
                <button
                  type="button"
                  class="download-link download-link--chip"
                  @click="handleDownload(item)"
                >
                  <span class="material-symbols-outlined">download</span>
                  <span>{{ $t('button.download') }}</span>
                </button>
              </div>
            </div>
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
        <CommentComponent v-if="isLogin" @commentCount="handleCommentCount"></CommentComponent>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import Swal from 'sweetalert2'
import CommentComponent from '@/components/common/CommentComponent.vue'
import { formatDate } from '@/utils/dateFormat'
import { useI18n } from 'vue-i18n'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

const staticPath = `${import.meta.env.VITE_API_URL}uploads`

const route = useRoute()
const router = useRouter()
const store = useStore()
const commentCount = ref(0)
const { t } = useI18n()
const filePreviewItems = computed(() => {
  return (store.state.detail.files ?? []).map((file, index) => {
    const normalizedExtension = (file?.extension || '').toString().replace('.', '').toLowerCase()
    const isPdf = normalizedExtension === 'pdf'
    const url = `${staticPath}/${file?.filename}`

    return {
      id: `${file?.filename}-${index}`,
      type: isPdf ? 'pdf' : 'image',
      url,
      name: file?.filename,
      originalName: file?.originalName
    }
  })
})

const sanitizedContent = computed(() => sanitizeHtml(store.state.detail.content || ''))

const downloadFile = async (url, filename) => {
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

const handleDownload = (item) => {
  downloadFile(item.url, item.originalName || item.name)
}

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
  if (route.params.name === 'withDiary') {
    router.push({
      name: route.params.name,
      query: { roomId: route.query.roomId, pageNum: route.query.pageNum }
    })
  } else {
    router.push({ name: route.params.name, query: { pageNum: route.query.pageNum } })
  }
}

const goToEditPage = () => {
  router.push({
    name: 'photo_edit',
    query: { name: route.params.name, id: store.state.detail.id, roomId: route.query.roomId }
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
      const result = await store.dispatch('DELETE_PHOTO_BOARD', {
        name: route.params.name,
        id: store.state.detail.id,
        deleteKeyList: store.state.detail.files
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

const isWriter = computed(() => {
  const localUser = JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user

  if (!localUser) return false

  return localUser.username === store.state.detail.writer || localUser.role === 'ADMIN'
})
const isLogin = computed(() => {
  return JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user ? true : false
})

onMounted(() => {
  Fancybox.bind('[data-fancybox]', {
    Thumbs: {
      autoStart: true // 썸네일 자동 시작
    },
    Image: {
      zoom: true, // 이미지 확대 가능
      click: 'toggleZoom', // 이미지를 클릭하면 확대/축소
      wheel: 'zoom' // 마우스 휠로 확대/축소
    },
    SlideShow: {
      autoStart: false, // 자동 슬라이드쇼 시작 여부
      speed: 3000 // 슬라이드쇼 속도
    },
    Carousel: {
      infinite: false
    }
  })
})
</script>

<style scoped>
section {
  overflow-x: hidden;
}
.container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 5rem;
}
.detail-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 7rem;
  width: 100%;
  height: 100%;
  padding: 3rem;
  background-color: #fff;
  border-radius: 1.5rem;
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
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}
.attachment-wrapper {
  margin: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.file-chip {
  width: 300px;
  min-height: 200px;
  border: 1px dashed #c0c4d5;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  color: #344767;
  background-color: #f8f9fc;
  text-decoration: none;
}
.file-chip-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
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
  margin-top: 0.5rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  color: #344767;
  border: 1px solid rgba(52, 71, 103, 0.2);
  background-color: rgba(248, 249, 252, 0.9);
  text-decoration: none;
  cursor: pointer;
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
}

.btn-style {
  width: 110px;
  height: 100%;
}

@media (max-width: 425px) {
  .detail-card {
    padding: 1.5rem;
  }
  .btn-style {
    font-size: 0.48rem;
  }
}
</style>
