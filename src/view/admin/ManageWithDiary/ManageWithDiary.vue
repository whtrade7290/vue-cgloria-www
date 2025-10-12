<template>
  <CardContainer :title="TITLE">
    <TableOrganisms>
      <template #header>
        <TableHead :header-list="MANAGE_WITHDIARY"></TableHead>
      </template>
      <template #body>
        <TableBody :body-list="store.state.rooms" :header-list="MANAGE_WITHDIARY">
          <template #btn="{ body, header }">
            <template v-if="header.key === 'member'">
              <button
                class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                @click="checkMember(body.id)"
              >
                구성원
              </button>
            </template>
            <template v-else>
              <button
                class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                @click="deleteRoom(body.id)"
              >
                삭제
              </button>
            </template>
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

import { MANAGE_WITHDIARY } from '@/data/table'
import { useRoute } from 'vue-router'
import { ADMIN } from '@/data/sidemenu.js'
import { useStore } from 'vuex'
import { ref } from 'vue'
import ko from '@/locales/ko.json'

const TITLE = 'nav.adminPage.subTitles.approvePage'
const route = useRoute()
const store = useStore()

const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', ADMIN)
obj.value = ADMIN.find((o) => route.name === o.path)

const checkMember = async (id) => {
  console.log('id: ', id)
}
const deleteRoom = async (id) => {
  console.log('id: ', id)
}
</script>

<style lang="scss" scoped></style>
