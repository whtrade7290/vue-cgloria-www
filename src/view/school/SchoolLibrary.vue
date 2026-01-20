<template>
  <CardContainer :title="obj.title">
    <TableComponent
      :called="route.name"
      :items="items"
      :total-count="totalCount"
      :page="pageNum"
      :page-size="pageSize"
      :search-value="searchWord"
      :loading="loading"
      @page-change="handlePageChange"
      @search="handleSearch"
    ></TableComponent>
    <WriteButton></WriteButton>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import TableComponent from '@/components/common/table/TableComponent.vue'
import WriteButton from '@/components/common/WriteButton.vue'
import { useStore } from 'vuex'
import { SCHOOL } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useBoardList } from '@/composables/useBoardList'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', SCHOOL)
obj.value = SCHOOL.find((o) => route.name === o.path)

const {
  items,
  totalCount,
  pageNum,
  pageSize,
  searchWord,
  loading,
  handlePageChange,
  handleSearch
} = useBoardList('sunday_school_resource')
</script>

<style lang="scss" scoped></style>
