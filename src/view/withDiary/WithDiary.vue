<template>
  <div>
    <HeaderComponent
      sub_msg="예수동행일기"
      imgUrl="/src/assets/img/main/sky1.jpeg"
    ></HeaderComponent>
    <div class="container">
      <CardContainer title="예수동행일기">
        <TableComponent :called="route.name"></TableComponent>
        <WriteButton></WriteButton>
      </CardContainer>
    </div>
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/main/HeaderComponent.vue'
import TableComponent from '@/components/common/table/TableComponent.vue'
import CardContainer from '@/components/common/card/CardContainer.vue'
import WriteButton from '@/components/common/WriteButton.vue'
import { WITHDIARY } from '@/data/sidemenu.js'

import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
const route = useRoute()

const store = useStore()

store.dispatch('FETCH_SIDEMENU', WITHDIARY)
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
