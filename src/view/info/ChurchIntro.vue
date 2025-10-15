<template>
  <CardContainer :title="obj.title">
    <div class="page-header min-vh-65" style="display: grid; padding-top: 20px">
      <div class="container" style="padding: 0 60px">
        <div class="row">
          <div class="col-lg-4 my-auto" style="padding: 0">
            <h1 class="text-gradient text-warning mb-0">
              {{ $t('webContents.churchIntro.main') }}
            </h1>
            <h5 class="mb-4">{{ $t('webContents.churchIntro.subtitle') }}</h5>
          </div>
          <div class="col-lg-8 ps-5 pe-0">
            <div class="row">
              <div class="col-lg-3 col-6">
                <img
                  class="w-100 border-radius-lg shadow mt-0 mt-lg-7"
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/desire.jpg"
                  alt=""
                />
              </div>
              <div class="col-lg-3 col-6">
                <img
                  class="w-100 border-radius-lg shadow"
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/chair.jpg"
                  alt=""
                />
                <img
                  class="w-100 border-radius-lg shadow mt-4"
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/facade.jpg"
                  alt=""
                />
              </div>
              <div class="col-lg-3 col-6">
                <img
                  class="w-100 border-radius-lg shadow mt-0 mt-lg-5"
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/architecture.jpg"
                  alt=""
                />
                <img
                  class="w-100 border-radius-lg shadow mt-4"
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/baloon.jpg"
                  alt=""
                />
              </div>
              <div class="col-lg-3 col-6">
                <img
                  class="w-100 border-radius-lg shadow mt-3"
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/seaside.jpg"
                  alt=""
                />
                <img
                  class="w-100 border-radius-lg shadow mt-4"
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/medusa.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="card-body">
          <p>
            {{ $t('webContents.churchIntro.content1') }}
          </p>
          <p>
            {{ $t('webContents.churchIntro.content2') }}
          </p>
          <p>
            {{ $t('webContents.churchIntro.content3') }}
          </p>
          <p>
            {{ $t('webContents.churchIntro.content4') }}
          </p>
          <p>
            {{ $t('webContents.churchIntro.content5') }}
          </p>

          <h3 class="mt-5 mb-3" id="cookies">{{ $t('webContents.churchIntro.brotherMain') }}</h3>
          <div style="display: grid; padding-bottom: 30px">
            <span>{{ $t('webContents.churchIntro.yokohamaName') }}</span>
            <span>{{ $t('webContents.churchIntro.yokohamaInfo') }}</span>
          </div>
          <div style="display: grid; padding-bottom: 30px">
            <span>{{ $t('webContents.churchIntro.chibaName') }}</span>
            <span>{{ $t('webContents.churchIntro.chibaInfo') }}</span>
          </div>
          <div style="display: grid; padding-bottom: 30px">
            <span>{{ $t('webContents.churchIntro.hachioojiName') }}</span>
            <span>{{ $t('webContents.churchIntro.hachioojiInfo') }}</span>
          </div>
          <div style="display: grid; padding-bottom: 30px">
            <span>{{ $t('webContents.churchIntro.kawaguchiName') }}</span>
            <span>{{ $t('webContents.churchIntro.kawaguchiInfo') }}</span>
          </div>
        </div>
      </div>
    </div>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { INFO } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', INFO)
obj.value = INFO.find((o) => route.name === o.path)
</script>

<style lang="scss" scoped></style>
