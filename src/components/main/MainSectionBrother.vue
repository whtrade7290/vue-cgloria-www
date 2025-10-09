<template>
  <section>
    <div class="container mt-sm-5">
      <div
        class="page-header min-vh-50 my-sm-3 mb-3 border-radius-xl"
        :style="{ backgroundImage: `url('public/ref.jpg')` }"
      >
        <span class="mask bg-gradient-dark"></span>
        <div class="container">
          <div class="row">
            <div class="col-lg-6 ms-lg-5">
              <h4 class="text-white mb-0">Refresh Center</h4>
              <h1 class="text-white">{{ $t('MainSectionBrother.refreshTitle') }}</h1>
              <p class="lead text-white opacity-8">
                {{ $t('MainSectionBrother.refreshSubTitle') }}
              </p>
              <a href="http://www.fujirefresh.com/" class="text-white icon-move-right">
                {{ $t('MainSectionBrother.moveToPage') }}
                <i class="fas fa-arrow-right text-sm ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-lg-3 px-lg-1 mt-lg-0 mt-3">
          <div class="info-horizontal bg-gray-100 border-radius-xl p-5">
            <div class="description">
              <h5>{{ $t('MainSectionBrother.yokohamaTitle') }}</h5>
              <p>{{ $t('MainSectionBrother.yokohamaPaster') }}</p>
              <a href="http://yhgloria.com/xe/" class="text-primary icon-move-right">
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
              <a href="http://www.cgch.net/" class="text-primary icon-move-right">
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
              <a href="https://cafe.daum.net/h-gmc" class="text-primary icon-move-right">
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

<style lang="scss" scoped></style>
