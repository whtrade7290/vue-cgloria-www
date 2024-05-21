<template>
  <CardContainer :title="obj.title">
    <TableComponent :called="route.name"></TableComponent>
    <WriteButton></WriteButton>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import TableComponent from '@/components/common/table/TableComponent.vue'
import WriteButton from '@/components/common/WriteButton.vue'
import { useStore } from 'vuex'
import { SMALLGROUP } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', SMALLGROUP)
obj.value = SMALLGROUP.find((o) => route.name === o.path)
</script>

<style lang="scss" scoped></style>
