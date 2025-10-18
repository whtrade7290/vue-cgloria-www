<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <!-- 이전 버튼 -->
      <li class="page-item">
        <a
          class="page-link"
          :class="{ disabled: currentPage === 1 }"
          href="javascript:;"
          @click="goPrev"
        >
          <i class="material-icons" style="font-size: 1rem">arrow_back_ios</i>
        </a>
      </li>

      <!-- 페이지 목록 -->
      <li v-for="page in pageList" :key="page" class="page-item">
        <a
          class="page-link"
          href="javascript:;"
          :class="{ selected: currentPage === page }"
          @click="emitPageChange(page)"
        >
          {{ page }}
        </a>
      </li>

      <!-- 다음 버튼 -->
      <li class="page-item">
        <a
          class="page-link"
          :class="{ disabled: currentPage === totalPages || totalPages === 0 }"
          href="javascript:;"
          @click="goNext"
        >
          <i class="material-icons" style="font-size: 1rem">arrow_forward_ios</i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  totalCount: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  pageSize: { type: Number, default: 20 }
})

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.ceil(props.totalCount / props.pageSize))

const pageList = ref([])

/** 페이지 목록 계산 */
const settingPageNumber = () => {
  const total = totalPages.value
  const startIndex = Math.max(1, props.currentPage - 2)
  const endIndex = Math.min(total, startIndex + 4)
  pageList.value = []
  for (let i = startIndex; i <= endIndex; i++) {
    pageList.value.push(i)
  }
}

/** 이벤트 발생 */
function emitPageChange(page) {
  if (page !== props.currentPage) {
    emit('page-change', page)
  }
}

function goPrev() {
  if (props.currentPage > 1) emitPageChange(props.currentPage - 1)
}

function goNext() {
  if (props.currentPage < totalPages.value) emitPageChange(props.currentPage + 1)
}

watch(() => [props.totalCount, props.currentPage], settingPageNumber, { immediate: true })
</script>

<style scoped>
.page-link.selected {
  background-color: #007bff;
  color: white;
  border-radius: 4px;
}
.page-link.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
