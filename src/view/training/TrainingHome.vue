<template>
  <div>
    <HeaderComponent
      :main_msg="trainingFullName"
      sub_msg="그러므로 너희는 가서 모든 민족을 제자로 삼아 내가 너희에게 분부한 것을 가르쳐 지키게 하라"
      :imgUrl="training.img_url"
      :isTraining="true"
    ></HeaderComponent>
    <div class="container">
      <div class="subtitle">
        <h2>{{ trainingFullName }}</h2>
        그러므로 너희는 가서 모든 민족을 제자로 삼아 내가 너희에게 분부한 것을 가르쳐 지키게 하라
      </div>
      <div class="menu-box">
        <router-link to="/training/diary" v-if="training.diary_flg">
          <div
            class="menu-card"
            style="
              background-image: url('https://cdn.pixabay.com/photo/2016/09/01/02/53/hand-1635144_1280.jpg');
            "
          >
            <div class="font-box black-han-sans-regular">영성일기</div>
          </div>
        </router-link>
        <router-link to="/training/assignment" v-if="training.assignment_flg">
          <div
            class="menu-card"
            style="
              background-image: url('https://cdn.pixabay.com/photo/2015/03/22/11/18/school-work-684525_1280.jpg');
            "
          >
            <div class="font-box black-han-sans-regular">과제제출</div>
          </div>
        </router-link>
        <router-link to="/training/notice" v-if="training.notice_flg">
          <div
            style="
              background-image: url('https://cdn.pixabay.com/photo/2017/04/07/00/55/cross-2209803_1280.jpg');
            "
            class="menu-card"
          >
            <div class="font-box black-han-sans-regular">알림장</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/main/HeaderComponent.vue'
import { useStore } from 'vuex'
import { TRAINING } from '@/data/enum.js'

const store = useStore()
const training = store.state.training[0]
const trainingName = TRAINING.find((o) => o.no === training.training_type).name
const trainingFullName = `${training.group_num}기 ${trainingName}`
</script>

<style scoped>
.menu-box {
  display: flex;
  justify-content: space-around;
  /* background-color: black; */
  background-color: rgba(0, 0, 0, 0.05);
  border: 1;
  height: 30rem;
  color: black;
  border-radius: 1.5rem;
  margin-bottom: 10rem;
  padding: 0 3rem 0 3rem;
}
.menu-card {
  /* background-color: white; */
  /* border: 1px solid red; */
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1.5rem;
  width: 18rem;
  height: 20rem;
  margin-top: 5rem;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: end;
}
.menu-card:hover {
  transform: translate(3px, 3px); /* 움직임 효과 */
}
.subtitle {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.font-box {
  font-size: 1.5rem;
  color: #eeeeee;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.6rem 3rem 0.6rem 3rem;
  border-radius: 0.6rem;
  margin-bottom: 2rem;
}
.black-han-sans-regular {
  font-family: 'Black Han Sans', sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>
