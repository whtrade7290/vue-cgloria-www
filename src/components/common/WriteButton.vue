<template>
  <div style="display: flex; justify-content: end">
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

const router = useRouter()
const route = useRoute()

function moveWritePage() {
  router.push({ name: 'write', query: { name: route.name } })
}
</script>

<style lang="scss" scoped></style>
