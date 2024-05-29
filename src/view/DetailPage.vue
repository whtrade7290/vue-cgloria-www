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
              {{ formatDate(store.state.detail.date) }}
            </p>
          </div>
        </div>
        <div class="content-box" v-html="store.state.detail.content"></div>
        <div class="button-box">
          <a
            href="javascript:;"
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            @click="goToBoardList"
            >목록으로</a
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일  ${date.getHours()}:${date.getMinutes()}`
}

function goToBoardList() {
  router.back()
}
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
  margin-top: 3rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem 0 1.5rem;
}
.button-box {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}
</style>
