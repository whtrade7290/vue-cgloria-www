<template>
  <div class="memory-verse-stepper">
    <div class="field-group">
      <div class="field">
        <label :for="`${idPrefix}-book`">성경</label>
        <select
          :id="`${idPrefix}-book`"
          class="form-control"
          name="memory-book"
          v-model="state.book"
          :disabled="isDisabled"
        >
          <option value="">성경을 선택하세요</option>
          <option v-for="book in bookOptions" :key="book" :value="book">
            {{ book }}
          </option>
        </select>
      </div>
      <div class="field">
        <label :for="`${idPrefix}-chapter`">장</label>
        <select
          :id="`${idPrefix}-chapter`"
          class="form-control"
          name="memory-chapter"
          v-model.number="state.chapter"
          :disabled="isDisabled || chapterOptions.length === 0"
        >
          <option :value="null">장을 선택하세요</option>
          <option v-for="chapter in chapterOptions" :key="chapter" :value="chapter">
            {{ chapter }}
          </option>
        </select>
      </div>
      <div class="field">
        <label :for="`${idPrefix}-paragraph`">절</label>
        <select
          :id="`${idPrefix}-paragraph`"
          class="form-control"
          name="memory-paragraph"
          v-model.number="state.paragraph"
          :disabled="isDisabled || paragraphOptions.length === 0"
        >
          <option :value="null">절을 선택하세요</option>
          <option v-for="paragraph in paragraphOptions" :key="paragraph" :value="paragraph">
            {{ paragraph }}
          </option>
        </select>
      </div>
    </div>

    <div class="preview" v-if="previewText">
      {{ previewText }}
    </div>
    <div class="preview preview--empty" v-else-if="showEmptyMessage">
      설정된 암송 구절이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  fetchBibleBooks,
  fetchBibleChapters,
  fetchBibleParagraphs,
  fetchBibleVerse,
  fetchBibleVerseById
} from '@/api/index'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  idPrefix: {
    type: String,
    default: 'memory'
  },
  initialBibleId: {
    type: Number,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showEmptyMessage: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  book: '',
  chapter: null,
  paragraph: null
})

const isDisabled = computed(() => props.disabled)
const currentBibleId = ref(props.modelValue ?? null)
const bookOptions = ref([])
const chapterOptions = ref([])
const paragraphOptions = ref([])
const previewText = ref('')
const suppressEmit = ref(false)
const booksLoaded = ref(false)

const emitBibleId = (value) => {
  if (suppressEmit.value) return
  currentBibleId.value = value ?? null
  emit('update:modelValue', currentBibleId.value)
}

const resetParagraphState = () => {
  paragraphOptions.value = []
  suppressEmit.value = true
  state.paragraph = null
  suppressEmit.value = false
  previewText.value = ''
  emitBibleId(null)
}

const resetChapterState = () => {
  chapterOptions.value = []
  suppressEmit.value = true
  state.chapter = null
  suppressEmit.value = false
  resetParagraphState()
}

const loadBooks = async () => {
  const res = await fetchBibleBooks()
  const list = Array.isArray(res?.data) ? res.data : []
  bookOptions.value = list.filter((item) => typeof item === 'string' && item.trim().length > 0)
  booksLoaded.value = true

  if (state.book && !bookOptions.value.includes(state.book)) {
    suppressEmit.value = true
    state.book = ''
    suppressEmit.value = false
  }

  if (!state.book) {
    resetChapterState()
  }
}

const loadChapters = async () => {
  if (!state.book) {
    resetChapterState()
    return
  }

  const res = await fetchBibleChapters(state.book)
  const list = Array.isArray(res?.data) ? res.data : []
  chapterOptions.value = list
    .map((item) => Number(item?.chapter ?? item))
    .filter((num) => Number.isFinite(num))

  if (!chapterOptions.value.length) {
    resetChapterState()
    return
  }

  if (!chapterOptions.value.includes(state.chapter)) {
    suppressEmit.value = true
    state.chapter = chapterOptions.value[0]
    suppressEmit.value = false
  }
}

const loadParagraphs = async () => {
  if (!state.book || state.chapter === null) {
    resetParagraphState()
    return
  }

  const res = await fetchBibleParagraphs(state.book, state.chapter)
  const list = Array.isArray(res?.data) ? res.data : []
  paragraphOptions.value = list.map((item) => Number(item)).filter((num) => Number.isFinite(num))

  if (!paragraphOptions.value.length) {
    resetParagraphState()
    return
  }

  if (!paragraphOptions.value.includes(state.paragraph)) {
    suppressEmit.value = true
    state.paragraph = paragraphOptions.value[0]
    suppressEmit.value = false
  }

  await updatePreview()
}

const updatePreview = async () => {
  if (!state.book || state.chapter === null || state.paragraph === null) {
    previewText.value = ''
    emitBibleId(null)
    return
  }

  const res = await fetchBibleVerse(state.book, state.chapter, state.paragraph)
  const verse = res?.data
  previewText.value =
    verse?.sentence ||
    verse?.text ||
    verse?.content ||
    `${state.book} ${state.chapter}장 ${state.paragraph}절`
  emitBibleId(verse?.idx ?? null)
}

const applyInitialVerseById = async (bibleId) => {
  const numeric = Number(bibleId)
  if (!Number.isFinite(numeric) || numeric <= 0) return
  if (!booksLoaded.value) {
    await loadBooks()
  }

  try {
    const res = await fetchBibleVerseById(numeric)
    const verse = res?.data
    if (!verse) return

    const bookLabel = verse.long_label || verse.book || ''
    const chapterValue = Number(verse.chapter)
    const paragraphValue = Number(verse.paragraph)

    if (bookLabel && !bookOptions.value.includes(bookLabel)) {
      bookOptions.value.unshift(bookLabel)
    }

    suppressEmit.value = true
    state.book = bookLabel
    state.chapter = Number.isFinite(chapterValue) ? chapterValue : null
    state.paragraph = Number.isFinite(paragraphValue) ? paragraphValue : null
    suppressEmit.value = false

    await loadChapters()
    await loadParagraphs()

    previewText.value = verse.sentence || verse.text || verse.content || ''
    emitBibleId(verse.idx ?? numeric)
  } catch (error) {
    console.error('Failed to fetch verse by id', error)
  }
}

watch(
  () => state.book,
  async (newVal, oldVal) => {
    if (suppressEmit.value || newVal === oldVal) return
    await loadChapters()
    await loadParagraphs()
  }
)

watch(
  () => state.chapter,
  async (newVal, oldVal) => {
    if (suppressEmit.value || newVal === oldVal) return
    await loadParagraphs()
  }
)

watch(
  () => state.paragraph,
  async (newVal, oldVal) => {
    if (suppressEmit.value || newVal === oldVal) return
    await updatePreview()
  }
)

watch(
  () => props.modelValue,
  (val) => {
    currentBibleId.value = val ?? null
  }
)

watch(
  () => props.initialBibleId,
  async (val) => {
    if (!val) return
    await applyInitialVerseById(val)
  }
)

onMounted(async () => {
  await loadBooks()
  if (props.initialBibleId) {
    await applyInitialVerseById(props.initialBibleId)
  } else {
    await loadChapters()
    await loadParagraphs()
  }
})
</script>

<style scoped>
.memory-verse-stepper {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.field-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.field {
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.form-control {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  padding: 0.4rem 0.75rem;
}
.preview {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #fff;
  border: 1px dashed #d1d5db;
  border-radius: 0.5rem;
}
.preview--empty {
  color: #94a3b8;
  font-style: italic;
  text-align: center;
}
</style>
