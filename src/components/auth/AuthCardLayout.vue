<template>
  <section class="auth-card-layout">
    <div class="page-header min-vh-100">
      <div class="container py-6">
        <div class="row justify-content-center">
          <div class="col-xl-5 col-lg-6 col-md-8">
            <div class="card card-plain shadow-sm border-0">
              <div v-if="title || description" class="card-header pb-0 text-left border-0 bg-transparent">
                <h4 v-if="title" class="font-weight-bolder">{{ title }}</h4>
                <p v-if="description" class="mb-0 text-muted">
                  <slot name="description">
                    {{ description }}
                  </slot>
                </p>
              </div>
              <div class="card-body">
                <slot />
              </div>
            </div>
          </div>
          <slot name="sidebar" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.auth-card-layout .page-header {
  background-color: #f8f9fa;
  padding-top: 6rem;
  padding-bottom: 4rem;
}
.auth-card-layout .card {
  border-radius: 1rem;
}
.auth-card-layout .card-header h4 {
  font-size: 1.5rem;
}
@media (max-width: 991px) {
  .auth-card-layout .page-header {
    padding-top: 4rem;
  }
}
</style>
