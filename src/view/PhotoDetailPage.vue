<template>
  <section>
    <div class="container">
      <div class="detail-card">
        <div>
          <h2>{{ store.state.detail.title }}</h2>
        </div>
        <div style="display: flex; justify-content: space-between">
          <div class="user-info">
            <div style="margin-right: 0.8rem">
              <span style="font-size: 3rem" class="material-symbols-outlined">
                account_circle
              </span>
            </div>
            <div>
              <p style="margin-top: 0.15rem; font-size: 1.7rem; font-weight: 700">
                {{ store.state.detail.writer }}
              </p>
            </div>
          </div>
          <div>
            <p style="margin-top: 0.2rem; font-size: 1rem; font-weight: 500">
              {{ formatDate(store.state.detail.create_at) }}
            </p>
          </div>
        </div>
        <div class="content-box">
          <div class="img-container">
            <div v-for="item in store.state.detail.files" :key="item" style="margin: 1rem">
              <a :href="item.fileUrl" data-fancybox :data-caption="item.filename">
                <img :src="item.fileUrl" alt="img" />
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
            >글수정</a
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const route = useRoute()
const router = useRouter()
const store = useStore()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일  ${date.getHours()}:${date.getMinutes()}`
}
function goToBoardList() {
  router.push({ name: route.params.name, query: { pageNum: route.query.pageNum } })
}

const isWriter = computed(() => {
  return JSON.parse(sessionStorage.getItem(1))?.username ?? '' === store.state.detail.writer
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
    }
    // 기타 옵션 추가 가능
  })
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
