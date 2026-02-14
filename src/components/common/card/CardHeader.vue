<template>
  <div class="card-header bg-gradient-primary p-5 position-relative">
    <h3 class="text-white mb-0 do-hyeon-regular">
      {{ translateTitle ? $t(title) : title }}
    </h3>
    <div class="position-absolute w-100 z-index-1 bottom-0 ms-n5 header-waves">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 40"
        preserveAspectRatio="none"
        shape-rendering="auto"
        style="height: 7vh; min-height: 50px"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          ></path>
        </defs>
        <g>
          <use xlink:href="#gentle-wave" x="48" y="-1" fill="rgba(255,255,255,0.40"></use>
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.35)"></use>
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.25)"></use>
          <use xlink:href="#gentle-wave" x="48" y="8" fill="rgba(255,255,255,0.20)"></use>
          <use xlink:href="#gentle-wave" x="48" y="13" fill="rgba(255,255,255,0.15)"></use>
          <use xlink:href="#gentle-wave" x="48" y="16" fill="rgba(255,255,255,0.95"></use>
        </g>
      </svg>
    </div>
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
