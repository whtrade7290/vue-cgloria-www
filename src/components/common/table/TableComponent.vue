<template>
  <div class="table-responsive p-0">
    <!-- ===================== -->
    <!-- 모바일 (≤ 991px) -->
    <!-- ===================== -->
    <div class="d-lg-none">
      <!-- 검색 -->
      <div class="mobile-search">
        <input
          v-model="searchWord"
          type="text"
          class="form-control form-control-lg"
          placeholder="search"
        />
        <button class="btn bg-gradient-primary mb-0" @click="searchPost">검색</button>
      </div>

      <!-- 리스트 -->
      <ul class="list-group list-group-flush mt-3">
        <li
          v-for="item in displayItems"
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

        <li v-if="hasNoData" class="list-group-item text-center text-muted">
          {{ $t('common.noResults') }}
        </li>
        <li v-if="props.loading" class="list-group-item text-center text-muted">Loading...</li>
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

          <li v-for="page in pageList" :key="page" class="page-item">
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
              :class="{ disabled: pageNum === totalPages }"
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
          <tr v-for="item in displayItems" :key="item.id">
            <td class="text-center">{{ item.id }}</td>
            <td>
              <a href="javascript:;" @click="intoDetail(item.id)">
                {{ item.title }}
              </a>
            </td>
            <td class="text-center">{{ item.writer_name ?? item.writer }}</td>
            <td class="text-center">{{ formatDate(item.create_at) }}</td>
          </tr>

          <tr v-if="hasNoData">
            <td colspan="4" class="text-center text-muted">
              {{ $t('common.noResults') }}
            </td>
          </tr>
          <tr v-if="props.loading">
            <td colspan="4" class="text-center text-muted">Loading...</td>
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

          <li v-for="page in pageList" :key="page" class="page-item">
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
              :class="{ disabled: pageNum === totalPages }"
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
            v-model="searchWord"
            type="text"
            class="form-control form-control-lg"
            placeholder="search"
            @keydown.enter.prevent="searchPost"
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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/dateFormat'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  called: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  totalCount: {
    type: Number,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
  },
  searchValue: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  roomId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['page-change', 'search'])

const pageNum = ref(props.page || 1)
watch(
  () => props.page,
  (value) => {
    pageNum.value = value || 1
  }
)

const searchWord = ref(props.searchValue || '')
watch(
  () => props.searchValue,
  (value) => {
    searchWord.value = value || ''
  }
)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalCount / props.pageSize))
})

const pageList = computed(() => {
  const startIndex = Math.max(1, pageNum.value - 2)
  const endIndex = Math.min(totalPages.value, startIndex + 4)
  return Array.from({ length: Math.max(0, endIndex - startIndex + 1) }, (_, i) => startIndex + i)
})

const hasNoData = computed(() => !props.loading && (!props.items || props.items.length === 0))

const displayItems = computed(() => props.items ?? [])

const changePage = (page) => {
  if (page < 1 || page > totalPages.value || page === pageNum.value) return
  emit('page-change', page)
}

const fetchList = (page) => {
  changePage(page)
}

const searchPost = () => {
  emit('search', searchWord.value.trim())
}

const intoDetail = async (id) => {
  await router.push({
    name: 'detail',
    params: { name: props.called, id },
    query: { ...route.query, pageNum: pageNum.value, roomId: props.roomId || route.query.roomId }
  })
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
  font-size: 1.25rem;
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
