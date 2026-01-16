<template>
  <CardContainer :title="TITLE">
    <TableOrganisms>
      <template #header>
        <TableHead :header-list="APPROVE" />
      </template>

      <template #body>
        <TableBody
          v-if="paginatedUsers.length"
          :body-list="paginatedUsers"
          :header-list="APPROVE"
        >
          <template #btn="{ body }">
            <button
              class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
              @click="confirmApprove(body.id)"
            >
              승인
            </button>
          </template>
        </TableBody>

        <tbody v-else>
          <tr>
            <td :colspan="APPROVE.length" class="no-results">
              <div class="result-container">
                <i class="fas fa-search" aria-hidden="true"></i>
                <p class="result-text mb-0">{{ $t('common.noResults') }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </TableOrganisms>

    <nav aria-label="User approval pagination">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a
            class="page-link"
            :class="{ disabled: isFirstPage }"
            href="javascript:;"
            @click="changePage(currentPage - 1)"
          >
            <i class="fa fa-angle-left" aria-hidden="true"></i>
            <i class="material-icons" style="font-size: 1rem" aria-hidden="true">arrow_back_ios</i>
          </a>
        </li>

        <li
          v-for="page in pageNumbers"
          :key="page"
          class="page-item"
        >
          <a
            class="page-link"
            :class="{ selected: page === currentPage }"
            href="javascript:;"
            @click="changePage(page)"
          >
            {{ page }}
          </a>
        </li>

        <li class="page-item">
          <a
            class="page-link"
            :class="{ disabled: isLastPage }"
            href="javascript:;"
            @click="changePage(currentPage + 1)"
          >
            <i class="fa fa-angle-right" aria-hidden="true"></i>
            <i class="material-icons" style="font-size: 1rem" aria-hidden="true">arrow_forward_ios</i>
          </a>
        </li>
      </ul>
    </nav>
  </CardContainer>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Swal from 'sweetalert2'

import CardContainer from '@/components/common/card/CardContainer.vue'
import TableOrganisms from '@/components/tableComponent/TableOrganisms.vue'
import TableHead from '@/components/tableComponent/TableHead.vue'
import TableBody from '@/components/tableComponent/TableBody.vue'
import { APPROVE } from '@/data/table'
import { fetchDisapproveUsers, updateApproveStatus } from '@/api/index'

const TITLE = 'nav.adminPage.subTitles.approvePage'
const PAGE_SIZE = 20

const pendingUsers = ref([])
const currentPage = ref(1)
const isProcessing = ref(false)

const totalPages = computed(() => {
  const total = Math.ceil(pendingUsers.value.length / PAGE_SIZE)
  return total > 0 ? total : 1
})

const pageNumbers = computed(() => {
  const pages = []
  const count = totalPages.value
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(count, start + 4)

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  return pages
})

const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * PAGE_SIZE
  return pendingUsers.value.slice(startIndex, startIndex + PAGE_SIZE)
})

const isFirstPage = computed(() => currentPage.value === 1)
const isLastPage = computed(() => currentPage.value === totalPages.value)

async function loadUsers() {
  try {
    const response = await fetchDisapproveUsers()

    pendingUsers.value = Array.isArray(response?.data) ? response.data : []
    currentPage.value = 1
  } catch (error) {
    console.error('Failed to fetch disapprove users', error)
    await Swal.fire({
      icon: 'error',
      title: '목록을 불러오지 못했습니다.',
      text: '잠시 후 다시 시도해주세요.'
    })
  }
}

async function confirmApprove(id) {
  if (isProcessing.value) return

  const result = await Swal.fire({
    title: '회원가입을 승인하시겠습니까?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '승인',
    cancelButtonText: '취소'
  })

  if (!result.isConfirmed) {
    return
  }

  try {
    isProcessing.value = true

    const response = await updateApproveStatus(id)

    if (response?.data) {
      await Swal.fire({
        icon: 'success',
        title: '승인되었습니다.'
      })
      pendingUsers.value = pendingUsers.value.filter((user) => user.id !== id)
    } else {
      throw new Error('Empty response')
    }
  } catch (error) {
    console.error('Failed to update approve status', error)
    await Swal.fire({
      icon: 'error',
      title: '승인에 실패했습니다.',
      text: '잠시 후 다시 시도해주세요.'
    })
  } finally {
    isProcessing.value = false
  }
}

function changePage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }

  currentPage.value = page
}

watch(
  () => pendingUsers.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  }
)

onMounted(async () => {
  await loadUsers()
})
</script>

<style scoped>
.no-results {
  padding: 2rem 0;
  text-align: center;
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #8392ab;
}

.result-text {
  font-size: 0.95rem;
}

@media (max-width: 576px) {
  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}
</style>
