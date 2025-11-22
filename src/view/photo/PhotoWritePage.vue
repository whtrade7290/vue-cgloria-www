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
        <h3 class="text-white mb-0">글 작성 (파일 첨부)</h3>
        <p class="text-white opacity-8 mb-4">중앙 영광교회 교회 역사와 형제교회 소개</p>
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
        <label for="title">제목</label><br />
        <input
          type="text"
          id="title"
          class="input-title"
          placeholder=" 제목을 입력하세요."
          v-model="inputTitle"
        /><br />
        <label for="image">이미지 첨부</label><br />
        <div style="width: 100%; display: flex; justify-content: center">
          <div class="image-container" v-if="files.length !== 0">
            <div class="image-wrapper" v-for="(img, index) in imageData" :key="index">
              <img :src="img" :alt="'Image ' + (index + 1)" width="200" class="image" />
            </div>
          </div>
        </div>
        <label for="fileUpload" class="btn btn-sm btn-outline-primary mb-0 me-1 mt-2 mt-md-0"
          >파일 업로드</label
        >
        <input
          type="file"
          id="fileUpload"
          @change="changeImage"
          class="hidden-file-input"
          multiple
        /><br />
        <label for="content">내용</label><br />
        <ckeditor
          id="content"
          class="ck_contents"
          :editor="editor"
          v-model="editorData"
          :config="editorConfig"
        ></ckeditor>
        <div style="margin-top: 1rem; margin-left: 2.5rem; display: flex; justify-content: end">
          <a
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            href="javascript:;"
            @click="write"
            >글작성</a
          >
          <a
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            href="javascript:;"
            @click="backPage"
            >목록으로</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { VALIDATION_TITLE, VALIDATION_CONTENT, VALIDATION_FILES } from '@/utils/validation'

const store = useStore()
const route = useRoute()
const router = useRouter()

const editor = ClassicEditor
const editorData = ref('')
const editorConfig = {
  placeholder: '글 내용을 입력하세요.',
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
const imageData = ref([])

async function write() {
  const formData = new FormData()

  if (VALIDATION_TITLE(inputTitle.value)) return
  if (VALIDATION_CONTENT(editorData.value)) return

  formData.append('title', inputTitle.value)
  formData.append('content', editorData.value)
  formData.append('writer', JSON.parse(localStorage.getItem(getUserIdFromCookie())).user.username)
  formData.append('writer_name', JSON.parse(localStorage.getItem(getUserIdFromCookie())).user.name)
  formData.append('board', route.query.name)

  files.value.forEach((file) => {
    formData.append('fileField', file)
  })

  const result = await store.dispatch('WRITE_BOARD', {
    formData,
    name: route.query.name
  })
  if (result) {
    router.push(`/${route.query.name}`)
  }
}

function backPage() {
  router.back()
}

function changeImage(event) {
  const newFiles = Array.from(event.target.files)

  if (VALIDATION_FILES(files.value, newFiles)) {
    files.value = files.value.concat(
      newFiles.filter(
        (newFile) => !files.value.some((existingFile) => existingFile.name === newFile.name)
      )
    )

    if (files.value.length > 0) {
      files.value.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (!imageData.value.includes(e.target.result)) {
            imageData.value.push(e.target.result)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 1rem;
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
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  height: 80%;
  width: 80%;
}
.image-wrapper {
  flex: 1 0 21%;
  margin: 5px;
  box-sizing: border-box;
}
.image {
  width: 100%;
  height: auto;
  display: block;
}
.hidden-file-input {
  display: none; /* 파일 입력창 완전히 숨기기 */
}

.custom-upload-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4caf50; /* 버튼 배경색 */
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
}

/* 커스텀 버튼에 호버 효과 추가 */
.custom-upload-button:hover {
  background-color: #45a049;
}
</style>
