<template>
  <CardContainer :title="obj.title">
    <TableComponent :called="route.name"></TableComponent>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import TableComponent from '@/components/common/table/TableComponent.vue'
import { useStore } from 'vuex'
import { SCHOOL } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', SCHOOL)
obj.value = SCHOOL.find((o) => route.name === o.path)
console.log('excute')
</script>

<style lang="scss" scoped></style>
