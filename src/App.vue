<template>
  <div class="wrapper">
    <LoadingSpinner v-if="isLoading" />
    <NavBarVue></NavBarVue>
    <router-view class="main-content"></router-view>
    <FooterComponentVue></FooterComponentVue>
  </div>
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

html,
body {
  height: 100%;
  margin: 0;
}
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f6f6f6;
}
.main-content {
  flex: 1; /* 콘텐츠가 화면보다 짧을 경우, footer를 아래로 밀어줌 */
}
</style>
