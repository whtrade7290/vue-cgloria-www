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
        <h3 class="text-white mb-0">{{ $t('photoPage.editHeader') }}</h3>
        <p class="text-white opacity-8 mb-4">{{ $t('photoPage.editDescription') }}</p>
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
          <div class="image-container" v-if="displayImagePreviews.length !== 0">
            <div class="image-wrapper" v-for="item in displayImagePreviews" :key="item.id">
              <button
                type="button"
                class="remove-btn"
                :aria-label="$t('photoPage.removeFile')"
                @click="removeSelectedFile(item)"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
              <img :src="item.src" :alt="item.name" width="200" class="image" />
            </div>
          </div>
        </div>
        <div class="file-chip-list" v-if="displayPdfPreviews.length !== 0">
          <div class="file-chip" v-for="item in displayPdfPreviews" :key="item.id">
            <button
              type="button"
              class="remove-btn remove-btn--chip"
              :aria-label="$t('photoPage.removeFile')"
              @click="removeSelectedFile(item)"
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
            @click="edit"
            >{{ $t('button.edit') }}</a
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
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { VALIDATION_TITLE, VALIDATION_CONTENT, VALIDATION_FILES } from '@/utils/validation'
import { useI18n } from 'vue-i18n'

const staticPath = `${import.meta.env.VITE_API_URL}`
const store = useStore()
const editor = ClassicEditor
const editorData = ref('')
editorData.value = store.state.detail.content
const { t } = useI18n()
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
inputTitle.value = store.state.detail.title

const isMainContent = ref(false)
isMainContent.value = store.state.detail.mainContent

const route = useRoute()
const router = useRouter()
const files = ref([])
const previewItems = ref([])
const removedExistingFilenames = ref([])

const newImagePreviewItems = computed(() =>
  previewItems.value.filter((item) => item.type === 'image')
)
const newPdfPreviewItems = computed(() => previewItems.value.filter((item) => item.type === 'pdf'))

const filteredExistingFiles = computed(() =>
  (store.state.detail.files ?? []).filter(
    (file) => !removedExistingFilenames.value.includes(file.filename)
  )
)

const existingImagePreviews = computed(() =>
  filteredExistingFiles.value
    .filter((file) => (file.extension || '').replace('.', '').toLowerCase() !== 'pdf')
    .map((file) => ({
      id: file.filename,
      name: file.filename,
      src: `${staticPath}uploads/${file?.filename}`,
      type: 'image',
      origin: 'existing',
      filename: file.filename
    }))
)

const existingPdfPreviews = computed(() =>
  filteredExistingFiles.value
    .filter((file) => (file.extension || '').replace('.', '').toLowerCase() === 'pdf')
    .map((file) => ({
      id: file.filename,
      name: file.filename,
      type: 'pdf',
      origin: 'existing',
      filename: file.filename
    }))
)

const displayImagePreviews = computed(() => [
  ...existingImagePreviews.value,
  ...newImagePreviewItems.value
])
const displayPdfPreviews = computed(() => [
  ...existingPdfPreviews.value,
  ...newPdfPreviewItems.value
])

const removeSelectedFile = (item) => {
  if (item.origin === 'existing') {
    if (!removedExistingFilenames.value.includes(item.filename)) {
      removedExistingFilenames.value.push(item.filename)
    }
  } else {
    previewItems.value = previewItems.value.filter((preview) => preview.id !== item.id)
    files.value = files.value.filter(
      (file) => `${file.name}-${file.lastModified}` !== item.id
    )

    if (files.value.length === 0) {
      previewItems.value = []
    }
  }

  const input = document.getElementById('fileUpload')
  if (input) {
    input.value = ''
  }
}

const edit = async () => {
  if (VALIDATION_TITLE(inputTitle.value)) return
  if (VALIDATION_CONTENT(editorData.value)) return
  // if (VALIDATION_FILES(files.value)) return

  let formData = new FormData()

  formData.append('title', inputTitle.value)
  const pureText = stripHtml(editorData.value)
  formData.append('content', pureText)
  formData.append('id', route.query.id)
  formData.append('mainContent', isMainContent.value)

  if (removedExistingFilenames.value.length > 0) {
    const jsonDeleteKeys = JSON.stringify(removedExistingFilenames.value)
    formData.append('jsonDeleteKeys', jsonDeleteKeys)
  }

  formData.append('board', route.query.name)

  files.value.forEach((file) => {
    formData.append('fileField', file)
  })

  const result = await store.dispatch('EDIT_PHOTO_BOARD', {
    formData: formData,
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
}

const backPage = () => {
  router.back()
}

const changeImage = (event) => {
  const newFiles = Array.from(event.target.files)

  if (VALIDATION_FILES(files.value, newFiles)) {
    const filteredFiles = newFiles.filter(
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
            name: file.name,
            origin: 'new'
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
              name: file.name,
              origin: 'new'
            })
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }
}
const isDisplay = computed(() => {
  const routeNames = ['sermon', 'column', 'weekly_bible_verse', 'class_meeting', 'testimony']
  return routeNames.some((name) => {
    return route.query?.name === name
  })
})
const stripHtml = (html) => {
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
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
  position: relative;
}
.image {
  width: 100%;
  height: 160px;
  display: block;
  border-radius: 0.5rem;
  object-fit: cover;
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
</style>
