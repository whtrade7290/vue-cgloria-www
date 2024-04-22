<script setup>
import NavBarVue from './components/common/NavBar.vue'
import FooterComponentVue from './components/common/FooterComponent.vue'
// import router from './routes'
</script>

<template>
  <div>
    <NavBarVue></NavBarVue>
    <router-view></router-view>
    <FooterComponentVue></FooterComponentVue>
  </div>
</template>

<style>
@import url('@/assets/css/nucleo-icons.css');
@import url('@/assets/css/nucleo-svg.css');
@import url('@/assets/css/soft-design-system.css');
</style>
