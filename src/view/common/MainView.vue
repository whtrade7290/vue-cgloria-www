<template>
  <div class="wrapper">
    <HeaderComponent
      :img-url="imgUrl"
      :main-msg="$t('mainMsg.main')"
      :sub-msg="$t('mainMsg.sub')"
      :height="70"
    ></HeaderComponent>
    <template v-if="inited">
      <WeeklySermon :sermon="contents.sermon" :weekly="contents.weekly"></WeeklySermon>
      <MainSectionOne
        :column="contents.column"
        :class-meeting="contents.classMeeting"
        :testimony="contents.testimony"
      ></MainSectionOne>
      <MainSectionTwo></MainSectionTwo>
      <MainSectionTraining></MainSectionTraining>
      <MainSectionJumokja></MainSectionJumokja>
      <!-- <MainSectionPhoto :photos="contents.photoBoard"></MainSectionPhoto> -->
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
// import MainSectionPhoto from '@/components/main/MainSectionPhoto.vue'
import MainSectionBrother from '@/components/main/MainSectionBrother.vue'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useGetMainContents from '@/view/common/composable/getMainContentsUsable.js'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { locale } = useI18n()

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

const currentLanguageCode = computed(() => (locale.value === 'jp' ? 'ja' : locale.value))

const updateMainContents = async () => {
  const results = await useGetMainContents(currentLanguageCode.value)
  contents.value = results
  if (!inited.value) {
    inited.value = true
  }
}

onMounted(async () => {
  await store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })

  await updateMainContents()
})

watch(
  () => currentLanguageCode.value,
  async () => {
    await updateMainContents()
  }
)
</script>

<style scoped>
.wrapper {
  background-color: #fff;
}
</style>
