<template>
  <section class="pt-3 pt-md-5 pb-md-5 pt-lg-7" :class="[isTraining ? '' : 'bg-gray-200']">
    <div class="container">
      <div class="row" :class="[isWritePage ? '' : 'write-page-margin']">
        <SideMenu class="disabled" :class="[isWritePage ? '' : 'hidden']"></SideMenu>
        <div class="col-lg-10">
          <div class="card shadow-lg mb-5">
            <CardHeader :title="title"></CardHeader>
            <div class="card card-calendar">
              <div class="card-body p-3">
                <!-- 내용 -->
                <slot></slot>
                <WriteBtnGroup @write="$emit('write')" :isWritePage="true"></WriteBtnGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SideMenu from '@/components/common/SideMenu.vue'
import CardHeader from '@/components/common/card/CardHeader.vue'
import WriteBtnGroup from '@/components/common/WriteButtonGroup.vue'
import { defineProps, computed } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  isTraining: {
    type: Boolean,
    default: false
  }
  // isWritePage: {
  //   type: Boolean,
  //   default: false
  // }
})

import { useRoute } from 'vue-router'
const route = useRoute()

const routeName = route.name

const isWritePage = computed(() => {
  return routeName !== 'write'
})
</script>

<style scoped>
@media (max-width: 991px) {
  .disabled {
    display: none;
  }
}
.btn-write {
  display: flex;
  justify-content: end;
  margin-right: 2rem;
  margin-bottom: 1rem;
}
.hidden {
  display: none;
}

.write-page-margin {
  margin-left: 11rem;
}
</style>
