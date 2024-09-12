<template>
  <section
    class="pt-3 pt-md-5 pb-md-5 pt-lg-7 mt-5 mb-7"
    style="border-radius: 1.5rem; background-color: #f6f6f6"
  >
    <div class="container">
      <div class="row">
        <SideMenu class="display-sideMenu"></SideMenu>
        <div class="col-lg-10">
          <div class="card shadow-lg mb-5">
            <CardHeader :title="title"></CardHeader>
            <div class="option-container" v-if="route.name === 'withDiary'">
              <div class="option-box">
                <div class="form-check" v-for="num in withDiaryNums" :key="num">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault1" />
                  <label class="form-check-label" for="flexCheckDefault">
                    {{ num }}기 예수동행일기
                  </label>
                </div>
                <!-- <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault1" />
                  <label class="form-check-label" for="flexCheckDefault"> 2기 예수동행일기 </label>
                </div> -->
              </div>
            </div>
            <div class="card card-calendar">
              <div class="card-body p-3">
                <slot></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SideMenu from '@/components/common/SideMenu.vue'
import CardHeader from '@/components/common/card/CardHeader.vue'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import { useRoute } from 'vue-router'

const route = useRoute()

console.log('route.name: ', route.name)

console.log('user: ', JSON.parse(localStorage.getItem(getUserIdFromCookie())).user)

const withDiaryNums = JSON.parse(localStorage.getItem(getUserIdFromCookie())).user.withDiary

defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.option-container {
  margin-top: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  padding-left: 3rem;
}
.option-box {
  border: 1px solid #dddddd;
  border-radius: 1rem;
  padding: 1rem 2rem 1rem 2rem;
}
.btn-write {
  display: flex;
  justify-content: end;
  margin-right: 2rem;
  margin-bottom: 1rem;
}

@media (max-width: 991px) {
  .display-sideMenu {
    margin-top: 3rem;
  }
}
@media (max-width: 767px) {
  .display-sideMenu {
    margin-top: 5rem;
  }
}
</style>
