<template>
  <div class="table-responsive p-0">
    <!-- ===================== -->
    <!-- 모바일 (≤ 991px) -->
    <!-- ===================== -->
    <div class="d-lg-none px-3 pt-3">
      <!-- 검색 -->
      <div class="mobile-search">
        <input
          type="text"
          class="form-control form-control-lg"
          placeholder="search"
          v-model="searchWord"
        />
        <button class="btn bg-gradient-primary mb-0" @click="searchPost">검색</button>
      </div>

      <!-- 리스트 -->
      <ul class="list-group list-group-flush mt-3">
        <li
          v-for="item in store.state.dataList"
          :key="item.id"
          class="list-group-item mobile-item"
          @click="intoDetail(item.id)"
        >
          <p class="mobile-title">{{ item.title }}</p>
          <p class="mobile-meta">
            {{ formatDate(item.create_at) }}
            <span>|</span>
            {{ item.writer_name ?? item.writer }}
          </p>
        </li>

        <li v-if="store.state.dataList.length === 0" class="list-group-item text-center text-muted">
          {{ $t('common.noResults') }}
        </li>
      </ul>
      <!-- 페이지네이션 -->
      <nav class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <a
              class="page-link"
              :class="{ disabled: pageNum === 1 }"
              href="javascript:;"
              @click="fetchList(pageNum - 1)"
            >
              ‹
            </a>
          </li>

          <li class="page-item" v-for="page in pageList" :key="page">
            <a
              class="page-link"
              :class="{ selected: pageNum === page }"
              href="javascript:;"
              @click="fetchList(page)"
            >
              {{ page }}
            </a>
          </li>

          <li class="page-item">
            <a
              class="page-link"
              :class="{ disabled: pageNum === Math.ceil(store.state.count / pageSize) }"
              href="javascript:;"
              @click="fetchList(pageNum + 1)"
            >
              ›
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- ===================== -->
    <!-- 데스크탑 (≥ 992px) -->
    <!-- ===================== -->
    <div class="d-none d-lg-block">
      <table class="table align-items-center justify-content-center mb-3">
        <thead>
          <tr>
            <th class="text-center" style="width: 10%">
              {{ $t('table.tableComponent.number') }}
            </th>
            <th style="width: 40%">
              {{ $t('table.tableComponent.title') }}
            </th>
            <th class="text-center" style="width: 10%">
              {{ $t('table.tableComponent.writer') }}
            </th>
            <th class="text-center" style="width: 20%">
              {{ $t('table.tableComponent.date') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in store.state.dataList" :key="item.id">
            <td class="text-center">{{ item.id }}</td>
            <td>
              <a href="javascript:;" @click="intoDetail(item.id)">
                {{ item.title }}
              </a>
            </td>
            <td class="text-center">{{ item.writer_name ?? item.writer }}</td>
            <td class="text-center">{{ formatDate(item.create_at) }}</td>
          </tr>

          <tr v-if="store.state.dataList.length === 0">
            <td colspan="4" class="text-center text-muted">
              {{ $t('common.noResults') }}
            </td>
          </tr>
        </tbody>
      </table>

      <nav class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <a
              class="page-link"
              :class="{ disabled: pageNum === 1 }"
              href="javascript:;"
              @click="fetchList(pageNum - 1)"
            >
              ‹
            </a>
          </li>

          <li class="page-item" v-for="page in pageList" :key="page">
            <a
              class="page-link"
              :class="{ selected: pageNum === page }"
              href="javascript:;"
              @click="fetchList(page)"
            >
              {{ page }}
            </a>
          </li>

          <li class="page-item">
            <a
              class="page-link"
              :class="{ disabled: pageNum === Math.ceil(store.state.count / pageSize) }"
              href="javascript:;"
              @click="fetchList(pageNum + 1)"
            >
              ›
            </a>
          </li>
        </ul>
      </nav>

      <!-- 기존 검색 -->
      <div class="d-flex justify-content-center mt-5">
        <div class="mb-3 w-25">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="search"
            v-model="searchWord"
          />
        </div>
        <div style="margin-left: 10px">
          <button class="btn bg-gradient-primary test" @click="searchPost">검색</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/dateFormat'

const router = useRouter()
const route = useRoute()
const store = useStore()
const props = defineProps({
  called: {
    type: String,
    default: ''
  }
})
let searchWord = ref('')
let pageNum = ref(Number(route.query?.pageNum ?? 1)) // ref로 선언
const pageSize = 20
const pageList = ref([])
const totalCount = computed(() => store.state.count)

// route.query.pageNum이 변경되면 pageNum을 업데이트하는 watch
watch(
  () => route.query.pageNum,
  (newValue) => {
    const numericValue = Number(newValue ?? 1)
    if (!Number.isNaN(numericValue)) {
      pageNum.value = numericValue
      settingPageNumber()
    }
  },
  { immediate: true }
)

const roomId = computed(() => Number(route.query?.roomId ?? 0))

// Vuex 상태를 computed로 관리
watch(
  totalCount, // computed로 Vuex 상태 감시
  () => {
    fetchList(pageNum.value) // totalCount가 변경되면 리스트 다시 로드
  }
)

fetchList(pageNum.value)

function fetchList(num) {
  let payload = {
    name: props.called,
    startRow: (num - 1) * pageSize,
    pageSize: pageSize,
    searchWord: searchWord.value
  }

  let actionsName = ''

  if (route.name === 'withDiary') {
    actionsName = 'FETCH_WITHDIARY_DATALIST'

    if (roomId.value) {
      payload = {
        ...payload,
        roomId: roomId.value
      }
    }
  } else {
    actionsName = 'FETCH_BOARDLIST'
  }

  store.dispatch(actionsName, payload)
  pageNum.value = num
  settingPageNumber()
}

function settingPageNumber() {
  let totalPages = Math.ceil(totalCount.value / pageSize)

  // 항상 처음 5개 페이지가 표시되도록
  let startIndex = Math.max(1, pageNum.value - 2) // 현재 페이지를 기준으로 앞 2개 페이지를 포함
  let endIndex = Math.min(totalPages, startIndex + 4) // startIndex에서 5개 페이지까지 표시

  pageList.value = Array.from(
    { length: Math.max(0, endIndex - startIndex + 1) },
    (_, i) => startIndex + i
  )

  return endIndex
}

async function intoDetail(id) {
  await router.push({
    name: 'photoDetail',
    params: { name: route.name, id: id },
    query: { pageNum: pageNum.value, roomId: roomId.value }
  })
}

onMounted(() => {
  window.addEventListener('keydown', handleEnterKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEnterKey)
})

const handleEnterKey = (event) => {
  if (event.key === 'Enter') {
    searchPost()
  }
}

async function searchPost() {
  pageNum.value = 1

  let payload = {
    name: props.called,
    startRow: 0,
    pageSize: pageSize,
    searchWord: searchWord.value
  }

  let actionsName = ''
  let actionsCountName = ''

  if (route.name === 'withDiary') {
    actionsName = 'FETCH_WITHDIARY_DATALIST'
    actionsCountName = 'FETCH_WITHDIARY_BOARDCOUNT'

    if (roomId.value) {
      payload = {
        ...payload,
        roomId: roomId.value
      }
    }
  } else {
    actionsName = 'FETCH_BOARDLIST'
    actionsCountName = 'FETCH_BOARDCOUNT'
  }

  // 글 갯수 조회
  store.dispatch(actionsCountName, payload)
  // 글 조회
  store.dispatch(actionsName, payload)

  window.scrollTo({ top: 0, behavior: 'smooth' }) // 부드러운 스크롤 적용
}
</script>

<style scoped>
/* ✅ 검색 영역 wrapper */
/* ✅ 기본 (데스크탑 기준) */
.w-25 {
  width: 25% !important;
  min-width: 220px;
  max-width: 350px; /* PC에서는 너무 길지 않게 제한 */
}

/* ✅ 태블릿 (768px~992px) */
@media (max-width: 992px) {
  .w-25 {
    width: 45% !important; /* 기존 60% → 45%로 축소 */
    max-width: 300px;
  }
}

/* ✅ 모바일 (≤768px) */
@media (max-width: 768px) {
  .w-25 {
    width: 60% !important;
    max-width: 250px;
  }

  .d-flex.justify-content-center.mt-5 {
    flex-wrap: nowrap;
    justify-content: center;
  }

  .btn.bg-gradient-primary {
    height: 42px;
    padding: 0 1rem;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
}

/* ✅ 아주 작은 모바일 (≤480px) */
@media (max-width: 480px) {
  .w-25 {
    width: 70% !important;
    max-width: 220px;
  }
}

/* 모바일 검색 */
.mobile-search {
  display: flex;
  gap: 0.5rem;
}

.mobile-search input {
  flex: 1;
}

@media (max-width: 992px) {
  .mobile-search-btn {
    margin-bottom: 0 !important;
  }
}

/* 모바일 리스트 */
.mobile-item {
  padding: 1rem 0.75rem;
  cursor: pointer;
}

.mobile-title {
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.mobile-meta {
  font-size: 1rem;
  color: #999;
}

.mobile-meta span {
  margin: 0 0.25rem;
}

.pagination .page-link.selected {
  background-color: #f8f9fa;
  border-color: transparent;
  color: #f08da0;
  font-weight: 700;
  pointer-events: none;
  cursor: default;
}

.pagination .page-link.disabled,
.pagination .page-link[aria-disabled='true'] {
  pointer-events: none;
  opacity: 0.45;
  cursor: default;
}
</style>
