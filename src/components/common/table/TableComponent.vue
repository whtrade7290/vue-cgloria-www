<template>
  <div class="table-responsive p-0">
    <table class="table align-items-center justify-content-center mb-3">
      <thead>
        <tr>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
            style="width: 10%; text-align: center"
          >
            {{ $t('table.tableComponent.number') }}
          </th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
            style="width: 40%; text-align: center"
          >
            {{ $t('table.tableComponent.title') }}
          </th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
            style="width: 10%; text-align: center"
          >
            {{ $t('table.tableComponent.writer') }}
          </th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
            style="width: 20%; text-align: center"
          >
            {{ $t('table.tableComponent.date') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="store.state.dataList.length > 0">
          <tr v-for="(item, idx) in store.state.dataList" :key="idx">
            <td style="width: 10%; text-align: center">
              <p class="text-sm font-weight-bold mb-0 text-center">{{ item.id }}</p>
            </td>
            <td style="width: 40%; text-align: left">
              <p class="text-sm font-weight-bold mb-0">
                <a href="javascript:;" @click="intoDetail(item.id)">{{ item.title }}</a>
              </p>
            </td>
            <td style="width: 10%; text-align: center">
              <p class="text-sm font-weight-bold mb-0 text-center">
                {{ item.writer_name ?? item.writer }}
              </p>
            </td>
            <td style="width: 20%; text-align: center">
              <p class="text-sm font-weight-bold mb-0 text-center">
                {{ formatDate(item.create_at) }}
              </p>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="4" class="no-results">
              <div class="result-container">
                <i class="fas fa-search"></i>
                <p class="result-text">검색 결과가 없습니다.</p>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a
            class="page-link"
            :class="[pageNum === 1 ? 'disabled' : '']"
            href="javascript:;"
            tabindex="-1"
            @click="fetchList((pageNum = pageNum - 1))"
          >
            <i class="fa fa-angle-left"></i>
            <i class="material-icons" style="font-size: 1rem">arrow_back_ios</i>
          </a>
        </li>
        <li class="page-item" v-for="page in pageList" :key="page">
          <a
            class="page-link"
            :class="[pageNum === page ? 'selected' : '']"
            href="javascript:;"
            @click="fetchList(page)"
            >{{ page }}</a
          >
        </li>

        <li class="page-item">
          <a
            class="page-link"
            :class="[
              pageNum === Math.ceil(store.state.count / pageSize) ||
              Math.ceil(store.state.count / pageSize) === 0
                ? 'disabled'
                : ''
            ]"
            href="javascript:;"
            @click="fetchList((pageNum = pageNum + 1))"
          >
            <i class="fa fa-angle-right"></i>
            <i class="material-icons" style="font-size: 1rem">arrow_forward_ios</i>
          </a>
        </li>
      </ul>
    </nav>
    <div class="d-flex justify-content-center mt-5">
      <div class="mb-3 w-25">
        <input
          type="text"
          class="form-control form-control-lg mr-1"
          placeholder="search"
          aria-label="Email"
          aria-describedby="email-addon"
          v-model="searchWord"
        />
      </div>
      <div style="margin-left: 0.5rem; margin-top: 0.15rem">
        <button type="button" class="btn bg-gradient-primary" @click="searchPost">검색</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

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

// route.query.pageNum이 변경되면 pageNum을 업데이트하는 watch
watch(
  () => Number(route.query.pageNum), // route.query 전체를 감시
  (newQuery) => {
    if (newQuery.pageNum) {
      // pageNum이 존재할 때만 업데이트
      pageNum.value = Number(newQuery.pageNum ?? 1)
    }
  },
  { immediate: true } // 필요 시 deep 옵션 사용
)

const pageSize = 20
let pageList = []

const roomId = computed(() => Number(route.query?.roomId ?? 0))

// Vuex 상태를 computed로 관리
const totalCount = computed(() => store.state.count)

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

  pageList = []

  for (let index = startIndex; index <= endIndex; index++) {
    pageList.push(index)
  }

  return endIndex
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}. ${month}. ${day}. `
}

async function intoDetail(id) {
  await router.push({
    name: 'detail',
    query: {
      pageNum: pageNum.value,
      roomId: roomId.value,
      ...(searchWord.value && { searchWord: searchWord.value })
    }, // roomId를 query로 설정
    params: { name: route.name, id: id }
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
.selected {
  border: 3px solid #c5b5aa;
  background-color: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.no-results {
  text-align: center;
  vertical-align: middle;
  height: 200px;
  background-color: #f8f9fa; /* 연한 회색 배경 */
  border: 1px solid #ddd; /* 테두리 */
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

.result-text {
  font-size: 18px;
  font-weight: bold;
  color: #555; /* 어두운 회색 */
  margin-top: 10px;
}

i {
  font-size: 30px;
  color: #777; /* 아이콘 색상 */
}

/* 부드러운 페이드인 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
