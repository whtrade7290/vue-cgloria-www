<template>
  <CardContainer :title="obj.title">
    <div class="container" style="padding-top: 30px; padding-bottom: 60px">
      <div class="row align-items-center">
        <div class="col-lg-7 col-md-8 me-lg-auto position-relative" style="padding-left: 39px">
          <p class="text-sm font-weight-bold mb-1">중앙영광교회 담임목사</p>
          <h3 class="text-dark">이용규 목사</h3>
          <p class="my-4">
            1988년 일본으로 유학을 와서 박사과정을 밟던 중에, 불의의 사고로 얼굴을 중심으로 3도
            중화상이라는 큰 고통 속에 살아계신 하나님을 만나 주의 종으로 서원했습니다.
          </p>

          <p class="my-4">
            그 후 한국에서 신학 대학을 졸업하고, 감리교단으로부터 일본 선교사로 파송 받아 1994년 5월
            첫 주 신주쿠에서 중앙영광교회를 개척하여 오늘에 이르고 있습니다.
          </p>

          <h5 class="mt-5 mb-3" id="cookies">학력 및 목회 경력</h5>
          <div class="row">
            <div class="col-lg-6">
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">마산고등학교 졸업</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">서울대 공과대학 졸업</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">서울대 대학원 졸업</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">일본 동경대 박사과정수학</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">감리교 신학대 졸업</span>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">선한목자교회 전도사</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">일본 선교사로 파송</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">현 중앙영광교회 담임</span>
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
              src="@/assets/img/pastor.jpeg"
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

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', INFO)
obj.value = INFO.find((info) => route.name === info.path)
</script>

<style lang="scss" scoped></style>
