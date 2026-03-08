<template>
  <div v-show="store.state.isLogin" style="display: flex; justify-content: end">
    <a
      href="javascript:;"
      class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
      @click="moveWritePage"
    >
      {{ $t('button.write') }}</a
    >
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'

const props = defineProps({
  roomId: {
    type: Number,
    default: 0
  }
})

const router = useRouter()
const route = useRoute()
const store = useStore()

const queryObj = computed(() => {
  const query = {
    name: route.name
  }
  if (props.roomId) {
    query.roomId = props.roomId
  }
  return query
})

function moveWritePage() {
  router.push({ name: 'write', query: queryObj.value })
}
</script>

<style lang="scss" scoped></style>
