<template>
  <div>
    testtesttesttesttesttesttesttesttesttesttest
    <HeaderComponent
      :imgUrl="imgUrl"
      :main_msg="$t('mainMsg.main')"
      :sub_msg="$t('mainMsg.sub')"
    ></HeaderComponent>
    <template v-if="inited">
      <WeeklySermon :sermon="contents.sermon" :weekly="contents.weekly"></WeeklySermon>
      <MainSectionOne
        :column="contents.column"
        :classMeeting="contents.classMeeting"
        :testimony="contents.testimony"
      ></MainSectionOne>
      <MainSectionTwo></MainSectionTwo>
      <MainSectionTraining></MainSectionTraining>
      <MainSectionJumokja></MainSectionJumokja>
      <MainSectionPhoto></MainSectionPhoto>
      <MainSectionBrother></MainSectionBrother>
    </template>
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
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import useGetMainContents from '@/view/common/composable/getMainContentsUsable.js'

const store = useStore()

const contents = ref({
  sermon: null,
  weekly: null,
  column: null,
  classMeeting: null,
  testimony: null
})

const inited = ref(false)

const imgUrl = '/main01.jpg'

const storedData = localStorage.getItem(getUserIdFromCookie())
const accessToken = storedData ? JSON.parse(storedData).token : ''
const refreshToken = storedData ? JSON.parse(storedData).refreshToken : ''

onMounted(async () => {
  await store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })

  const results = await useGetMainContents()
  contents.value = results
  inited.value = true
})
</script>

<style scoped></style>
