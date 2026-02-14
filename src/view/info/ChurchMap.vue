<template>
  <CardContainer :title="obj.title">
    <div class="page-header">
      <div class="container">
        <h2>{{ $t('webContents.location.main') }}</h2>

        <h5>{{ $t('webContents.location.sub') }}</h5>
        <br />

        <h6>{{ $t('webContents.location.address') }}</h6>
        <h6>{{ $t('webContents.location.phone') }}</h6>

        <div class="map-embed-wrapper">
          <iframe
            :src="mapEmbedSrc"
            width="600"
            height="450"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
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

const mapEmbedSrc =
  'https://www.google.com/maps?q=%E4%B8%AD%E5%A4%AE%E6%A0%84%E5%85%89%E6%95%99%E4%BC%9A&output=embed'
</script>

<style scoped>
.page-header {
  padding: 1rem 1rem 5rem 1rem;
}

.map-embed-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  margin-top: 2rem;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.25);
}

.map-embed-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
