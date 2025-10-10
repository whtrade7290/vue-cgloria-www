<template>
  <div style="display: flex; justify-content: center; background-color: #e9ecef">
    <div
      style="
        margin-top: 7rem;
        margin-bottom: 5rem;
        width: 50%;
        background-color: #fff;
        border-radius: 1.5rem;
      "
    >
      <div
        class="card-header bg-gradient-primary p-5 position-relative"
        style="border-radius: 1rem"
      >
        <h3 class="text-white mb-0">사진 글 수정</h3>
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
          <div class="image-container" v-else>
            <div
              class="image-wrapper"
              v-for="(item, index) in store.state.detail.files"
              :key="index"
            >
              <img
                :src="`${staticPath}uploads/${item?.filename}`"
                :alt="'Image ' + (index + 1)"
                width="200"
                class="image"
              />
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
        <div style="margin-top: 1rem; margin-left;: 2.5rem; display: flex; justify-content: end;">
          <a
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            href="javascript:;"
            @click="edit"
            >글수정</a
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
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { VALIDATION_TITLE, VALIDATION_CONTENT, VALIDATION_FILES } from '@/utils/validation'

const staticPath = `${import.meta.env.VITE_API_URL}`
const store = useStore()
const editor = ClassicEditor
const editorData = ref('')
editorData.value = store.state.detail.content
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
inputTitle.value = store.state.detail.title

const route = useRoute()
const router = useRouter()
const files = ref([])
const imageData = ref([])

const edit = async () => {
  if (VALIDATION_TITLE(inputTitle.value)) return
  if (VALIDATION_CONTENT(editorData.value)) return
  // if (VALIDATION_FILES(files.value)) return

  let formData = new FormData()

  formData.append('title', inputTitle.value)
  formData.append('content', editorData.value)
  formData.append('id', route.query.id)

  if (files.value.length > 0) {
    const deleteKeyList = store.state.detail.files.map((file) => file.filename)

    if (deleteKeyList.length > 0) {
      const jsonDeleteKeys = JSON.stringify(deleteKeyList)
      formData.append('jsonDeleteKeys', jsonDeleteKeys)
    }
  }

  files.value.forEach((file) => {
    formData.append('fileField', file)
  })

  const result = await store.dispatch('EDIT_PHOTO_BOARD', {
    formData: formData,
    name: route.query.name
  })

  if (result) {
    router.push(`/${route.query.name}`)
  }
}

const backPage = () => {
  router.back()
}

const changeImage = (event) => {
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
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤바 표시 */
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  height: 80%;
  width: 80%;
}

.image-wrapper {
  flex: 1 0 21%; /* 각 이미지의 크기를 설정 (여기서는 21%로 설정) */
  margin: 5px;
  box-sizing: border-box;
  padding: 1rem;
}
.image {
  width: 100%;
  height: auto;
  display: block;
}
</style>
