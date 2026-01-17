<template>
  <div class="page-wrapper">
    <LoadingSpinner v-if="isSubmitting" />
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
        <h3 class="text-white mb-0">{{ $t('photoPage.writeHeader') }}</h3>
        <p class="text-white opacity-8 mb-4">{{ $t('photoPage.writeDescription') }}</p>
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
        <label for="title">{{ $t('writePage.title') }}</label><br />
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
        <label for="image">{{ $t('writePage.addImage') }}</label><br />
        <div style="width: 100%; display: flex; justify-content: center">
          <div class="image-container" v-if="imagePreviewItems.length !== 0">
            <div class="image-wrapper" v-for="item in imagePreviewItems" :key="item.id">
              <button
                type="button"
                class="remove-btn"
                :aria-label="$t('photoPage.removeFile')"
                @click="removeSelectedFile(item.id)"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
              <img :src="item.src" :alt="item.name" width="200" class="image" />
            </div>
          </div>
        </div>
        <div class="file-chip-list" v-if="pdfPreviewItems.length !== 0">
          <div class="file-chip" v-for="item in pdfPreviewItems" :key="item.id">
            <button
              type="button"
              class="remove-btn remove-btn--chip"
              :aria-label="$t('photoPage.removeFile')"
              @click="removeSelectedFile(item.id)"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
            <span class="material-symbols-outlined file-chip__icon">picture_as_pdf</span>
            <span class="file-chip__name">{{ item.name }}</span>
          </div>
        </div>
        <label for="fileUpload" class="btn btn-sm btn-outline-primary mb-0 me-1 mt-2 mt-md-0"
          >{{ $t('photoPage.uploadButton') }}</label
        >
        <input
          type="file"
          id="fileUpload"
          @change="changeImage"
          class="hidden-file-input"
          multiple
        /><br />
        <label for="content">{{ $t('writePage.content') }}</label><br />
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { VALIDATION_TITLE, VALIDATION_CONTENT, VALIDATION_FILES } from '@/utils/validation'
import { useI18n } from 'vue-i18n'
import { compressImageFiles } from '@/utils/imageCompression'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()
const isMainContent = ref(false)
const { t } = useI18n()

const editor = ClassicEditor
const editorData = ref('')
const editorConfig = {
  placeholder: t('writePage.placeholder.content'),
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
const previewItems = ref([])
const isSubmitting = ref(false)
const imagePreviewItems = computed(() =>
  previewItems.value.filter((item) => item.type === 'image')
)
const pdfPreviewItems = computed(() => previewItems.value.filter((item) => item.type === 'pdf'))

const removeSelectedFile = (previewId) => {
  previewItems.value = previewItems.value.filter((item) => item.id !== previewId)
  files.value = files.value.filter((file) => `${file.name}-${file.lastModified}` !== previewId)
  const input = document.getElementById('fileUpload')
  if (input) {
    input.value = ''
  }
}

async function write() {
  if (VALIDATION_TITLE(inputTitle.value)) return
  if (VALIDATION_CONTENT(editorData.value)) return

  const formData = new FormData()
  formData.append('title', inputTitle.value)
  formData.append('content', sanitizeHtml(editorData.value))
  formData.append('writer', JSON.parse(localStorage.getItem(getUserIdFromCookie())).user.username)
  formData.append('writer_name', JSON.parse(localStorage.getItem(getUserIdFromCookie())).user.name)
  formData.append('board', route.query.name)
  formData.append('mainContent', isMainContent.value)

  if (route.query?.name === 'withDiary') {
    formData.append('diaryRoomId', route.query.roomId)
  }

  files.value.forEach((file) => {
    formData.append('fileField', file)
  })

  try {
    isSubmitting.value = true
    const result = await store.dispatch('WRITE_BOARD', {
      formData,
      name: route.query.name
    })
    if (result) {
      if (route.query?.name === 'withDiary') {
        router.push({
          name: `${route.query.name}`,
          query: { roomId: route.query.roomId, pageNum: 1 }
        })
      } else {
        router.push(`/${route.query.name}`)
      }
    }
  } finally {
    isSubmitting.value = false
  }
}

function backPage() {
  router.back()
}

const changeImage = async (event) => {
  try {
    const selectedFiles = event.target?.files

    if (!selectedFiles || selectedFiles.length === 0) {
      return
    }

    const processedFiles = await compressImageFiles(selectedFiles)

    if (VALIDATION_FILES(files.value, processedFiles)) {
      const filteredFiles = processedFiles.filter(
        (newFile) => !files.value.some((existingFile) => existingFile.name === newFile.name)
      )
      files.value = files.value.concat(filteredFiles)

      filteredFiles.forEach((file) => {
        const fileId = `${file.name}-${file.lastModified}`
        if (file.type === 'application/pdf') {
          if (!previewItems.value.some((item) => item.id === fileId)) {
            previewItems.value.push({
              id: fileId,
              type: 'pdf',
              name: file.name
            })
          }
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            const src = e.target?.result
            if (!previewItems.value.some((item) => item.id === fileId)) {
              previewItems.value.push({
                id: fileId,
                type: 'image',
                src,
                name: file.name
              })
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  } catch (error) {
    console.error('Failed to process selected images', error)
  }
}
const isDisplay = computed(() => {
  const routeNames = ['sermon', 'column', 'weekly_bible_verse', 'class_meeting', 'testimony']
  return routeNames.some((name) => {
    return route.query?.name === name
  })
})

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
  position: relative;
}
.image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
  border-radius: 0.5rem;
}
.file-chip-list {
  width: 80%;
  margin: 1rem auto 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.file-chip {
  width: 220px;
  min-height: 110px;
  border: 1px dashed #c0c4d5;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  text-align: center;
  color: #344767;
  background-color: #f8f9fc;
  position: relative;
}
.file-chip__icon {
  font-size: 2rem;
  margin-bottom: 0.35rem;
  color: #f5365c;
}
.file-chip__name {
  font-size: 0.85rem;
  word-break: break-all;
}
.remove-btn {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  z-index: 2;
}
.remove-btn span {
  font-size: 1rem;
}
.remove-btn--chip {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  background: transparent;
  color: #8392ab;
  z-index: 2;
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
