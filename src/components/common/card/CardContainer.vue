<template>
  <section class="pt-3 pt-md-5 pb-md-5 pt-lg-7" :class="[isTraining ? '' : 'bg-gray-200']">
    <div class="container">
      <div class="row">
        <SideMenu class="disabled"></SideMenu>
        <div class="col-lg-10">
          <div class="card shadow-lg mb-5">
            <CardHeader :title="title"></CardHeader>
            <div class="card card-calendar">
              <div class="card-body p-3">
                <!-- 내용 -->
                <slot></slot>
                <div class="btn-write">
                  <div>
                    <router-link
                      class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                      to="/write"
                      >글작성</router-link
                    >
                  </div>
                </div>
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
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  isTraining: {
    type: Boolean,
    default: false
  },
  isWritePage: {
    type: Boolean,
    default: false
  }
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
</style>
