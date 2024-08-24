<template>
  <section>
    <div class="container">
      <div class="detail-card">
        <div>
          <h2>{{ store.state.detail.title }}</h2>
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
                  {{ store.state.detail.writer_name ?? store.state.detail.writer }}
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
              {{ formatDate(store.state.detail.create_at) }}
            </p>
          </div>
        </div>
        <div class="content-box">
          <div
            v-show="
              store.state.detail.filename &&
              store.state.detail.fileDate &&
              store.state.detail.extension
            "
            class="img-container"
          >
            <img :src="imageUrl" alt="img" />
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
  </section>
  <CommentComponent @commentCount="handleCommentCount"></CommentComponent>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import Swal from 'sweetalert2'
import CommentComponent from '@/components/common/CommentComponent.vue'

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
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`
}

function goToBoardList() {
  router.push({ name: route.params.name, query: { pageNum: route.query.pageNum } })
}

const isWriter = computed(() => {
  return (
    JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user?.username ===
    store.state.detail.writer
  )
})

const goToEditPage = () => {
  router.push({
    name: 'edit',
    query: { name: route.params.name, id: store.state.detail.id }
  })
}

const deleteBoard = () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons
    .fire({
      title: '정말 삭제하시겠습니까?',
      text: '이 글을 다시 볼 수 없게 됩니다.',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: '아니오',
      confirmButtonText: '네'
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        const result = await store.dispatch('DELETE_BOARD', {
          name: route.params.name,
          id: store.state.detail.id
        })
        if (result) {
          swalWithBootstrapButtons
            .fire({
              title: '삭제되었습니다!',
              icon: 'success'
            })
            .then(() => {
              router.go(-1)
            })
        }
      }
    })
}

const imageUrl = ref(null)

onMounted(() => {
  // 컴포넌트가 마운트된 후에 이미지 URL을 설정
  if (store.state.detail.filename && store.state.detail.fileDate && store.state.detail.extension) {
    imageUrl.value = `http://localhost:3000/uploads/${store.state.detail.filename}_${store.state.detail.fileDate}${store.state.detail.extension}`
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
  border-radius: 1rem;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율을 유지하면서 컨테이너에 맞게 조정 */
}
.content-container {
  margin-top: 2rem;
}

p {
  word-wrap: break-word; /* 긴 단어를 자동으로 줄바꿈 */
  white-space: normal; /* 기본적인 줄바꿈 설정 */
}
</style>
