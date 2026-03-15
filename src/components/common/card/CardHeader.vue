<template>
  <div class="card-header bg-gradient-primary p-5 position-relative">
    <h3 class="text-white mb-0 do-hyeon-regular">
      {{ translateTitle ? $t(title) : `${$t('nav.withDiary.title')} - ${title}` }}
    </h3>
  </div>
</template>

<script setup>
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
.card-header {
  margin-bottom: 3rem;
  padding-bottom: 5rem;
  overflow: hidden;
}

.card-header h3 {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
}

.header-waves {
  margin-top: 2.5rem;
  bottom: -55px !important;
  z-index: 1 !important;
}
.do-hyeon-regular {
  font-weight: 700;
  font-style: normal;
  letter-spacing: 0.02em;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.35);
}
</style>
