<template>
  <CardContainer :title="obj.title">
    <div class="page-header min-vh-65" style="display: grid; padding-top: 20px">
      <div class="container">
        <h2>{{ $t('webContents.location.main') }}</h2>

        <h5>{{ $t('webContents.location.sub') }}</h5>
        <br />

        <h6>{{ $t('webContents.location.address') }}</h6>
        <h6>{{ $t('webContents.location.phone') }}</h6>
        <img
          class="w-100 border-radius-lg shadow mt-5 mb-5"
          src="https://www.cgloria.org/imgs/Parking_Place.jpg"
          alt=""
        />
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
console.log(INFO)
store.dispatch('FETCH_SIDEMENU', INFO)
obj.value = INFO.find((o) => route.name === o.path)
</script>

<style lang="scss" scoped></style>
