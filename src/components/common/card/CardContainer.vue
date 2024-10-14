<template>
  <section
    class="pt-3 pt-md-5 pb-md-5 pt-lg-7 mt-5 mb-7"
    style="border-radius: 1.5rem; background-color: #f6f6f6"
  >
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

defineProps({
  title: {
    type: String,
    default: ''
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
