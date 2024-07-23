<template>
  <!-- <HeaderComponent
    main_msg="제자훈련 15기"
    sub_msg="그러므로 너희는 가서 모든 민족을 제자로 삼아 내가 너희에게 분부한 것을 가르쳐 지키게 하라"
    :isTraining="true"
  ></HeaderComponent> -->
  <CardContainer :title="obj.title" :isTraining="true">
    <TableComponent :isTraining="true" :called="route.name"></TableComponent>
  </CardContainer>
</template>

<script setup>
// import HeaderComponent from '@/components/main/HeaderComponent.vue'
import CardContainer from '@/components/common/card/CardContainer.vue'
import TableComponent from '@/components/common/table/TableComponent.vue'
import { useStore } from 'vuex'
import { TRAINING } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', TRAINING)
obj.value = TRAINING.find((o) => route.name === o.path)
</script>

<style lang="scss" scoped></style>
