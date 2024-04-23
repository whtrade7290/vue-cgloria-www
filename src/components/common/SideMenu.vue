<template>
  <div class="col-lg-2 mb-lg-0 mb-2">
    <ul class="nav flex-column bg-white border-radius-lg p-3 position-sticky top-1">
      <li
        class="nav-item"
        :class="[isActive ? selected : '']"
        v-for="(menu, inx) in sidemenu"
        :key="inx"
      >
        <div></div>
        <router-link class="nav-link text-dark" data-scroll="" href="#general-terms">
          <div class="icon me-2">
            <i class="material-icons" style="font-size: 1rem">{{ menu.icon }}</i>
          </div>
          {{ menu.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()
const sidemenu = store.state.sidemenu

console.log(sidemenu)
</script>

<style scoped>
.selected {
  background-color: red;
}
</style>
