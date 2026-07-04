<template>
  <section>
    <div class="container mt-sm-5">
      <div
        class="page-header min-vh-50 my-sm-3 mb-3 border-radius-xl"
        :style="{ backgroundImage: `url('/refresh2.jpeg')` }"
      >
        <span class="mask"></span>
        <div class="container">
          <div class="row">
            <div class="col-lg-6 ms-lg-5 text-box">
              <h4 class="text-white mb-0">Refresh Center</h4>
              <h1 class="text-white">{{ $t('MainSectionBrother.refreshTitle') }}</h1>
              <p class="lead text-white opacity-8">
                {{ $t('MainSectionBrother.refreshSubTitle') }}
              </p>
              <span class="text-white">〒410-1231 静岡県裾野市須山2255-2998</span> <br />
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=35.261765,138.793433&travelmode=driving"
                class="text-white icon-move-right"
                target="_blank"
              >
                <span class="material-icons" style="font-size: 1rem; vertical-align: middle"
                  >location_on</span
                >
                Google Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container brother-container">
      <div class="row">
        <div class="col-lg-3 px-lg-1 mt-lg-0 mt-3">
          <div class="info-horizontal bg-gray-100 border-radius-xl p-5">
            <div class="description">
              <h5>{{ $t('MainSectionBrother.yokohamaTitle') }}</h5>
              <p>{{ $t('MainSectionBrother.yokohamaPaster') }}</p>
              <a href="http://yhgloria.com" class="text-primary icon-move-right" target="_blank" rel="noopener noreferrer">
                {{ $t('common.moveToPage') }}
                <i class="fas fa-arrow-right text-sm ms-1"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-lg-3 px-lg-1 mt-lg-0 mt-3">
          <div class="info-horizontal bg-gray-100 border-radius-xl p-5">
            <div class="description">
              <h5>{{ $t('MainSectionBrother.chibaTitle') }}</h5>
              <p>{{ $t('MainSectionBrother.chibaPaster') }}</p>
              <a href="http://www.cgch.net/" class="text-primary icon-move-right" target="_blank" rel="noopener noreferrer">
                {{ $t('common.moveToPage') }}
                <i class="fas fa-arrow-right text-sm ms-1"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-lg-3 px-lg-1 mt-lg-0 mt-3">
          <div class="info-horizontal bg-gray-100 border-radius-xl p-5">
            <div class="description">
              <h5>{{ $t('MainSectionBrother.hachioojiTitle') }}</h5>
              <p>{{ $t('MainSectionBrother.hachioojiPaster') }}</p>
              <a href="https://cafe.daum.net/h-gmc" class="text-primary icon-move-right" target="_blank" rel="noopener noreferrer">
                {{ $t('common.moveToPage') }}
                <i class="fas fa-arrow-right text-sm ms-1"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-lg-3 px-lg-1 mt-lg-0 mt-3">
          <div class="info-horizontal bg-gray-100 border-radius-xl p-5">
            <div class="description">
              <h5>{{ $t('MainSectionBrother.kawaguchiTitle') }}</h5>
              <p>{{ $t('MainSectionBrother.kawaguchiPaster') }}</p>
              <a
                href="https://www.youtube.com/channel/UC_c_u4h-tfhA8V5zKkkwhqA"
                class="text-primary icon-move-right"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('common.moveToPage') }}
                <i class="fas fa-arrow-right text-sm ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const staticPath = `${import.meta.env.VITE_API_URL}uploads/assets/main/`
</script>

<style scoped>
.brother-container {
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.mask {
  background-color: rgba(0, 0, 0, 0.1);
}

.text-box {
  background-color: rgba(0, 0, 0, 0.45);
  border-radius: 12px;
  padding: 2.5rem 2.5rem;
}

.text-box h1,
.text-box h4,
.text-box p,
.text-box a,
.text-box span {
  font-weight: 700;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
}
</style>
