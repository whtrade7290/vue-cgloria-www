<template>
  <LoadingSpinner v-if="isLoading" />
  <NavBarVue></NavBarVue>
  <router-view></router-view>
  <FooterComponentVue></FooterComponentVue>
</template>

<script setup>
import NavBarVue from './components/common/NavBar.vue'
import FooterComponentVue from './components/common/FooterComponent.vue'
import { nextTick, onMounted, ref } from 'vue'
import LoadingSpinner from './components/common/LoadingSpinner.vue'

const isLoading = ref(true)

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

// watch(
//   () => route.fullPath,
//   async () => {
//     isLoading.value = true
//     await nextTick().then(() => {
//       isLoading.value = false
//     })
//   },
//   { deep: true }
// )
</script>

<style>
@import url('@/assets/css/nucleo-icons.css');
@import url('@/assets/css/nucleo-svg.css');
@import url('@/assets/css/soft-design-system.css');
</style>
