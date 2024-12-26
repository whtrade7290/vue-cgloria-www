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
        <tr v-for="(item, idx) in store.state.dataList" :key="idx">
          <td style="width: 10%; text-align: center">
            <p class="text-sm font-weight-bold mb-0 text-center">{{ item.id }}</p>
          </td>
          <td style="width: 40%; text-align: center">
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
import { computed, ref, watch } from 'vue'
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
  let startIndex = (Math.ceil(pageNum.value / pageSize) - 1) * pageSize + 1
  let endIndex =
    startIndex + pageSize > totalCount.value ? totalCount.value : startIndex + pageSize - 1
  if (endIndex > totalPages) {
    endIndex = totalPages
  }

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
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}. ${month}. ${day}. ${hours}:${minutes}`
}

async function intoDetail(id) {
  await router.push({
    name: 'detail',
    query: { pageNum: pageNum.value, roomId: roomId.value }, // roomId를 query로 설정
    params: { name: route.name, id: id }
  })
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
}
</script>

<style scoped>
.selected {
  border: 3px solid #c5b5aa;
  background-color: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}
</style>
