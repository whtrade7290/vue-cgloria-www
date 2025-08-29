<template>
  <div>
    <HeaderComponent
      :imgUrl="imgUrl"
      :main_msg="$t('mainMsg.main')"
      :sub_msg="$t('mainMsg.sub')"
    ></HeaderComponent>
    <WeeklySermon></WeeklySermon>
    <MainSectionOne></MainSectionOne>
    <MainSectionTwo></MainSectionTwo>
    <MainSectionTraining></MainSectionTraining>
    <MainSectionJumokja></MainSectionJumokja>
    <!-- <MainSectionPhoto></MainSectionPhoto> -->
    <MainSectionBrother></MainSectionBrother>
  </div>
</template>

<script setup>
import WeeklySermon from '@/components/main/WeeklySermon.vue'
import HeaderComponent from '@/components/main/HeaderComponent.vue'
import MainSectionOne from '@/components/main/MainSectionOne.vue'
import MainSectionTwo from '@/components/main/MainSectionTwo.vue'
import MainSectionTraining from '@/components/main/MainSectionTraining.vue'
import MainSectionJumokja from '@/components/main/MainSectionJumokja.vue'
import MainSectionPhoto from '@/components/main/MainSectionPhoto.vue'
import MainSectionBrother from '@/components/main/MainSectionBrother.vue'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const imgUrl = `${import.meta.env.VITE_API_URL}uploads/assets/main/main01.jpg`

const storedData = localStorage.getItem(getUserIdFromCookie())
const accessToken = storedData ? JSON.parse(storedData).token : ''
const refreshToken = storedData ? JSON.parse(storedData).refreshToken : ''

onMounted(() => {
  store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })
})
</script>

<style scoped></style>
