<template>
  <header class="header-2">
    <div
      class="page-header min-vh-75 relative"
      :class="[isTraining ? 'training-img-effect' : 'main-back-img']"
      :style="{ backgroundImage: 'url(' + imgUrl + ')' }"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-7mx-auto">
            <h1 class="text-white pt-3 mt-n5">{{ main_msg }}</h1>
            <p class="lead text-white mt-3">
              {{ sub_msg }}
            </p>
          </div>
        </div>
      </div>

      <div class="position-absolute w-100 z-index-1 bottom-0">
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 40"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g class="moving-waves">
            <use xlink:href="#gentle-wave" x="48" y="-1" fill="rgba(255,255,255,0.40" />
            <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.35)" />
            <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.25)" />
            <use xlink:href="#gentle-wave" x="48" y="8" fill="rgba(255,255,255,0.20)" />
            <use xlink:href="#gentle-wave" x="48" y="13" fill="rgba(255,255,255,0.15)" />
            <use xlink:href="#gentle-wave" x="48" y="16" fill="rgba(255,255,255,0.95" />
          </g>
        </svg>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  main_msg: {
    type: String,
    default: ''
  },
  sub_msg: {
    type: String,
    default: ''
  },
  isTraining: {
    type: Boolean,
    default: false
  },
  imgUrl: {
    type: String,
    default: ''
  }
})

console.log('props: ', props.imgUrl)
</script>

<style scoped>
.training-img-effect {
  background-color: rgba(0, 0, 0, 0.7);
  background-size: cover;
  background-blend-mode: multiply;
}
.main-back-img {
  background-image: url('@/assets/img/main/main01.jpg');
}
</style>
