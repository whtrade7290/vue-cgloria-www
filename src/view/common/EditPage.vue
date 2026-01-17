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
        <h3 class="text-white mb-0">{{ $t('button.edit') }}</h3>
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
            <input
              type="checkbox"
              id="mainContent"
              v-model="isMainContent"
              v-bind:disabled="store.state.detail.mainContent"
            />
            <span class="slider"></span>
          </label>
        </div>
        <label for="image" class="form-label mt-3">{{ $t('writePage.addImage') }}</label><br />
        <div style="width: 100%; display: flex; justify-content: center">
          <div class="image-container" v-if="previewItem">
            <button
              type="button"
              class="remove-btn"
              :aria-label="$t('photoPage.removeFile')"
              @click="removeSelectedFile"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
            <img
              v-if="previewItem.type === 'image'"
              :src="previewItem.src"
              :alt="previewItem.name"
            />
            <div v-else class="file-chip">
              <button
                type="button"
                class="remove-btn remove-btn--chip"
                :aria-label="$t('photoPage.removeFile')"
                @click="removeSelectedFile"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
              <span class="material-symbols-outlined file-chip__icon">picture_as_pdf</span>
              <span class="file-chip__name">{{ previewItem.name }}</span>
            </div>
          </div>
          <div class="image-container" v-else-if="existingPreview">
            <img
              v-if="existingPreview.type === 'image'"
              :src="existingPreview.src"
              :alt="existingPreview.name"
            />
            <div v-else class="file-chip">
              <span class="material-symbols-outlined file-chip__icon">picture_as_pdf</span>
              <span class="file-chip__name">{{ existingPreview.name }}</span>
            </div>
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
            >{{ $t('button.cancel') }}</a
          >
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { VALIDATION_TITLE, VALIDATION_CONTENT } from '@/utils/validation'
import { useI18n } from 'vue-i18n'
import { compressImageFiles } from '@/utils/imageCompression'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// 상태 선언
const store = useStore()
const route = useRoute()
const router = useRouter()
const editor = ref(ClassicEditor)
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
const files = ref([])
const previewItem = ref(null)
const file = ref(null)
const isMainContent = ref(store.state.detail.mainContent)
const isSubmitting = ref(false)

const isDisplay = computed(() => {
  const routeNames = ['sermon', 'column', 'weekly_bible_verse', 'classMeeting', 'testimony']
  return routeNames.some((name) => {
    return route.query?.name === name
  })
})

// 메서드 선언
const edit = async () => {
  try {
    if (VALIDATION_TITLE(inputTitle.value)) return
    if (VALIDATION_CONTENT(editorData.value)) return

    const formData = new FormData()

    formData.append('title', inputTitle.value)
    formData.append('content', sanitizeHtml(editorData.value))
    formData.append('id', store.state.detail.id)
    formData.append('mainContent', isMainContent.value)
    formData.append('board', route.query?.name || route.params?.name || '')

    let deleteKey = ''

    if (file.value) {
      deleteKey = `uploads/${store.state.detail.uuid}_${store.state.detail.filename}`

      formData.append('deleteKey', deleteKey)
    }

    formData.append('fileField', file.value)

    isSubmitting.value = true
    const result = await store.dispatch('EDIT_BOARD', {
      formData: formData,
      name: route.query?.name
    })

    if (result) {
      router.push({
        name: `${route.query.name}`,
        query: { roomId: store.state.room.id, pageNum: 1 }
      })
    }
  } catch (error) {
    console.error('Error writing board:', error)
  } finally {
    isSubmitting.value = false
  }
}

const backPage = () => {
  router.back()
}

const changeImage = async (event) => {
  try {
    const selectedFiles = event.target?.files
    if (!selectedFiles || selectedFiles.length === 0) {
      return
    }

    const [processedFile] = await compressImageFiles(selectedFiles)
    if (!processedFile) {
      return
    }

    files.value = [processedFile]
    file.value = processedFile

    if (processedFile.type === 'application/pdf') {
      previewItem.value = {
        type: 'pdf',
        name: processedFile.name
      }
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewItem.value = {
          type: 'image',
          src: e.target?.result,
          name: processedFile.name
        }
      }
      reader.readAsDataURL(processedFile)
    }
  } catch (error) {
    console.error('Failed to process selected file', error)
  }
}

const imageUrl = ref(null)
const existingPreview = computed(() => {
  if (!store.state.detail.filename || !store.state.detail.extension) return null

  const normalizedExtension = store.state.detail.extension.replace('.', '').toLowerCase()
  const isPdf = normalizedExtension === 'pdf'
  return {
    type: isPdf ? 'pdf' : 'image',
    name: store.state.detail.filename,
    src: isPdf ? null : imageUrl.value
  }
})

onMounted(() => {
  // 컴포넌트가 마운트된 후에 이미지 URL을 설정

  imageUrl.value = `${import.meta.env.VITE_API_URL}uploads/${store.state.detail.uuid}_${store.state.detail.filename}`
})

const removeSelectedFile = () => {
  previewItem.value = null
  file.value = null
  files.value = []
  const input = document.getElementById('image')
  if (input) {
    input.value = ''
  }
}
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
  position: relative;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율을 유지하면서 컨테이너에 맞게 조정 */
}
.file-chip {
  width: 100%;
  height: 100%;
  border: 1px dashed #c0c4d5;
  border-radius: 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  text-align: center;
  color: #344767;
  background-color: #f8f9fc;
  position: relative;
}
.file-chip__icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #f5365c;
}
.file-chip__name {
  font-size: 0.9rem;
  word-break: break-all;
}
.remove-btn {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
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
}
.remove-btn span {
  font-size: 1rem;
}
.remove-btn--chip {
  background: transparent;
  color: #8392ab;
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
  background-color: #2196f3;
}

/* 체크된 상태에서 원의 위치 */
input:checked + .slider:before {
  transform: translateX(22px); /* 원의 이동 거리 조정 */
}

/* 비활성화된 상태 */
input:disabled + .slider {
  background-color: #e6e6e6;
  cursor: not-allowed;
}

/* 비활성화된 상태에서 체크된 상태 */
input:checked:disabled + .slider {
  background-color: #a0a0a0;
}

/* 비활성화된 상태에서 슬라이더 안의 원 */
input:disabled + .slider:before {
  background-color: #bfbfbf;
}
</style>
