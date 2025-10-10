<template>
  <CardContainer :title="obj.title">
    <div class="container" style="padding-top: 30px; padding-bottom: 60px">
      <div class="row align-items-center">
        <div class="col-lg-7 col-md-8 me-lg-auto position-relative" style="padding-left: 39px">
          <p class="text-sm font-weight-bold mb-1">{{ $t('webContents.paster.main') }}</p>
          <h3 class="text-dark">{{ $t('webContents.paster.pasterName') }}</h3>
          <p class="my-4">
            {{ $t('webContents.paster.content1') }}
          </p>

          <p class="my-4">
            {{ $t('webContents.paster.content2') }}
          </p>

          <h5 class="mt-5 mb-3" id="cookies">{{ $t('webContents.paster.profile') }}</h5>
          <div class="row">
            <div class="col-lg-6">
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_1')
                  }}</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_2')
                  }}</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_3')
                  }}</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_4')
                  }}</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_5')
                  }}</span>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_6')
                  }}</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_7')
                  }}</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_8')
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3" style="text-align: center; display: block">
            <img
              class="border-radius-md"
              style="width: 100%"
              src="/pastor.jpeg"
              alt="First slide"
            />
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

const staticPath = `${import.meta.env.VITE_API_URL}`
const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', INFO)
obj.value = INFO.find((o) => route.name === o.path)
</script>

<style lang="scss" scoped></style>
