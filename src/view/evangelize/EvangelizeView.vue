<template>
  <CardContainer :title="obj.title">
    <div>
      <div class="container text-center">
        <h1 class="text-gradient text-primary" style="font-size: 43px; margin-bottom: 45px">
          {{ $t('webContents.evengelize.verse') }}
        </h1>
      </div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-7 mb-md-0 mb-4">
            <h3 class="text-gradient text-primary mb-0 mt-2">
              {{ $t('webContents.evengelize.main1') }}
            </h3>
            <p style="line-height: 40px; padding: 0 10px">
              {{ $t('webContents.evengelize.content1') }}
            </p>
            <h3 class="text-gradient text-primary mb-0 mt-2">
              {{ $t('webContents.evengelize.main2') }}
            </h3>
            <p style="line-height: 40px; padding: 0 10px">
              {{ $t('webContents.evengelize.content2') }}
            </p>
          </div>
          <div class="col-md-5">
            <div class="row g-2">
              <div class="col-12">
                <img src="/sumhanmokja.jpeg" alt="전도 사진" class="evangelize-photo evangelize-photo-main" />
              </div>
              <div class="col-6">
                <img src="/okubo.jpeg" alt="전도 사진" class="evangelize-photo" />
              </div>
              <div class="col-6">
                <img src="/ueno.jpeg" alt="전도 사진" class="evangelize-photo" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-body p-5">
        <h3 class="text-gradient text-primary mb-0 mt-2">
          {{ $t('webContents.evengelize.prayerTitle') }}
        </h3>
        <p class="text-center text-gradient text-primary font-weight-bold" style="font-size: 1.6rem; margin: 1.5rem 0">
          {{ $t('webContents.evengelize.prayerSubtitle') }}
        </p>
        <p style="line-height: 40px; padding: 0 10px">
          {{ $t('webContents.evengelize.prayerIntro') }}
        </p>
        <div class="prayer-list">
          <p class="prayer-item">{{ $t('webContents.evengelize.prayer1') }}</p>
          <p class="prayer-item">{{ $t('webContents.evengelize.prayer2') }}</p>
          <p class="prayer-item">{{ $t('webContents.evengelize.prayer3') }}</p>
          <p v-if="$i18n.locale === 'jp'" class="prayer-item">
            {{ $t('webContents.evengelize.prayer4') }}
          </p>
        </div>

        <h3 class="text-gradient text-primary mb-0 mt-4 pt-1">
          {{ $t('webContents.evengelize.fieldTitle') }}
        </h3>
        <div class="text-center mt-5 pt-2">
          <img src="/tissue.jpg" alt="현장전도" class="evangelize-tissue" />
        </div>
      </div>
    </div>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { TESTIMONY } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', TESTIMONY)
obj.value = TESTIMONY.find((o) => route.name === o.path)
</script>

<style scoped>
.evangelize-photo {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.evangelize-photo:hover {
  transform: scale(1.03);
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.22);
}

.evangelize-photo-main {
  height: 224px;
}

.prayer-list {
  margin-top: 1.5rem;
}

.prayer-item {
  line-height: 1.8;
  margin-bottom: 1rem;
  padding: 0 0 1rem 1rem;
  border-left: 3px solid var(--gloria-primary);
}

.evangelize-tissue {
  max-width: 100%;
  width: 900px;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
}
</style>
