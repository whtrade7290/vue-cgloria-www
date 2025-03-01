<template>
  <div class="col-lg-2 mb-lg-0 mb-3">
    <ul class="nav flex-column bg-white border-radius-lg p-3 position-sticky top-1">
      <li class="nav-item" v-for="(menu, inx) in sidemenu" :key="inx">
        <div v-bind:class="[route.name === menu.path ? 'selected' : '']">
          <router-link
            :to="{ name: menu.path, params: {} }"
            class="nav-link text-dark"
            data-scroll=""
            href="#general-terms"
          >
            <div class="icon me-2">
              <i class="material-icons" style="font-size: 1rem">{{ menu.icon }}</i>
            </div>
            {{ $t(menu.title) }}
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useStore()
const sidemenu = store.state.sidemenu
</script>

<style scoped>
.selected {
  background-color: #dddddd;
  border-radius: 0.5rem;
}
</style>
