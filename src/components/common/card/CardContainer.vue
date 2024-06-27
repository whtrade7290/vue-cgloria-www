<template>
  <section class="pt-3 pt-md-5 pb-md-5 pt-lg-7" :class="[isTraining ? '' : 'bg-gray-200']">
    <div class="container">
      <div class="row">
        <SideMenu class="display-sideMenu"></SideMenu>
        <div class="col-lg-10">
          <div class="card shadow-lg mb-5">
            <CardHeader :title="title"></CardHeader>
            <div class="card card-calendar">
              <div class="card-body p-3">
                <slot></slot>
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

import { computed } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  isTraining: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.btn-write {
  display: flex;
  justify-content: end;
  margin-right: 2rem;
  margin-bottom: 1rem;
}

@media (max-width: 991px) {
  .display-sideMenu {
    margin-top: 3rem;
  }
}
@media (max-width: 767px) {
  .display-sideMenu {
    margin-top: 5rem;
  }
}
</style>
