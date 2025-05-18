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
                <p style="margin-top: 0.15rem; font-size: 1.7rem; font-weight: 700">
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
            <div v-for="item in store.state.detail.files" :key="item" style="margin: 1rem">
              <a
                :href="`${staticPath}uploads/${item?.filename}`"
                data-fancybox
                :data-caption="item.filename"
              >
                <img :src="`${staticPath}uploads/${item?.filename}`" alt="img" />
              </a>
            </div>
          </div>
          <div class="content-container" v-html="store.state.detail.content"></div>
        </div>
        <div class="button-box">
          <a
            href="javascript:;"
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            @click="goToBoardList"
            >목록으로</a
          >
          <a
            href="javascript:;"
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            v-show="isWriter"
            @click="goToEditPage"
            >글수정</a
          >
          <a
            href="javascript:;"
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            v-show="isWriter"
            @click="deleteBoard"
            >글삭제</a
          >
        </div>
      </div>
    </div>
    <CommentComponent @commentCount="handleCommentCount"></CommentComponent>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import Swal from 'sweetalert2'
import CommentComponent from '@/components/common/CommentComponent.vue'
const staticPath = `${import.meta.env.VITE_API_URL}`
const route = useRoute()
const router = useRouter()
const store = useStore()
const commentCount = ref(0)

const handleCommentCount = (count) => {
  commentCount.value = count
}
const contentCopy = async () => {
  const content = store.state.detail.content
  navigator.clipboard.writeText(stripHtmlTags(content))

  await Swal.fire({
    title: '복사되었습니다.',
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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}. ${month}. ${day}. `
}
function goToBoardList() {
  router.push({ name: route.params.name, query: { pageNum: route.query.pageNum } })
}

const goToEditPage = () => {
  router.push({
    name: 'photo_edit',
    query: { name: route.params.name, id: store.state.detail.id }
  })
}

const deleteBoard = () => {
  Swal.fire({
    title: '정말 삭제하시겠습니까?',
    text: '이 글을 다시 볼 수 없게 됩니다.',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: '아니오',
    confirmButtonText: '네'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const result = await store.dispatch('DELETE_PHOTO_BOARD', {
        name: route.params.name,
        id: store.state.detail.id,
        deleteKeyList: store.state.detail.files
      })
      if (result) {
        Swal.fire({
          title: '삭제되었습니다!',
          icon: 'success'
        }).then(() => {
          router.go(-1)
        })
      }
    }
  })
}

const isWriter = computed(() => {
  return (
    JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user?.username ===
    store.state.detail.writer
  )
})

const imageUrl = ref(null)

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

    // 기타 옵션 추가 가능
  })

  if (store.state.files) {
    imageUrl.value = `${staticPath}uploads/${item?.filename}`
  }
})
</script>

<style scoped>
.container {
  width: 90%;
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  margin-bottom: 5rem;
}
.detail-card {
  margin-top: 7rem;
  width: 70%;
  height: 80%;
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

  display: flex;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}
.content-container {
  margin-top: 2rem;
}
</style>
