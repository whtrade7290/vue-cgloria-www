<template>
  <div class="memory-verse-stepper">
    <div class="field-group">
      <div class="field">
        <label :for="`${idPrefix}-book`">성경</label>
        <select
          :id="`${idPrefix}-book`"
          v-model="state.book"
          class="form-control"
          name="memory-book"
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
          v-model.number="state.chapter"
          class="form-control"
          name="memory-chapter"
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
          v-model.number="state.paragraph"
          class="form-control"
          name="memory-paragraph"
          :disabled="isDisabled || paragraphOptions.length === 0"
        >
          <option :value="null">절을 선택하세요</option>
          <option v-for="paragraph in paragraphOptions" :key="paragraph" :value="paragraph">
            {{ paragraph }}
          </option>
        </select>
      </div>
      <div v-if="readingPartOptionsList.length" class="field field--range">
        <label class="range-label">범위</label>
        <div class="range-options">
          <label v-for="option in readingPartOptionsList" :key="option.value" class="range-option">
            <input
              v-model="readingPartState"
              type="radio"
              name="memory-range"
              :value="option.value"
              :disabled="isRangeDisabled"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <textarea
      v-if="editableSentence"
      v-model="previewText"
      class="preview preview--editable"
      rows="4"
      :disabled="isDisabled || !hasSelection"
      :placeholder="
        hasSelection ? '암송 구절을 입력하거나 수정하세요' : '성경, 장, 절을 먼저 선택해 주세요'
      "
    ></textarea>
    <div v-else-if="previewText" class="preview">
      {{ previewText }}
    </div>
    <div v-else-if="showEmptyMessage" class="preview preview--empty">
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

const emit = defineEmits(['update:modelValue', 'update:readingPart'])

const props = defineProps({
  modelValue: {
    type: [Number, Object],
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
  },
  editableSentence: {
    type: Boolean,
    default: false
  },
  readingPart: {
    type: String,
    default: null
  },
  readingPartOptions: {
    type: Array,
    default: () => []
  },
  readingPartDisabled: {
    type: Boolean,
    default: false
  }
})

const normalizeVerseValue = (value) => {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') {
    const numeric = Number(value)
    return Number.isFinite(numeric) && numeric > 0 ? { bibleId: numeric } : null
  }
  if (typeof value === 'object') {
    const bibleIdCandidate = Number(value?.bibleId ?? value?.bible_id ?? value?.idx ?? null)
    const chapterCandidate = Number(value?.chapter ?? value?.Chapter)
    const paragraphCandidate = Number(value?.paragraph ?? value?.Paragraph ?? value?.verse)
    const label = value?.longLabel || value?.long_label || value?.book || ''
    const sentence = value?.sentence || value?.text || value?.content || value?.memorySentence || ''
    return {
      bibleId: Number.isFinite(bibleIdCandidate) && bibleIdCandidate > 0 ? bibleIdCandidate : null,
      longLabel: label,
      chapter: Number.isFinite(chapterCandidate) ? chapterCandidate : null,
      paragraph: Number.isFinite(paragraphCandidate) ? paragraphCandidate : null,
      sentence
    }
  }
  return null
}

const isSameVerse = (a, b) => {
  if (!a && !b) return true
  if (!a || !b) return false
  return (
    (a.bibleId ?? null) === (b.bibleId ?? null) &&
    (a.longLabel ?? '') === (b.longLabel ?? '') &&
    (a.chapter ?? null) === (b.chapter ?? null) &&
    (a.paragraph ?? null) === (b.paragraph ?? null) &&
    (a.sentence ?? '') === (b.sentence ?? '')
  )
}

const hasVerseDetails = (verse) => {
  if (!verse) return false
  return Boolean(
    verse.longLabel && Number.isFinite(verse.chapter) && Number.isFinite(verse.paragraph)
  )
}

const incomingValue = normalizeVerseValue(props.modelValue)
const state = reactive({
  book: incomingValue?.longLabel || '',
  chapter: incomingValue?.chapter ?? null,
  paragraph: incomingValue?.paragraph ?? null
})

const isDisabled = computed(() => props.disabled)
const readingPartOptionsList = computed(() =>
  Array.isArray(props.readingPartOptions) ? props.readingPartOptions : []
)
const readingPartState = ref(props.readingPart ?? null)
const isRangeDisabled = computed(() => isDisabled.value || props.readingPartDisabled)
const hasSelection = computed(
  () =>
    Boolean(state.book && state.book.length > 0) &&
    Number.isFinite(state.chapter) &&
    Number.isFinite(state.paragraph)
)
const editableSentence = computed(() => props.editableSentence && !props.disabled)
const selectedVerse = ref(incomingValue)
const bookOptions = ref([])
const chapterOptions = ref([])
const paragraphOptions = ref([])
const previewText = ref(incomingValue?.sentence || '')
const suppressStateWatch = ref(false)
const suppressPreviewUpdate = ref(false)
const booksLoaded = ref(false)

const updateSelectedVerse = (value, { emitChange = true } = {}) => {
  selectedVerse.value = value ?? null
  if (emitChange) {
    emit('update:modelValue', selectedVerse.value)
  }
}

const clearSelection = () => {
  suppressStateWatch.value = true
  state.book = ''
  state.chapter = null
  state.paragraph = null
  suppressStateWatch.value = false
  previewText.value = ''
  updateSelectedVerse(null)
}

const resetParagraphState = () => {
  paragraphOptions.value = []
  suppressStateWatch.value = true
  state.paragraph = null
  suppressStateWatch.value = false
  previewText.value = ''
  updateSelectedVerse(null)
}

const resetChapterState = () => {
  chapterOptions.value = []
  suppressStateWatch.value = true
  state.chapter = null
  suppressStateWatch.value = false
  resetParagraphState()
}

const loadBooks = async () => {
  const res = await fetchBibleBooks()
  const list = Array.isArray(res?.data) ? res.data : []
  bookOptions.value = list.filter((item) => typeof item === 'string' && item.trim().length > 0)
  booksLoaded.value = true

  if (state.book && !bookOptions.value.includes(state.book)) {
    suppressStateWatch.value = true
    state.book = ''
    suppressStateWatch.value = false
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
    suppressStateWatch.value = true
    state.chapter = chapterOptions.value[0]
    suppressStateWatch.value = false
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
    suppressStateWatch.value = true
    state.paragraph = paragraphOptions.value[0]
    suppressStateWatch.value = false
  }

  if (suppressPreviewUpdate.value) {
    syncSelectedVerse({ preserveSentence: true })
    return
  }

  await updatePreview()
}

const buildReferenceSentence = () => {
  if (!state.book || state.chapter === null || state.paragraph === null) return ''
  const parts = [state.book]
  if (Number.isFinite(state.chapter)) parts.push(`${state.chapter}장`)
  if (Number.isFinite(state.paragraph)) parts.push(`${state.paragraph}절`)
  return parts.join(' ').trim()
}

const syncSelectedVerse = ({ preserveSentence = false } = {}) => {
  if (!state.book || state.chapter === null || state.paragraph === null) {
    previewText.value = ''
    updateSelectedVerse(null)
    return
  }

  let sentence = preserveSentence ? previewText.value || '' : ''
  if (!sentence) {
    sentence = buildReferenceSentence()
  }

  previewText.value = sentence
  updateSelectedVerse({
    bibleId: selectedVerse.value?.bibleId ?? null,
    longLabel: state.book,
    chapter: state.chapter,
    paragraph: state.paragraph,
    sentence
  })
}

const updatePreview = async () => {
  if (!state.book || state.chapter === null || state.paragraph === null) {
    previewText.value = ''
    updateSelectedVerse(null)
    return
  }

  try {
    const res = await fetchBibleVerse(state.book, state.chapter, state.paragraph)
    const verse = res?.data
    const normalized = normalizeVerseValue({
      ...verse,
      longLabel: state.book,
      chapter: state.chapter,
      paragraph: state.paragraph
    }) ?? {
      bibleId: verse?.idx ?? null,
      longLabel: state.book,
      chapter: state.chapter,
      paragraph: state.paragraph,
      sentence: ''
    }
    normalized.sentence =
      verse?.sentence ||
      verse?.text ||
      verse?.content ||
      normalized.sentence ||
      buildReferenceSentence()
    previewText.value = normalized.sentence
    updateSelectedVerse(normalized)
  } catch (error) {
    console.error('Failed to fetch bible verse', error)
    syncSelectedVerse()
  }
}

const applyInitialVerseById = async (bibleId, { emitChange = true } = {}) => {
  suppressPreviewUpdate.value = true
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

    suppressStateWatch.value = true
    state.book = bookLabel
    state.chapter = Number.isFinite(chapterValue) ? chapterValue : null
    state.paragraph = Number.isFinite(paragraphValue) ? paragraphValue : null
    suppressStateWatch.value = false

    await loadChapters()
    await loadParagraphs()

    const normalized = normalizeVerseValue({
      ...verse,
      longLabel: state.book,
      chapter: state.chapter,
      paragraph: state.paragraph
    })
    previewText.value = normalized?.sentence || ''
    updateSelectedVerse(normalized, { emitChange })
  } catch (error) {
    console.error('Failed to fetch verse by id', error)
  } finally {
    suppressPreviewUpdate.value = false
  }
}

const applyVerseData = async (verse, { emitChange = false } = {}) => {
  const normalized = normalizeVerseValue(verse)
  if (!normalized) {
    resetChapterState()
    return
  }
  suppressPreviewUpdate.value = true
  try {
    if (normalized.longLabel && !bookOptions.value.includes(normalized.longLabel)) {
      bookOptions.value.unshift(normalized.longLabel)
    }

    suppressStateWatch.value = true
    state.book = normalized.longLabel || ''
    state.chapter = normalized.chapter ?? null
    state.paragraph = normalized.paragraph ?? null
    suppressStateWatch.value = false

    previewText.value = normalized.sentence || ''

    await loadChapters()
    await loadParagraphs()

    if (!previewText.value && normalized.bibleId) {
      suppressPreviewUpdate.value = false
      await applyInitialVerseById(normalized.bibleId, { emitChange })
      return
    }

    syncSelectedVerse({ preserveSentence: true })
  } finally {
    suppressPreviewUpdate.value = false
  }
}

watch(
  () => state.book,
  async (newVal, oldVal) => {
    if (suppressPreviewUpdate.value || suppressStateWatch.value || newVal === oldVal) return
    await loadChapters()
    await loadParagraphs()
  }
)

watch(
  () => state.chapter,
  async (newVal, oldVal) => {
    if (suppressPreviewUpdate.value || suppressStateWatch.value || newVal === oldVal) return
    await loadParagraphs()
  }
)

watch(
  () => state.paragraph,
  async (newVal, oldVal) => {
    if (suppressPreviewUpdate.value || suppressStateWatch.value || newVal === oldVal) return
    await updatePreview()
  }
)

watch(previewText, (val) => {
  if (!props.editableSentence) return
  if (!hasSelection.value) return
  if (!selectedVerse.value) return
  if ((selectedVerse.value.sentence || '') === (val || '')) return
  updateSelectedVerse({ ...selectedVerse.value, sentence: val || '' })
})

watch(
  () => props.readingPart,
  (val) => {
    readingPartState.value = val ?? null
  }
)

watch(readingPartState, (val) => {
  emit('update:readingPart', val ?? null)
})

watch(
  () => props.modelValue,
  async (val) => {
    const normalized = normalizeVerseValue(val)
    if (isSameVerse(normalized, selectedVerse.value)) return
    if (normalized) {
      await applyVerseData(normalized, { emitChange: false })
    } else {
      clearSelection()
    }
  },
  { deep: true }
)

watch(
  () => props.initialBibleId,
  async (val) => {
    if (!val) return
    await applyInitialVerseById(val, { emitChange: !selectedVerse.value })
  }
)

onMounted(async () => {
  await loadBooks()
  if (hasVerseDetails(selectedVerse.value)) {
    await applyVerseData(selectedVerse.value, { emitChange: false })
    return
  }
  if (selectedVerse.value?.bibleId) {
    await applyInitialVerseById(selectedVerse.value.bibleId)
    return
  }
  if (props.initialBibleId) {
    await applyInitialVerseById(props.initialBibleId)
    return
  }
  await loadChapters()
  await loadParagraphs()
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
  margin: 10px;
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
.field--range {
  flex: 1 1 220px;
}
.form-control {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  padding: 0.4rem 0.75rem;
}
.range-label {
  font-weight: 600;
}
.range-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.range-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.95rem;
}
.range-option input[type='radio'] {
  accent-color: #f6ad55;
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
.preview--editable {
  width: 100%;
  resize: vertical;
  font-size: 0.95rem;
  line-height: 1.4;
}
</style>
