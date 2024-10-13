<template>
  <CardContainer title="nav.subTitle7.approvePage">
    <div class="table-responsive p-0">
      <table class="table align-items-center justify-content-center mb-3">
        <thead>
          <tr>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
              style="width: 10%; text-align: center"
            >
              {{ $t('table.approvePage.id') }}
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              style="width: 20%; text-align: center"
            >
              {{ $t('table.approvePage.account') }}
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
              style="width: 20%; text-align: center"
            >
              {{ $t('table.approvePage.name') }}
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
              style="width: 20%; text-align: center"
            >
              {{ $t('table.approvePage.role') }}
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
              style="width: 20%; text-align: center"
            >
              {{ $t('table.approvePage.approve') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in store.state.disapproveUsers" :key="idx">
            <td style="width: 10%; text-align: center">
              <p class="text-sm font-weight-bold mb-0 text-center">{{ item.id }}</p>
            </td>
            <td style="width: 20%; text-align: center">
              <p class="text-sm font-weight-bold mb-0">{{ item.username }}</p>
            </td>
            <td style="width: 20%; text-align: center">
              <p class="text-sm font-weight-bold mb-0 text-center">
                {{ item.name || item.username }}
              </p>
            </td>
            <td style="width: 20%; text-align: center">
              <p class="text-sm font-weight-bold mb-0 text-center">{{ item.role }}</p>
            </td>
            <td style="width: 20%; text-align: center">
              <p class="text-sm font-weight-bold mb-0 text-center">
                <button
                  class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                  @click="approve(item.id)"
                >
                  승인
                </button>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { ADMIN } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import Swal from 'sweetalert2'

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
