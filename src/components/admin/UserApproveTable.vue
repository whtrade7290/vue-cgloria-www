<template>
  <CardContainer :title="TITLE">
    <!-- Mobile Search + List -->
    <div class="d-lg-none px-3 pt-3">
      <div class="mobile-search">
        <input
          type="text"
          class="form-control form-control-sm-custom"
          :placeholder="$t('common.searchPlaceholder')"
          v-model="searchWord"
          @keyup.enter="searchUsers"
        />
        <button
          type="button"
          class="btn bg-gradient-primary btn-sm-custom mb-0"
          @click="searchUsers"
        >
          {{ $t('common.searchAction') }}
        </button>
      </div>

      <ul class="list-group list-group-flush mt-3">
        <li v-for="user in users" :key="user.id" class="list-group-item mobile-item">
          <div class="mobile-grid-row">
            <span class="mobile-label">{{ $t('table.approvePage.id') }}</span>
            <span class="mobile-value">{{ user.id }}</span>
          </div>

          <div class="mobile-grid-row">
            <span class="mobile-label">{{ $t('table.approvePage.account') }}</span>
            <span class="mobile-value">{{ user.username }}</span>
          </div>

          <div class="mobile-grid-row">
            <span class="mobile-label">{{ $t('table.approvePage.name') }}</span>
            <span class="mobile-value">{{ user.name }}</span>
          </div>

          <div class="mobile-grid-row">
            <span class="mobile-label">{{ $t('table.approvePage.role') }}</span>
            <select
              class="form-select form-select-sm mobile-role-select"
              :value="user.role"
              @change="handleRoleChange($event, user)"
            >
              <option value="USER">{{ $t('admin.userApprove.roleUser') }}</option>
              <option value="ADMIN">{{ $t('admin.userApprove.roleAdmin') }}</option>
            </select>
          </div>

          <div class="mobile-actions">
            <a
              href="javascript:;"
              class="table-action-link danger"
              @click="confirmApprove(user.id)"
            >
              {{ $t('table.approvePage.restrictAction') }}
            </a>
          </div>
        </li>

        <li v-if="users.length === 0" class="list-group-item text-center text-muted">
          {{ $t('common.noResults') }}
        </li>
      </ul>
    </div>

    <!-- Desktop Table -->
    <div class="d-none d-lg-block">
      <TableOrganisms>
        <template #header>
          <TableHead :header-list="APPROVE_DESKTOP" />
        </template>

        <template #body>
          <TableBody v-if="users.length" :body-list="users" :header-list="APPROVE_DESKTOP">
            <template #btn="{ body, header }">
              <template v-if="header.key === 'role'">
                <div class="table-select-wrapper">
                  <select
                    class="form-select form-select-sm table-role-select"
                    :value="body.role"
                    @change="handleRoleChange($event, body)"
                  >
                    <option value="USER">{{ $t('admin.userApprove.roleUser') }}</option>
                    <option value="ADMIN">{{ $t('admin.userApprove.roleAdmin') }}</option>
                  </select>
                </div>
              </template>
              <template v-else>
                <a
                  href="javascript:;"
                  class="table-action-link danger"
                  @click="confirmApprove(body.id)"
                >
                  {{ $t('table.approvePage.restrictAction') }}
                </a>
              </template>
            </template>
          </TableBody>

          <tbody v-else>
            <tr>
              <td :colspan="APPROVE_DESKTOP.length" class="no-results">
                <div class="result-container">
                  <i class="fas fa-search" aria-hidden="true"></i>
                  <p class="result-text mb-0">{{ $t('common.noResults') }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </TableOrganisms>
    </div>

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

        <li v-for="page in pageNumbers" :key="page" class="page-item">
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
            <i class="material-icons" style="font-size: 1rem" aria-hidden="true"
              >arrow_forward_ios</i
            >
          </a>
        </li>
      </ul>
    </nav>
    <div class="search-container mt-4 d-none d-lg-flex">
      <div class="search-input">
        <input
          type="text"
          class="form-control form-control-lg"
          :placeholder="$t('common.searchPlaceholder')"
          v-model="searchWord"
          @keyup.enter="searchUsers"
        />
      </div>
      <button class="btn bg-gradient-primary search-button mb-0" @click="searchUsers">
        {{ $t('common.searchAction') }}
      </button>
    </div>
  </CardContainer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

import CardContainer from '@/components/common/card/CardContainer.vue'
import TableOrganisms from '@/components/tableComponent/TableOrganisms.vue'
import TableHead from '@/components/tableComponent/TableHead.vue'
import TableBody from '@/components/tableComponent/TableBody.vue'
import { fetchApprovedUsers, updateUserRoleRequest, revokeApproveStatusRequest } from '@/api/index'
import { useI18n } from 'vue-i18n'

const TITLE = 'nav.adminPage.subTitles.userApprove'
const PAGE_SIZE = 20

const APPROVE_DESKTOP = [
  { label: 'table.approvePage.id', width: '10%', key: 'id', isSlot: false },
  { label: 'table.approvePage.account', width: '20%', key: 'username', isSlot: false },
  { label: 'table.approvePage.name', width: '20%', key: 'name', isSlot: false },
  { label: 'table.approvePage.role', width: '20%', key: 'role', isSlot: true },
  { label: 'table.approvePage.approve', width: '20%', key: 'isApproved', isSlot: true }
]

const searchWord = ref('')
const currentPage = ref(1)
const totalCount = ref(0)
const users = ref([])
const isProcessing = ref(false)

const totalPages = computed(() => {
  const total = Math.ceil(totalCount.value / PAGE_SIZE)
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

const isFirstPage = computed(() => currentPage.value === 1)
const isLastPage = computed(() => currentPage.value === totalPages.value)

const loadUsers = async () => {
  try {
    const response = await fetchApprovedUsers({
      startRow: (currentPage.value - 1) * PAGE_SIZE,
      pageSize: PAGE_SIZE,
      searchWord: searchWord.value
    })

    if (Array.isArray(response?.data)) {
      users.value = response.data
      totalCount.value = response.data.length
    } else if (response?.data) {
      totalCount.value = response.data.count ?? 0
      users.value = response.data.list ?? []
    } else {
      totalCount.value = 0
      users.value = []
    }
  } catch (error) {
    console.error('Failed to fetch approved users', error)
    await Swal.fire({
      icon: 'error',
      title: t('admin.manageWithDiary.fetchError')
    })
  }
}

const { t } = useI18n()

const searchUsers = async () => {
  currentPage.value = 1
  await loadUsers()
}

async function confirmApprove(id) {
  if (isProcessing.value) return

  const result = await Swal.fire({
    title: t('modalMsg.restrictConfirm'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('button.confirm'),
    cancelButtonText: t('button.cancel')
  })

  if (!result.isConfirmed) {
    return
  }

  try {
    isProcessing.value = true

    const response = await revokeApproveStatusRequest(id)

    if (response?.data) {
      await Swal.fire({
        icon: 'success',
        title: t('modalMsg.restrictSuccess')
      })
      await loadUsers()
    } else {
      throw new Error('Empty response')
    }
  } catch (error) {
    console.error('Failed to update approve status', error)
    await Swal.fire({
      icon: 'error',
      title: t('modalMsg.restrictFail')
    })
  } finally {
    isProcessing.value = false
  }
}

const handleRoleChange = async (event, user) => {
  const newRole = event.target.value
  if (newRole === user.role) return

  const confirm = await Swal.fire({
    icon: 'question',
    title: t('admin.userApprove.roleLabel'),
    html: `<p>${user.username} → ${newRole}</p>`,
    showCancelButton: true,
    confirmButtonText: t('button.confirm'),
    cancelButtonText: t('button.cancel')
  })

  if (!confirm.isConfirmed) {
    event.target.value = user.role
    return
  }

  try {
    await updateUserRoleRequest({ id: user.id, role: newRole })
    await Swal.fire({
      icon: 'success',
      title: t('admin.userApprove.roleSuccess')
    })
    await loadUsers()
  } catch (error) {
    console.error('Failed to update role', error)
    event.target.value = user.role
    await Swal.fire({
      icon: 'error',
      title: t('admin.userApprove.roleFail')
    })
  }
}

async function changePage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }

  currentPage.value = page
  await loadUsers()
}

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

<style scoped>
.table-action-link {
  color: #475569;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
}
.table-action-link:hover {
  opacity: 0.9;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1 1 300px;
  max-width: 400px;
  min-width: 220px;
}

.search-button {
  min-width: 120px;
  height: 46px;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-button {
    width: 100%;
  }
}

/* ===== 모바일 검색 ===== */
.mobile-search {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.form-control-sm-custom {
  flex: 1;
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

/* ===== 모바일 카드 ===== */
.mobile-item {
  padding: 1rem 0.9rem;
  background-color: #fff;
  border-radius: 0.75rem;
  margin-bottom: 0.85rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0; /* list-group border 제거 */
}

/* ✅ 2열 그리드: 왼쪽 라벨 고정폭 + 오른쪽 값 유동 */
.mobile-grid-row {
  display: grid;
  grid-template-columns: 92px 1fr; /* 라벨 폭 고정 */
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0;
}

.mobile-label {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.2;
  word-break: keep-all; /* 한글/일본어 라벨 찢김 방지 */
}

.mobile-value {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.2;
  text-align: right;

  /* 값이 길 때 UI 안 깨지게 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ✅ select도 오른쪽 칸에 딱 맞게 */
.mobile-role-select {
  width: 100%;
  max-width: 100px;
  margin-left: auto; /* 오른쪽 정렬 */
}

/* 액션 */
.mobile-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
}

/* 아주 작은 화면은 라벨폭 조금 줄임 */
@media (max-width: 360px) {
  .mobile-grid-row {
    grid-template-columns: 78px 1fr;
  }
}
</style>
