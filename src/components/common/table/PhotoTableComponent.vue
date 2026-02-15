<template>
  <div class="row">
    <!-- ✅ 모바일/태블릿(≤991px) 검색창: 위쪽 -->
    <div class="d-lg-none w-100 px-3 pt-3">
      <div class="mobile-search">
        <input
          v-model="searchWord"
          type="text"
          class="form-control form-control-sm-custom"
          placeholder="search"
        />
        <button
          type="button"
          class="btn bg-gradient-primary btn-sm-custom mb-0"
          @click="searchPost"
        >
          검색
        </button>
      </div>
    </div>

    <!-- ✅ 카드 리스트 -->
    <div
      v-for="(item, idx) in parsedFiles"
      :key="idx"
      class="col-lg-3 col-sm-6"
      style="padding: 20px 30px 0 30px"
    >
      <div class="card card-plain card-blog">
        <div class="card-image border-radius-lg position-relative">
          <a href="javascript:;" @click="intoDetail(item.id)">
            <img
              :key="item.id"
              class="w-100 border-radius-lg move-on-hover shadow"
              :src="item.thumnailUrl"
              :alt="item.title"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width="300"
              height="200"
            />
          </a>
        </div>

        <div class="card-body px-0" style="padding: 10px 0 0 0">
          <span>
            <a href="javascript:;" class="text-dark font-weight-bold">{{ item.title }}</a>
          </span>
        </div>

        <div style="display: flex; justify-content: space-between">
          <span>
            <a href="javascript:;" class="text-dark" style="font-size: 14px; line-height: 16px">
              {{ formatDate(item.create_at) }}
            </a>
          </span>
          <span>{{ item.writer_name ?? item.writer }}</span>
        </div>
      </div>
    </div>

    <!-- ✅ 페이지네이션 -->
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

        <li v-for="page in pageList" :key="page" class="page-item">
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
            :class="[pageNum == totalPages ? 'disabled' : '']"
            href="javascript:;"
            @click="fetchList((pageNum = pageNum + 1))"
          >
            <i class="fa fa-angle-right"></i>
            <i class="material-icons" style="font-size: 1rem">arrow_forward_ios</i>
          </a>
        </li>
      </ul>
    </nav>

    <!-- ✅ 데스크탑(≥992px) 검색창: 아래쪽 유지 -->
    <div class="d-none d-lg-flex justify-content-center mt-5">
      <div class="mb-3 w-25">
        <input
          v-model="searchWord"
          type="text"
          class="form-control form-control-lg mr-1"
          placeholder="search"
          aria-label="Email"
          aria-describedby="email-addon"
        />
      </div>
      <div style="margin-left: 0.5rem">
        <button type="button" class="btn bg-gradient-primary" @click="searchPost">검색</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
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

const staticPath = `${import.meta.env.VITE_API_URL}uploads`
let searchWord = ref('')

let pageNum = ref(Number(route.query?.pageNum ?? 1))
const pageSize = 12
const pageList = ref([])
const totalCount = computed(() => store.state.photoCount || 0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

fetchList(pageNum.value)

async function fetchList(num) {
  const payload = {
    name: props.called,
    startRow: (num - 1) * pageSize,
    pageSize: pageSize,
    searchWord: searchWord.value,
    board: route.name
  }
  pageNum.value = num
  await Promise.all([
    store.dispatch('FETCH_PHOTO_DATALIST', payload),
    store.dispatch('FETCH_PHOTO_DATACOUNT', payload)
  ])
  settingPageNumber()
}

function settingPageNumber() {
  const total = Math.max(1, Math.ceil(totalCount.value / pageSize))
  const startIndex = Math.max(1, pageNum.value - 2)
  const endIndex = Math.min(total, startIndex + 7)

  pageList.value = []
  for (let index = startIndex; index <= endIndex; index += 1) {
    pageList.value.push(index)
  }
}

const parsedFiles = computed(() => {
  const dataList = store.state.photoList

  if (Array.isArray(dataList) === false) return []

  return dataList.map((data) => {
    let files = []
    if (data.files) {
      files = JSON.parse(data.files)
    }

    return {
      id: data.id,
      title: data.title,
      writer: data.writer,
      content: data.content,
      files: files,
      thumnailUrl: `${staticPath}/${files[0]?.filename}`,
      update_at: data.update_at,
      create_at: data.create_at,
      deleted: data.deleted
    }
  })
})

async function intoDetail(id) {
  await router.push({
    name: 'detail',
    params: { name: route.name, id: id },
    query: { pageNum: pageNum.value }
  })
}

async function searchPost() {
  pageNum.value = 1
  await fetchList(1)
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

/* ✅ 검색 영역 전체 */
.d-flex.justify-content-center.mt-5 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

/* ✅ input wrapper */
.w-25 {
  width: 25% !important;
  min-width: 220px;
  max-width: 350px; /* PC에서 너무 길지 않게 */
}

/* ✅ input 기본 스타일 */
.form-control.form-control-lg {
  height: 46px;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: all 0.2s ease-in-out;
  text-align: center;
}

.form-control.form-control-lg:focus {
  border-color: #d4a88c;
  box-shadow: 0 0 0 3px rgba(212, 168, 140, 0.2);
}

/* ✅ 버튼 스타일 */
.btn.bg-gradient-primary {
  height: 46px;
  padding: 0 1.2rem;
  border-radius: 10px;
  background: linear-gradient(45deg, #eecbb0, #e2b290);
  font-weight: 600;
  border: none;
  color: #fff;
  transition: background 0.3s ease;
}

.btn.bg-gradient-primary:hover {
  background: linear-gradient(45deg, #e2b290, #d9a77b);
}

/* ✅ 반응형 - 태블릿 (길이 조절) */
@media (max-width: 992px) {
  .w-25 {
    width: 45% !important;
    max-width: 300px;
  }
}

/* ✅ 반응형 - 모바일 (한 줄 유지) */
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

/* ✅ 반응형 - 아주 작은 모바일 */
@media (max-width: 480px) {
  .w-25 {
    width: 70% !important;
    max-width: 220px;
  }
}

/* ===================== */
/* 모바일(≤991px) 검색 상단 */
/* ===================== */
.mobile-search {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.form-control-sm-custom {
  height: 40px;
  font-size: 0.9rem;
  padding: 0 0.75rem;
  border-radius: 10px;
  text-align: center;
}

.btn-sm-custom {
  height: 40px;
  padding: 0 1rem;
  font-size: 0.9rem;
  border-radius: 10px;
  white-space: nowrap;
}
</style>
