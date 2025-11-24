<template>
  <div style="display: flex; justify-content: end" v-show="store.state.isLogin">
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

const props = defineProps({
  roomId: {
    type: Number,
    default: 0
  }
})

const router = useRouter()
const route = useRoute()
const store = useStore()

const queryObj = {
  name: route.name
}

if (props.roomId !== 0) {
  queryObj.roomId = props.roomId
}

function moveWritePage() {
  router.push({ name: 'photo_write', query: queryObj })
}
</script>

<style lang="scss" scoped></style>
