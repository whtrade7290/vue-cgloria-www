<template>
  <section class="pt-lg-7 pt-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-5 col-md-8 order-2 order-md-2 order-lg-1">
          <div
            class="position-relative ms-lg-5 mb-0 mb-md-7 mb-lg-0 d-none d-md-block d-lg-block d-xl-block h-75"
          >
            <div
              class="bg-gradient-primary w-100 h-100 border-radius-xl position-absolute d-lg-block d-none"
            ></div>
            <img
              :src="`${staticPath}discipleMember.jpg`"
              class="w-100 border-radius-xl mt-6 ms-lg-5 position-relative z-index-5"
              alt=""
            />
          </div>
        </div>
        <div class="col-lg-5 col-md-12 ms-auto order-1 order-md-1 order-lg-1">
          <div class="p-3 pt-0">
            <h3 class="text-gradient text-primary mb-0">{{ $t('MainSectionTraining.title') }}</h3>
            <h5 class="mb-4">
              <a href="#" target="blank" rel="nofollow">{{ $t('MainSectionTraining.subTitle') }}</a>
            </h5>
            <p>
              <b>{{ $t('MainSectionTraining.content1Bold') }}</b
              >{{ $t('MainSectionTraining.content1') }}
            </p>
            <p>
              <b>{{ $t('MainSectionTraining.content2Bold') }}</b
              >{{ $t('MainSectionTraining.content2') }}
            </p>
            <p>
              <b>{{ $t('MainSectionTraining.content3Bold') }}</b
              >{{ $t('MainSectionTraining.content3') }}
            </p>
            <a href="#" target="blank" rel="nofollow" class="text-dark icon-move-right"
              >{{ $t('common.moveToPage') }}
              <i class="fas fa-arrow-right text-sm ms-1"></i>
            </a>
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
