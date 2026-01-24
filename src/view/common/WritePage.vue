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
          <h3 class="text-white mb-0">
            <span v-if="boardDisplayTitle">{{ boardDisplayTitle }}</span
            ><span v-if="boardDisplayTitle">&nbsp;</span>{{ $t('photoPage.writeHeader') }}
          </h3>
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
          <div v-if="shouldShowLanguageSelector" class="language-selector">
            <p class="language-selector__label">{{ $t('writePage.languageLabel') }}</p>
            <label
              v-for="option in languageOptions"
              :key="option.value"
              class="language-selector__option"
              :for="`write-language-${option.value}`"
            >
              <input
                type="radio"
                :id="`write-language-${option.value}`"
                name="write-language"
                :value="option.value"
                v-model="selectedLanguage"
              />
              <span>{{ $t(option.labelKey) }}</span>
            </label>
          </div>
          <label for="image">{{ $t('writePage.addImage') }}</label
          ><br />
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
          <label for="fileUpload" class="btn btn-sm btn-outline-primary mb-0 me-1 mt-2 mt-md-0">{{
            $t('photoPage.uploadButton')
          }}</label>
          <input
            type="file"
            id="fileUpload"
            @change="changeImage"
            class="hidden-file-input"
            multiple
          /><br />
          <label for="content">{{ $t('writePage.content') }}</label
          ><br />
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
import Swal from 'sweetalert2'

const IMAGE_REQUIRED_BOARDS = ['school_photo_board', 'photo_board']
const store = useStore()
const route = useRoute()
const router = useRouter()
const isMainContent = ref(false)
const { t, locale } = useI18n()

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
    'mediaEmbed',
    'insertTable',
    '|',
    'undo',
    'redo'
  ]
}

const LANGUAGE_CONTROLLED_BOARDS = ['column', 'class_meeting']
const languageOptions = [
  { value: 'ko', labelKey: 'writePage.languageOptions.ko' },
  { value: 'ja', labelKey: 'writePage.languageOptions.ja' }
]
const normalizedLocale = computed(() => (locale.value === 'jp' ? 'ja' : locale.value))
const selectedLanguage = ref(normalizedLocale.value || 'ko')
const boardName = computed(() => route.query?.name || route.params?.name || '')
const boardTitleMap = {
  sermon: 'nav.classWord.subTitles.sermon',
  column: 'nav.classWord.subTitles.column',
  weekly_bible_verse: 'nav.classWord.subTitles.weekly_bible_verse',
  class_meeting: 'nav.classWord.subTitles.class_meeting',
  notice: 'nav.intro.subTitles.notice',
  school_photo_board: 'nav.sundaySchool.subTitles.school_photo_board',
  sunday_school_resource: 'nav.sundaySchool.subTitles.sunday_school_resource',
  general_forum: 'nav.fellowshipArea.subTitles.general_forum',
  photo_board: 'nav.fellowshipArea.subTitles.photo_board',
  testimony: 'nav.fellowshipArea.subTitles.testimony',
  withDiary: 'nav.withDiary.subTitles.withDiary'
}
const boardDisplayTitle = computed(() => {
  const key = boardTitleMap[boardName.value]
  if (key) return t(key)
  return boardName.value ? boardName.value : ''
})
const requiresImage = computed(() => IMAGE_REQUIRED_BOARDS.includes(boardName.value))
const isLanguageBoard = computed(() => LANGUAGE_CONTROLLED_BOARDS.includes(boardName.value))

const MAX_IMAGE_COUNT = 4
const inputTitle = ref('')
const files = ref([])
const previewItems = ref([])
const isSubmitting = ref(false)
const imagePreviewItems = computed(() => previewItems.value.filter((item) => item.type === 'image'))
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
  if (requiresImage.value && files.value.length === 0) {
    await Swal.fire({
      title: t('photoPage.imageRequired'),
      icon: 'warning'
    })
    return
  }

  const formData = new FormData()
  formData.append('title', inputTitle.value)
  formData.append('content', sanitizeHtml(editorData.value))
  formData.append('writer', JSON.parse(localStorage.getItem(getUserIdFromCookie())).user.username)
  formData.append('writer_name', JSON.parse(localStorage.getItem(getUserIdFromCookie())).user.name)
  const currentBoardName = boardName.value
  if (!currentBoardName) {
    console.error('게시판 이름이 없어 업로드를 중단했습니다.')
    return
  }
  formData.append('board', currentBoardName)
  formData.append('mainContent', isMainContent.value)
  if (isLanguageBoard.value) {
    formData.append('language', selectedLanguage.value)
  }

  if (currentBoardName === 'withDiary') {
    formData.append('diaryRoomId', route.query.roomId)
  }

  files.value.forEach((file) => {
    formData.append('fileField', file)
  })

  try {
    isSubmitting.value = true
    const result = await store.dispatch('WRITE_BOARD', {
      formData,
      name: currentBoardName
    })
    if (result) {
      if (currentBoardName === 'withDiary') {
        router.push({
          name: currentBoardName,
          query: { roomId: route.query.roomId, pageNum: 1 }
        })
      } else {
        router.push(`/${currentBoardName}`)
      }
    }
  } finally {
    isSubmitting.value = false
  }
}

function backPage() {
  router.back()
}

const getCurrentImageCount = () => previewItems.value.filter((item) => item.type === 'image').length

const enforceImageLimit = (filesToAdd, currentCount) => {
  const accepted = []
  let imageCount = currentCount
  let overflow = false

  filesToAdd.forEach((file) => {
    if (file.type === 'application/pdf') {
      accepted.push(file)
      return
    }
    if (imageCount < MAX_IMAGE_COUNT) {
      accepted.push(file)
      imageCount += 1
    } else {
      overflow = true
    }
  })

  if (overflow) {
    Swal.fire({ title: t('photoPage.imageLimit'), icon: 'warning' })
  }

  return accepted
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
      const limitedFiles = enforceImageLimit(filteredFiles, getCurrentImageCount())
      if (limitedFiles.length === 0) {
        return
      }
      files.value = files.value.concat(limitedFiles)

      limitedFiles.forEach((file) => {
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
  const storedData = localStorage.getItem(getUserIdFromCookie())
  const role = storedData ? JSON.parse(storedData)?.user?.role : ''
  const allowedBoard = routeNames.includes(route.query?.name)
  return allowedBoard && role === 'ADMIN'
})
const shouldShowLanguageSelector = computed(
  () => isDisplay.value && isLanguageBoard.value && !!selectedLanguage.value
)
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
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  transform: translateY(-1px);
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-switch .slider {
  position: absolute;
  cursor: pointer;
  top: -1px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d2d6dc;
  transition: 0.3s ease;
  border-radius: 999px;
}
.toggle-switch .slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: #fff;
  transition: 0.3s ease;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.toggle-switch input:checked + .slider {
  background: linear-gradient(90deg, #f6ad55 0%, #e49c7f 100%);
}
.toggle-switch input:checked + .slider:before {
  transform: translateX(22px);
}
.language-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
}
.language-selector__label {
  margin: 0;
  font-weight: 600;
  position: relative;
  top: -1px;
}
.language-selector__option {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.95rem;
  margin-top: 5px;
}
.language-selector__option input[type='radio'] {
  accent-color: #f6ad55;
}
</style>

<style>
.ck-content {
  min-height: 600px;
  max-height: 800px;
  overflow-y: auto;
  border-radius: 1.5rem;
  line-height: 1.6;
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
  height: 220px;
  object-fit: contain;
  display: block;
  border-radius: 0.75rem;
  background-color: #f8f9fc;
  border: 1px solid #e3e6ef;
  padding: 0.35rem;
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
