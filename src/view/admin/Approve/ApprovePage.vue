<template>
  <CardContainer :title="TITLE">
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
</style>
