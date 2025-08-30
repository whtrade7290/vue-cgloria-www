<template>
  <div class="row">
    <div
      class="col-lg-3 col-sm-6"
      style="padding: 20px 30px 0 30px"
      v-for="(item, idx) in parsedFiles"
      :key="idx"
    >
      <div class="card card-plain card-blog">
        <div class="card-image border-radius-lg position-relative">
          <a href="javascript:;" @click="intoDetail(item.id)">
            <img class="w-100 border-radius-lg move-on-hover shadow" :src="item.thumnailUrl" />
          </a>
        </div>
        <div class="card-body px-0" style="padding: 10px 0 0 0">
          <span>
            <a href="javascript:;" class="text-dark font-weight-bold">{{ item.title }}</a>
          </span>
        </div>
        <div style="display: flex; justify-content: space-between">
          <span
            ><a href="javascript:;" class="text-dark" style="font-size: 14px; line-height: 16px">{{
              formatDate(item.create_at)
            }}</a>
          </span>
          <span> {{ item.writer_name ?? item.writer }} </span>
        </div>
      </div>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a
            class="page-link"
            :class="[pageNum == 1 ? 'disabled' : '']"
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
            :class="[pageNum == Math.ceil(store.state.count / pageSize) ? 'disabled' : '']"
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

let pageNum = ref(Number(route.query?.pageNum ?? 1))
const pageSize = 20
let pageList = []

const totalCount = computed(() => store.state.count)

watch(
  totalCount, // computed로 Vuex 상태 감시
  () => {
    fetchList(pageNum.value) // totalCount가 변경되면 리스트 다시 로드
  }
)

fetchList(pageNum.value)

function fetchList(num) {
  const payload = {
    name: props.called,
    startRow: (num - 1) * pageSize,
    pageSize: pageSize,
    searchWord: searchWord.value
  }
  store.dispatch('FETCH_PHOTO_DATALIST', payload)
  pageNum.value = num
  settingPageNumber()
}

function settingPageNumber() {
  let totalPages = Math.ceil(totalCount.value / pageSize)

  // 항상 처음 5개 페이지가 표시되도록
  let startIndex = Math.max(1, pageNum.value - 2) // 현재 페이지를 기준으로 앞 2개 페이지를 포함
  let endIndex = Math.min(totalPages, startIndex + 7) // startIndex에서 5개 페이지까지 표시

  pageList = []

  for (let index = startIndex; index <= endIndex; index++) {
    pageList.push(index)
  }

  return endIndex
}

const parsedFiles = computed(() => {
  // dataList를 가져옵니다
  const dataList = store.state.photoList

  if (Array.isArray(dataList) === false) return []

  const newList = dataList.map((data) => {
    let files = []
    if (data.files) {
      files = JSON.parse(data.files)
    } else {
      files = []
    }

    return {
      id: data.id,
      title: data.title,
      writer: data.writer,
      content: data.content,
      files: files,
      thumnailUrl: `https://cgloria.work:443/uploads/${files[0]?.filename}`,
      update_at: data.update_at,
      create_at: data.create_at,
      deleted: data.deleted
    }
  })

  return newList
})

async function intoDetail(id) {
  await router.push({
    name: 'photoDetail',
    params: { name: route.name, id: id },
    query: { pageNum: pageNum.value }
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

  // 글 갯수 조회
  store.dispatch('FETCH_PHOTO_DATACOUNT', payload)
  // 글 조회
  store.dispatch('FETCH_PHOTO_DATALIST', payload)
}
</script>

<style scoped>
.selected {
  border: 3px solid #c5b5aa;
  background-color: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}
.card-image img {
  width: 100%;
  height: 11rem; /* 이미지의 고정 높이 */
  object-fit: cover; /* 이미지가 카드에 맞게 조정됨 */
}
</style>
