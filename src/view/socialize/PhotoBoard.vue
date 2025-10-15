<template>
  <CardContainer :title="obj.title">
    <PhotoTableComponentVue :called="route.name"></PhotoTableComponentVue>
    <WriteButton :isPhoto="true"></WriteButton>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import WriteButton from '@/components/common/WriteButton.vue'
import { useStore } from 'vuex'
import { SOCIALIZE } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import PhotoTableComponentVue from '@/components/common/table/PhotoTableComponent.vue'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', SOCIALIZE)
obj.value = SOCIALIZE.find((o) => route.name === o.path)
</script>

<style lang="scss" scoped></style>
