<template>
  <header class="header-2">
    <div
      class="page-header min-vh-75 relative main-bg"
      :style="isMobile ? {} : { backgroundImage: `url(${imgUrl})` }"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-7mx-auto">
            <h1 class="text-white gugi-regular" style="font-size: 1.5rem">{{ sub_msg }}</h1>
            <p
              class="text-white gugi-regular"
              style="margin-top: -1.5rem"
              :class="[sub_msg === '예수동행일기' ? 'diary-font' : 'main-font']"
            >
              {{ main_msg }}
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
import { onBeforeMount, onMounted, ref } from 'vue'

defineProps({
  main_msg: {
    type: String,
    default: ''
  },
  sub_msg: {
    type: String,
    default: ''
  },
  imgUrl: {
    type: String,
    default: ''
  }
})

const isMobile = ref(false)

function checkIsMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onBeforeMount(() => {
  window.removeEventListener('resize', checkIsMobile)
})

// const styleProps = ref({
//   backgroundImage: `url(${props.imgUrl})`
// })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Gugi&family=Jua&display=swap');

.jua-regular {
  font-family: 'Jua', sans-serif;
  font-weight: 400;
  font-style: normal;
}
.gugi-regular {
  font-family: 'Gugi', sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #f5c6aa;
  text-shadow: 2px 2px #000;
}

.training-img-effect {
  background-color: rgba(0, 0, 0, 0.7);
  background-size: cover;
  background-blend-mode: multiply;
}

.diary-font {
  font-size: 5rem;
  font-weight: bold;
}

.main-bg {
  background-image: linear-gradient(310deg, #f5c6aa, #f7e7dc);
}

.main-font {
  font-size: 4vh;
  font-weight: bold;
}

@media (min-width: 768px) {
  .main-font {
    font-size: 5vh;
    font-weight: bold;
  }
}

@media (min-width: 1200px) {
  .main-font {
    font-size: 6.5vh;
    font-weight: bold;
  }
}
</style>
