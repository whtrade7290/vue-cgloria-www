<template>
  <header class="header-2">
    <div class="page-header min-vh-75 relative back-img">
      <div class="container">
        <div class="row">
          <div class="col-lg-7mx-auto">
            <h1 class="text-white pt-3 mt-n5">말씀과 동행하는 교회</h1>
            <p class="lead text-white mt-3">
              말씀훈련을 통해 한 사람 한 사람을 예수님의 제자로 세우는 건강한 교회
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

<script setup></script>

<style scoped>
.back-img {
  background-image: url('@/assets/img/main/main01.jpg');
}
</style>
