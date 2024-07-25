<template>
  <div style="display: flex; justify-content: end" v-show="!store.state.isLogIned">
    <a
      href="javascript:;"
      class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
      @click="moveWritePage"
    >
      글작성</a
    >
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()

function moveWritePage() {
  if (route.name === 'photo' || route.name === 'school_photo') {
    router.push({ name: 'photo_write', query: { name: route.name } })
  } else {
    router.push({ name: 'write', query: { name: route.name } })
  }
}
</script>

<style lang="scss" scoped></style>
