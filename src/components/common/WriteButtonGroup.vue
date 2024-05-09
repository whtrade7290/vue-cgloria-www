<template>
  <div class="btn-write">
    <div v-if="checkUserRole">
      <router-link
        class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
        to="/write"
        >글작성</router-link
      >
    </div>
    <div v-if="isWritePage" style="margin-top: 1rem; margin-left;: 2.5rem">
      <a
        class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
        href="javascript:;"
        @click="$emit('write')"
        >글작성</a
      >
      <a class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0" href="javascript:;"
        >글수정</a
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const routeName = route.name

const isWritePage = computed(() => {
  return routeName === 'write'
})

const checkUserRole = computed(() => {
  const userRole = JSON.parse(sessionStorage?.getItem(1)).role
  return userRole === '0' && userRole && !isWritePage.value
})
</script>

<style lang="scss" scoped></style>
