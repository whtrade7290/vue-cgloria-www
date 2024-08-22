<template>
  <section>
    <div class="comment-container">
      <div class="comment-box">
        <div>
          <div class="comment-info-box">댓글 {{ commentList.length }}</div>
          <div class="comment-text-container">
            <div class="comment-textarea-box">
              <div class="mt-2 d-flex justify-content-start">
                <span style="font-size: 2.7rem" class="material-symbols-outlined">
                  account_circle
                </span>
                <div>
                  <div style="margin-top: 0.3rem; margin-left: 0.5rem; font-size: 1.3rem">
                    {{ getUserNameFromSession }}
                  </div>
                </div>
              </div>
              <div class="form-group mt-3">
                <textarea class="form-control" v-model="inputComment" rows="5"></textarea>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-sm bg-gradient-primary btn-round" @click="writeComment">
                  작성
                </button>
              </div>
            </div>
          </div>

          <div class="border-line" v-for="item in commentList" :key="item">
            <div class="mt-2 d-flex justify-content-start">
              <span style="font-size: 4rem" class="material-symbols-outlined">
                account_circle
              </span>
              <div>
                <div style="margin-top: 0.3rem; margin-left: 0.5rem; font-size: 1.3rem">
                  {{ item.writer_name ?? item.writer }}
                </div>
                <div style="margin-top: 0.2rem; margin-left: 0.5rem; font-size: 0.8rem">
                  {{ formatDate(item.create_at) }}
                </div>
              </div>
            </div>
            <div class="comment-display-box">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const route = useRoute()
const store = useStore()
const inputComment = ref('')
const emit = defineEmits(['commentCount'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`
}

const getUserNameFromSession = computed(() => {
  const curruntId = JSON.parse(sessionStorage.getItem(getUserIdFromCookie()))?.user?.username
  const curruntName = JSON.parse(sessionStorage.getItem(getUserIdFromCookie()))?.user?.name
  return curruntName !== '' ? curruntName : curruntId
})

const writeComment = async () => {
  const user = JSON.parse(sessionStorage.getItem(getUserIdFromCookie()))?.user

  if (!user) {
    return false
  }

  // 댓글 작성 요청
  const result = await store.dispatch('WRITE_COMMENT', {
    boardId: store.state.detail.id,
    boardName: route.params.name,
    comment: inputComment.value,
    writerName: user.name,
    writer: user.username
  })

  if (result) {
    // 댓글이 성공적으로 작성되면 최신 댓글 목록을 다시 가져옴
    const updatedComments = await store.dispatch('FETCH_COMMENT', {
      boardId: store.state.detail.id,
      boardName: route.params.name
    })

    // 댓글 목록 갱신
    commentList.value = updatedComments.data

    inputComment.value = '' // 입력 필드 초기화
  }
}

const commentList = ref([])

onMounted(async () => {
  const result = await store.dispatch('FETCH_COMMENT', {
    boardId: store.state.detail.id,
    boardName: route.params.name
  })
  emit('commentCount', result.data.length)
  commentList.value = result.data
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
</style>
