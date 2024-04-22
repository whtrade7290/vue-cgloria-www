<template>
  <div>
    <HeaderComponent></HeaderComponent>
    <WeeklySermon></WeeklySermon>
    <MainSectionOne></MainSectionOne>
    <MainSectionTwo></MainSectionTwo>
    <MainSectionTraining></MainSectionTraining>
    <MainSectionJumokja></MainSectionJumokja>
    <MainSectionPhoto></MainSectionPhoto>
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
</script>

<style lang="scss" scoped></style>
