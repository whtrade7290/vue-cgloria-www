<template>
  <div class="wrapper">
    <LoadingSpinner v-if="isLoading" />
    <NavBarVue :key="navBarKey"></NavBarVue>
    <router-view class="main-content"></router-view>
    <FooterComponentVue></FooterComponentVue>
  </div>
</template>

<script setup>
import NavBarVue from './components/common/NavBar.vue'
import FooterComponentVue from './components/common/FooterComponent.vue'
import { computed } from 'vue'
import LoadingSpinner from './components/common/LoadingSpinner.vue'
import { useStore } from 'vuex'

const store = useStore()

const isLoading = computed(() => store.getters.isGlobalLoading)

const navBarKey = computed(() => {
  // 로그인 상태나 role이 변경되면 NavBar를 다시 마운트
  return `${store.state.isLogin}-${store.state.role}`
})
</script>

<style>
@import url('@/assets/css/nucleo-icons.css');
@import url('@/assets/css/nucleo-svg.css');
@import url('@/assets/css/soft-design-system.css');

:root {
  --gloria-primary: #f5c6aa;
  --gloria-primary-light: #f7e7dc;
  --gloria-primary-dark: #0f2854;
  --gloria-primary-shadow: rgba(245, 198, 170, 0.35);
  --gloria-gradient-primary: linear-gradient(
    310deg,
    var(--gloria-primary-light) 0%,
    var(--gloria-primary) 100%
  );
}

.main-content {
  flex: 1; /* 콘텐츠가 화면보다 짧을 경우, footer를 아래로 밀어줌 */
}
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f6f6f6;
}
html,
body {
  height: 100%;
  margin: 0;
  font-family: 'Nanum Gothic', 'Hiragino Kaku Gothic Pro', 'Noto Sans JP', sans-serif;
}
</style>
