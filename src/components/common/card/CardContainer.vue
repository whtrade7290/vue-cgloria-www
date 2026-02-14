<template>
  <section class="pt-3 pt-md-5 pb-md-5 pt-lg-7 mt-5 mb-7">
    <div class="container">
      <div class="row">
        <SideMenu class="display-sideMenu"></SideMenu>
        <div class="col-lg-9">
          <div class="card shadow-lg mb-5">
            <CardHeader :title="title" :translate-title="translateTitle"></CardHeader>
            <div class="card card-calendar p-3">
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

defineProps({
  title: {
    type: String,
    default: ''
  },
  translateTitle: {
    type: Boolean,
    default: true
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

.display-sideMenu {
  height: 100%;
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
