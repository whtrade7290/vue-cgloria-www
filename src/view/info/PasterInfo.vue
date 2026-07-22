<template>
  <CardContainer :title="obj.title">
    <div class="container" style="padding-top: 30px; padding-bottom: 60px">
      <div class="row align-items-center">
        <div class="col-lg-7 col-md-8 me-lg-auto position-relative" style="padding-left: 39px">
          <p class="text-sm font-weight-bold mb-1">{{ $t('webContents.paster.main') }}</p>
          <h3 class="text-dark">{{ $t('webContents.paster.pasterName') }}</h3>
          <p class="my-4">
            {{ $t('webContents.paster.content1') }}
          </p>

          <p class="my-4">
            {{ $t('webContents.paster.content2') }}
          </p>

          <h5 class="mt-5 mb-3" id="cookies">{{ $t('webContents.paster.profile') }}</h5>
          <div class="row">
            <div class="col-lg-6">
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_1')
                  }}</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_2')
                  }}</span>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_3')
                  }}</span>
                </div>
              </div>
              <div class="p-3 d-flex px-0 py-1">
                <div><i class="fas fa-check text-primary text-sm" aria-hidden="true"></i></div>
                <div class="ps-3">
                  <span class="text-sm font-weight-bold">{{
                    $t('webContents.paster.profile_4')
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3" style="text-align: center; display: block">
            <img
              class="border-radius-md"
              style="width: 100%"
              src="/pastor.jpeg"
              alt="First slide"
            />
          </div>
        </div>
      </div>

      <hr class="my-5" />

      <div class="d-flex align-items-baseline flex-wrap mb-4">
        <h4 class="text-dark mb-0 me-2">{{ $t('webContents.paster.associatesTitle') }}</h4>
        <span class="text-sm text-secondary">{{
          $t('webContents.paster.associatesSubtitle')
        }}</span>
      </div>

      <div
        v-for="(associate, idx) in associates"
        :key="idx"
        class="associate-card d-flex flex-column flex-md-row mb-4"
      >
        <div class="associate-photo mb-3 mb-md-0 me-md-4">
          <img v-if="associate.photo" :src="associate.photo" alt="" class="border-radius-md" />
          <div v-else class="associate-photo-placeholder">사진</div>
        </div>
        <div class="flex-grow-1">
          <p class="text-sm font-weight-bold text-primary mb-1">{{ associate.title }}</p>
          <h5 class="text-dark mb-2">{{ associate.name }}</h5>
          <p class="text-sm text-secondary mb-3">{{ associate.desc }}</p>
          <ul class="associate-profile-list">
            <li v-for="(line, lineIdx) in associate.profile" :key="lineIdx" class="text-sm">
              {{ line }}
            </li>
          </ul>
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const staticPath = `${import.meta.env.VITE_API_URL}`
const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', INFO)
obj.value = INFO.find((o) => route.name === o.path)

const { tm } = useI18n({ useScope: 'global' })
const associatePhotos = ['/kong.jpeg', '/lee.jpeg', 'moon.jpeg']
const associates = computed(() =>
  tm('webContents.paster.associates').map((a, idx) => ({ ...a, photo: associatePhotos[idx] || '' }))
)
</script>

<style scoped>
.associate-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.associate-photo {
  flex-shrink: 0;
  width: 100px;
}

.associate-photo img {
  width: 100px;
  height: 130px;
  object-fit: cover;
  object-position: top;
}

.associate-photo-placeholder {
  width: 100px;
  height: 130px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-size: 0.8rem;
  background: repeating-linear-gradient(45deg, #f4f4f4, #f4f4f4 10px, #eaeaea 10px, #eaeaea 20px);
}

.associate-profile-list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.associate-profile-list li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.25rem;
}

.associate-profile-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background-color: var(--bs-primary, #e91e63);
}
</style>
