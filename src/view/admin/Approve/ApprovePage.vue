<template>
  <CardContainer :title="TITLE">
    <!-- Mobile Cards -->
    <div class="d-lg-none px-3 pt-3">
      <ul class="list-group list-group-flush">
        <li
          v-for="user in store.state.disapproveUsers"
          :key="user.id"
          class="list-group-item mobile-item"
        >
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
            <span class="mobile-value">{{ user.role }}</span>
          </div>
          <div class="mobile-actions">
            <a href="javascript:;" class="table-action-link" @click="approve(user.id)">
              {{ $t('table.approvePage.approveAction') }}
            </a>
          </div>
        </li>
        <li v-if="!store.state.disapproveUsers.length" class="list-group-item">
          <p class="result-text mb-0 text-center">{{ $t('common.noResults') }}</p>
        </li>
      </ul>
    </div>

    <!-- Desktop Table -->
    <div class="d-none d-lg-block">
      <TableOrganisms>
        <template #header>
          <TableHead :header-list="APPROVE"></TableHead>
        </template>
        <template #body>
          <TableBody :body-list="store.state.disapproveUsers" :header-list="APPROVE">
            <template #btn="{ body }">
              <a href="javascript:;" class="table-action-link" @click="approve(body.id)">
                {{ $t('table.approvePage.approveAction') }}
              </a>
            </template>
          </TableBody>
        </template>
      </TableOrganisms>
    </div>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import TableOrganisms from '@/components/tableComponent/TableOrganisms.vue'
import TableBody from '@/components/tableComponent/TableBody.vue'
import TableHead from '@/components/tableComponent/TableHead.vue'

import { APPROVE } from '@/data/table'
import { useRoute } from 'vue-router'
import { ADMIN } from '@/data/sidemenu.js'
import { useStore } from 'vuex'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'

const TITLE = 'nav.adminPage.subTitles.approvePage'

const route = useRoute()
const store = useStore()

const obj = ref(null)
const { t } = useI18n()
store.dispatch('FETCH_SIDEMENU', ADMIN)
obj.value = ADMIN.find((o) => route.name === o.path)

const approve = async (id) => {
  Swal.fire({
    title: t('modalMsg.approveConfirm'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('button.confirm'),
    cancelButtonText: t('button.cancel')
  }).then(async (result) => {
    if (result.isConfirmed) {
      const updatedUser = await store.dispatch('APPROVE_USER', id)

      if (updatedUser) {
        await Swal.fire({
          title: t('modalMsg.approveSuccess'),
          icon: 'success'
        })
        await store.dispatch('FIND_DISAPPROVE_USERS')
      } else {
        await Swal.fire({
          title: t('modalMsg.approveFail'),
          icon: 'error'
        })
      }
    }
  })
}
</script>

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
.mobile-item {
  padding: 1rem 0.9rem;
  background: #fff;
  border-radius: 0.75rem;
  margin-bottom: 0.85rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0;
}
.mobile-grid-row {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.35rem 0;
}
.mobile-label {
  font-size: 0.8rem;
  color: #6b7280;
}
.mobile-value {
  font-weight: 600;
  font-size: 0.95rem;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mobile-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
}
.result-text {
  color: #94a3b8;
}
@media (max-width: 360px) {
  .mobile-grid-row {
    grid-template-columns: 78px 1fr;
  }
}
</style>
