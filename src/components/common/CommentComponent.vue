<template>
  <section>
    <div class="comment-container">
      <div class="comment-box">
        <div>
          <div class="comment-info-box">
            {{ $t('comments.header', { count: commentList.length }) }}
          </div>
          <div class="comment-text-container">
            <div class="comment-textarea-box">
              <div class="mt-2 d-flex justify-content-start">
                <!-- <span style="font-size: 2.7rem" class="material-symbols-outlined">
                  account_circle
                </span> -->
                <div>
                  <div style="margin-top: 0.3rem; margin-left: 0.5rem; font-size: 1.3rem">
                    {{ getUserNameFromSession }}
                  </div>
                </div>
              </div>
              <div class="form-group mt-3">
                <textarea
                  class="form-control"
                  v-model="inputComment"
                  rows="5"
                  :placeholder="$t('comments.placeholder')"
                ></textarea>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-sm bg-gradient-primary btn-round" @click="writeComment">
                  {{ $t('comments.submit') }}
                </button>
              </div>
            </div>
          </div>

          <div class="border-line" v-for="item in commentList" :key="item.id">
            <div class="mt-2 d-flex justify-content-between align-items-start">
              <div class="d-flex justify-content-start">
                <span style="font-size: 3rem" class="material-symbols-outlined">
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
              <div class="comment-actions" v-if="canEditComment(item) || canDeleteComment(item)">
                <span
                  v-if="canEditComment(item)"
                  class="material-symbols-outlined edit-icon"
                  @click.stop="startEditComment(item)"
                >
                  edit
                </span>
                <span
                  v-if="canDeleteComment(item)"
                  class="material-symbols-outlined delete-icon"
                  @click.stop="confirmDeleteComment(item)"
                >
                  delete
                </span>
              </div>
            </div>
            <div class="comment-display-box" v-if="editingCommentId !== item.id">
              {{ item.content }}
            </div>
            <div v-else class="comment-edit-box">
              <textarea v-model="editingContent" class="form-control" rows="3"></textarea>
              <div class="d-flex justify-content-end mt-2">
                <button class="btn btn-sm btn-outline-secondary me-2" @click="cancelEdit">
                  {{ $t('button.cancel') }}
                </button>
                <button class="btn btn-sm bg-gradient-primary" @click="confirmUpdateComment(item)">
                  {{ $t('button.confirm') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { formatDate } from '@/utils/dateFormat'
import { VALIDATION_CONTENT } from '@/utils/validation'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const route = useRoute()
const store = useStore()
const inputComment = ref('')
const emit = defineEmits(['commentCount'])

const getUserNameFromSession = computed(() => {
  const curruntId = JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user?.username
  const curruntName = JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user?.name
  return curruntName !== '' ? curruntName : curruntId
})
const currentUser = computed(() => JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user)
const { t } = useI18n()

const writeComment = async () => {
  const user = JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user
  if (!user) {
    Swal.fire({
      title: t('comments.loginRequired'),
      icon: 'warning'
    })
    return false
  }

  if (VALIDATION_CONTENT(inputComment.value)) return

  const result = await store.dispatch('WRITE_COMMENT', {
    boardId: store.state.detail.id,
    boardName: route.params.name,
    comment: inputComment.value,
    writerName: user.name,
    writer: user.username
  })

  if (result) {
    const updatedComments = await store.dispatch('FETCH_COMMENT', {
      boardId: store.state.detail.id,
      boardName: route.params.name
    })

    commentList.value = updatedComments.data

    inputComment.value = ''

    emit('commentCount', commentList.value.length)
  }
}

const commentList = ref([])
const editingCommentId = ref(null)
const editingContent = ref('')

onMounted(async () => {
  await refreshComments()
})

const refreshComments = async () => {
  const result = await store.dispatch('FETCH_COMMENT', {
    boardId: store.state.detail.id,
    boardName: route.params.name
  })
  emit('commentCount', result.data.length)
  commentList.value = result.data
}

const canEditComment = (comment) => {
  const user = currentUser.value
  if (!user) return false
  if (user.role === 'ADMIN') return true
  return user.username === comment.writer
}

const startEditComment = (comment) => {
  editingCommentId.value = comment.id
  editingContent.value = comment.content
}

const cancelEdit = () => {
  editingCommentId.value = null
  editingContent.value = ''
}

const confirmUpdateComment = async (comment) => {
  if (!editingContent.value || editingContent.value.trim().length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: t('comments.editEmpty')
    })
    return
  }

  const result = await Swal.fire({
    icon: 'question',
    title: t('comments.editConfirm'),
    showCancelButton: true,
    confirmButtonText: t('button.confirm'),
    cancelButtonText: t('button.cancel')
  })

  if (!result.isConfirmed) return

  try {
    await store.dispatch('UPDATE_COMMENT', {
      commentId: comment.id,
      boardId: store.state.detail.id,
      boardName: route.params.name,
      comment: editingContent.value
    })
    await Swal.fire({
      icon: 'success',
      title: t('comments.editSuccess')
    })
    cancelEdit()
    await refreshComments()
  } catch (error) {
    console.error('Failed to update comment', error)
    await Swal.fire({
      icon: 'error',
      title: t('comments.editFail')
    })
  }
}

const canDeleteComment = (comment) => {
  const user = currentUser.value
  if (!user) return false
  if (user.role === 'ADMIN') return true
  return user.username === comment.writer
}

const confirmDeleteComment = async (comment) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: t('comments.deleteConfirm'),
    showCancelButton: true,
    confirmButtonText: t('button.confirm'),
    cancelButtonText: t('button.cancel')
  })

  if (!result.isConfirmed) return

  try {
    await store.dispatch('DELETE_COMMENT', {
      commentId: comment.id,
      boardId: store.state.detail.id,
      boardName: route.params.name
    })
    await Swal.fire({
      icon: 'success',
      title: t('comments.deleteSuccess')
    })
    await refreshComments()
  } catch (error) {
    console.error('Failed to delete comment', error)
    await Swal.fire({
      icon: 'error',
      title: t('comments.deleteFail')
    })
  }
}
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
  margin: 2rem 0 0 2.5rem;
  overflow-y: scroll;
}
.comment-container {
  width: 100%;
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
}
.comment-info-box {
  width: 55rem;
  height: 2.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  /* background-color: yellow; */
}
section {
  width: 100%;
}

.comment-box {
  width: 100%;
}

.comment-box > div {
  width: 100%;
}
.delete-icon,
.edit-icon {
  font-size: 1.5rem;
  cursor: pointer;
  color: #111827;
}
.edit-icon {
  margin-right: 0.5rem;
}
.delete-icon:hover,
.edit-icon:hover {
  color: #374151;
}
.comment-edit-box textarea {
  resize: vertical;
}
</style>
