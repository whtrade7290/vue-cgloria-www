<template>
  <div class="row">
    <div
      class="col-lg-3 col-sm-6"
      style="padding: 20px 30px 0 30px"
      v-for="(item, idx) in store.state.dataList"
      :key="idx"
    >
      <div class="card card-plain card-blog">
        <div class="card-image border-radius-lg position-relative">
          <a href="javascript:;">
            <img class="w-100 border-radius-lg move-on-hover shadow" :src="item.img_url" />
          </a>
        </div>
        <div class="card-body px-0" style="padding: 10px 0 0 0">
          <span>
            <a href="javascript:;" class="text-dark font-weight-bold">{{ item.title }}</a>
          </span>
        </div>
        <span>
          <a href="javascript:;" class="text-dark" style="font-size: 14px; line-height: 16px">{{
            item.date
          }}</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()

const props = defineProps({
  called: {
    type: String,
    default: ''
  }
})
store.dispatch('FETCH_BOARDLIST', props.called)

console.log(store.state.dataList)
</script>

<style lang="scss" scoped></style>
