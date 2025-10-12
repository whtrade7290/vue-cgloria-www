<template>
  <div class="container" style="display: flex; justify-content: center">
    <div
      style="
        margin-top: 7rem;
        margin-bottom: 5rem;
        width: 100%;
        background-color: #fff;
        border-radius: 1.5rem;
      "
    >
      <div
        class="card-header bg-gradient-primary p-5 position-relative"
        style="border-radius: 1rem"
      >
        <h3 class="text-white mb-0">{{ $t('writePage.mainTitle') }}</h3>
        <p class="text-white opacity-8 mb-4">{{ $t('discriptions.intro') }}</p>
        <div class="position-absolute w-100 z-index-1 bottom-0 ms-n5">
          <svg
            class="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 40"
            preserveAspectRatio="none"
            shape-rendering="auto"
            style="height: 7vh; min-height: 50px"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              ></path>
            </defs>
            <g class="moving-waves">
              <use xlink:href="#gentle-wave" x="48" y="-1" fill="rgba(255,255,255,0.40"></use>
              <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.35)"></use>
              <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.25)"></use>
              <use xlink:href="#gentle-wave" x="48" y="8" fill="rgba(255,255,255,0.20)"></use>
              <use xlink:href="#gentle-wave" x="48" y="13" fill="rgba(255,255,255,0.15)"></use>
              <use xlink:href="#gentle-wave" x="48" y="16" fill="rgba(255,255,255,0.95"></use>
            </g>
          </svg>
        </div>
      </div>
      <div style="padding: 1.5rem">
        <label for="title">{{ $t('writePage.title') }}</label
        ><br />
        <input
          type="text"
          id="title"
          class="input-title"
          :placeholder="$t('writePage.placeholder.title')"
          v-model="inputTitle"
        /><br />
        <div v-if="isDisplay">
          <label for="mainContent" style="margin-right: 1rem; margin-top: 1rem">{{
            $t('writePage.mainContent')
          }}</label>
          <label class="toggle-switch">
            <input type="checkbox" id="mainContent" v-model="isMainContent" />
            <span class="slider"></span>
          </label>
        </div>
        <br />
        <label for="image" class="form-label mt-3">{{ $t('writePage.addImage') }}</label
        ><br />
        <div style="width: 100%; display: flex; justify-content: center">
          <div class="image-container" v-if="files.length !== 0">
            <img :src="imageData" alt="img" />
          </div>
        </div>
        <div class="mb-3">
          <input
            class="form-control"
            type="file"
            id="image"
            @change="changeImage"
            name="fileField"
          />
        </div>
        <label for="content">{{ $t('writePage.content') }}</label
        ><br />
        <ckeditor
          id="content"
          class="ck_contents"
          :editor="editor"
          v-model="editorData"
          :config="editorConfig"
        ></ckeditor>
        <div style="margin-top: 1rem; margin-left;: 2.5rem; display: flex; justify-content: end;">
          <a
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            href="javascript:;"
            @click="write"
            >{{ $t('button.write') }}</a
          >
          <a
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            href="javascript:;"
            @click="backPage"
            >{{ $t('button.toList') }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { VALIDATION_TITLE, VALIDATION_CONTENT } from '@/utils/validation'

const editor = ClassicEditor
const editorData = ref('')
const editorConfig = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    'insertTable',
    '|',
    'undo',
    'redo'
  ]
}

const inputTitle = ref('')
const files = ref([])
const imageData = ref(null)
const file = ref(null)
const isMainContent = ref(false)

const store = useStore()
const route = useRoute()
const router = useRouter()

const write = async () => {
  if (VALIDATION_TITLE(inputTitle.value)) return
  if (VALIDATION_CONTENT(editorData.value)) return
  let formData = new FormData()

  formData.append('title', inputTitle.value)
  formData.append('content', editorData.value)
  formData.append('mainContent', isMainContent.value)
  formData.append('fileField', file.value)

  const storedData = localStorage.getItem(getUserIdFromCookie())
  if (storedData) {
    const user = JSON.parse(storedData).user
    const username = user.username
    const name = user.name
    formData.append('writer', username)
    formData.append('writer_name', name)
  }

  if (route.query?.name === 'withDiary') {
    formData.append('diaryRoomId', store.state.room.id)
  }

  try {
    await store.dispatch('WRITE_BOARD', {
      formData: formData,
      name: route.query.name
    })
    router.push({ name: `${route.query.name}`, query: { roomId: store.state.room.id, pageNum: 1 } })
  } catch (error) {
    console.error('Error during WRITE_BOARD dispatch:', error)
  }
}

const backPage = () => {
  router.back()
}

const changeImage = (event) => {
  files.value = event.target?.files

  if (files.value.length > 0) {
    const selectedFile = files.value[0]

    const reader = new FileReader()
    file.value = files.value[0]

    reader.onload = (e) => {
      imageData.value = e.target.result
    }
    reader.readAsDataURL(selectedFile)
  }
}

const isDisplay = computed(() => {
  const routeNames = ['sermon', 'column', 'weeklyWord', 'classMeeting', 'testimony']
  return routeNames.some((name) => {
    return route.query?.name === name
  })
})
</script>

<style scoped>
.container {
  padding: 1.5rem;
}
.input-title {
  width: 100%;
  border: 1px solid #ccced1;
}
.input-title:focus {
  outline: 0.001rem solid #2977ff;
  box-shadow: inset 0 0 0.5px 0 #2977ff;
}
</style>

<style>
.ck-content {
  height: 300px;
  border-radius: 1.5rem;
}
.image-container {
  width: 22rem;
  height: 17rem;
  overflow: hidden;
  margin-top: 0.2rem;
  margin-bottom: 0.7rem;
  border-radius: 0.7rem;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율을 유지하면서 컨테이너에 맞게 조정 */
}

/* 전체 토글 스위치 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px; /* 너비 축소 */
  height: 28px; /* 높이 축소 */
}

/* 숨김 처리된 체크박스 */
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* 슬라이더 */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 28px; /* 높이에 맞춘 슬라이더 라운딩 */
}

/* 슬라이더 안의 원 */
.slider:before {
  position: absolute;
  content: '';
  height: 22px; /* 원의 크기 축소 */
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

/* 체크된 상태 */
input:checked + .slider {
  background-color: #4caf50;
}

/* 체크된 상태에서의 슬라이더 원 */
input:checked + .slider:before {
  transform: translateX(22px); /* 원이 이동할 거리 축소 */
}
</style>
