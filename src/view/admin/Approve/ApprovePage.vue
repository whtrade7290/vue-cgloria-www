<template>
  <CardContainer :title="TITLE">
    <TableOrganisms>
      <template #header>
        <TableHead :header-list="APPROVE"></TableHead>
      </template>
      <template #body>
        <TableBody :body-list="store.state.disapproveUsers" :header-list="APPROVE">
          <template #btn="{ body }">
            <button
              class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
              @click="approve(body.id)"
            >
              승인
            </button>
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

const TITLE = 'nav.adminPage.subTitles.approvePage'

const route = useRoute()
const store = useStore()

const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', ADMIN)
obj.value = ADMIN.find((o) => route.name === o.path)

const approve = async (id) => {
  Swal.fire({
    title: '회원가입을 승인하시겠습니까?',
    icon: 'question',
    showCancelButton: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      const updatedUser = await store.dispatch('UPDATE_APPROVE_STATUS', id)

      if (updatedUser) {
        await Swal.fire({
          title: '승인되었습니다.',
          icon: 'success'
        })
        await store.dispatch('FIND_DISAPPROVE_USERS')
      } else {
        await Swal.fire({
          title: '실패하였습니다.',
          icon: 'error'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped></style>
