<template>
  <CardContainer :title="obj.title">
    <div class="page-header min-vh-65" style="display: grid; padding-top: 20px">
      <div class="container" style="padding: 0 60px">
        <div class="row">
          <div class="col-lg-4 my-auto" style="padding: 0">
            <h1 class="text-gradient text-warning mb-0">중앙영광교회</h1>
            <h5 class="mb-4">동행으로 소문난 교회</h5>
            <p class="lead" style="font-size: 16px">
              중앙 영광교회는 하나님의 말씀(마28:18-20, 행1:8)에 순종하여 성령의 능력으로 모든
              족속으로 제자를 삼아 증인 공동체를 세움으로 하나님께 영광을 돌리고자 1994년 동경
              신주쿠에 세워졌습니다.
            </p>
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
            중앙 영광교회는 하나님의 말씀(마28:18-20, 행1:8)에 순종하여 성령의 능력으로 모든
            족속으로 제자를 삼아 증인 공동체를 세움으로 하나님께 영광을 돌리고자 1994년 동경
            신주쿠에 세워졌습니다.
          </p>
          <p>
            중앙영광교회는 “말씀훈련을 통해 한 사람 한 사람을 예수님의 제자로 세우는 건강한 교회”를
            만들어 가며 ” 성령의 능력으로 예배, 전도, 섬김, 교제를 회복하여 목적이 이끄는 초대
            교회의 모습을 되찾는 사명”을 감당해 가고 있습니다
          </p>
          <p>
            중앙영광교회는 한인이 중심이 된 교회이지만 한국인이 불씨가 되어 일본인들에게 생명의
            복음을 옮겨주는 영적 사명을 다하며 목적이 이끄는 교회로 늘 깨어 있기 위하여 365일
            새벽기도와 매년 ‘목적이 이끄는 40일 특새를 실시하고 있습니다 .
          </p>
          <p>
            그리고 땅끝까지 이르러 증인이 되라는 예수님의 말씀에 따라 만민이 예배하는 선교센터로서의
            사명을 다하기 위해 순종하며 달려가고 있습니다.
          </p>
          <p>
            이 모든 사역이 우리의 노력으로 세워지고 이루어진 것이 아님을 고백합니다. 주님이 세우신
            교회(마16:18)이며 주님이 주인이신 교회입니다 . 주신 비전과 사명 역시 주님의 뜻대로
            행하실 것임을 믿기에 “작은 예수가 되자”이라는 푯대를 향하여 달려갈 것입니다.
          </p>

          <h3 class="mt-5 mb-3" id="cookies">형제교회 연락처</h3>
          <div style="display: grid; padding-bottom: 30px">
            <span>요코하마 영광교회 (담임목사 : 김경환) </span>
            <span>☎ 045-212-0061(교회), 090-8302-4749 http://www.yhgloria.com</span>
          </div>
          <div style="display: grid; padding-bottom: 30px">
            <span>치바 영광교회 (담임목사 : 김성섭) </span>
            <span>☎ 043-201-6350(교회), 090-4258-9340 http://www.cgch.net/</span>
          </div>
          <div style="display: grid; padding-bottom: 30px">
            <span>하치오지 영광교회 (담임목사 : 소대섭)</span>
            <span>042-634-8633(교회), 080-8300-4747 cafe.daum.net/h-gmc</span>
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
