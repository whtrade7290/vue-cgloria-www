<template>
  <CardContainer :title="obj.title">
    <section class="pt-3 pb-5">
      <div class="container">
        <div class="text-center mb-5">
          <h3 class="text-gradient text-primary mb-1">{{ $t('webContents.worshipGuide.title') }}</h3>
          <p class="mb-0">{{ $t('webContents.worshipGuide.subtitle') }}</p>
        </div>
        <div class="row">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <h5 class="mb-3">{{ $t('webContents.worshipGuide.orderTitle') }}</h5>
            <div v-for="(item, idx) in orderItems" :key="idx" class="order-item">
              <span class="order-number">{{ idx + 1 }}</span>
              <span class="order-label">{{ item }}</span>
            </div>

            <div class="live-row">
              <span>
                <span class="live-dot" :class="{ 'live-dot-on': isWorshipTime }"></span>
                {{ $t('webContents.worshipGuide.liveTitle') }}
                <span v-if="isWorshipTime" class="live-badge">{{
                  $t('webContents.worshipGuide.liveNowLabel')
                }}</span>
              </span>
              <a :href="liveUrl" class="btn-live" target="_blank" rel="noopener noreferrer">
                {{ $t('webContents.worshipGuide.liveButton') }} ›
              </a>
            </div>
          </div>

          <div class="col-lg-6 d-flex flex-column">
            <h5 class="mb-3">{{ $t('webContents.worshipGuide.scheduleTitle') }}</h5>
            <div class="schedule-fill">
              <img src="/church.jpeg" alt="중앙영광교회" class="church-photo" />

              <div class="order-item schedule-card">
                <div class="schedule-row">
                  <span class="schedule-label">{{ $t('webContents.worshipGuide.dawn') }}</span>
                  <span class="schedule-time">{{ $t('webContents.worshipGuide.dawnTime') }}</span>
                </div>
                <div class="schedule-row">
                  <span class="schedule-label">{{ $t('webContents.worshipGuide.worship1') }}</span>
                  <span class="schedule-time">{{ $t('webContents.worshipGuide.worship1Time') }}</span>
                </div>
                <div class="schedule-row">
                  <span class="schedule-label">{{ $t('webContents.worshipGuide.worship2') }}</span>
                  <span class="schedule-time">{{ $t('webContents.worshipGuide.worship2Time') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { WORSHIP } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const liveUrl =
  'https://www.youtube.com/@%EC%A4%91%EC%95%99%EC%98%81%EA%B4%91%EA%B5%90%ED%9A%8C%E4%B8%AD%E5%A4%AE%E6%A0%84%E5%85%89/featured'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', WORSHIP)
obj.value = WORSHIP.find((o) => route.name === o.path)

const { tm } = useI18n({ useScope: 'global' })
const orderItems = computed(() => tm('webContents.worshipGuide.orderItems'))

const now = ref(new Date())
let timer
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 30000)
})
onUnmounted(() => clearInterval(timer))

const isWorshipTime = computed(() => {
  const d = now.value
  if (d.getDay() !== 0) return false
  const minutes = d.getHours() * 60 + d.getMinutes()
  const worship1 = minutes >= 8 * 60 + 50 && minutes < 10 * 60
  const worship2 = minutes >= 10 * 60 + 40 && minutes < 12 * 60
  return worship1 || worship2
})
</script>

<style scoped>
.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.25rem;
  margin-bottom: 0.75rem;
  background-color: var(--gloria-primary-light);
  border-radius: 0.75rem;
}

.order-number {
  flex: 0 0 auto;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--gloria-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.order-label {
  font-weight: 600;
}

.schedule-fill {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.schedule-card {
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
}

.schedule-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.schedule-label {
  font-weight: 600;
}

.schedule-time {
  font-weight: 700;
}

.church-photo {
  flex: 1;
  min-height: 160px;
  width: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
}

.live-row {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
}

.live-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #e74c3c;
  margin-right: 0.5rem;
}

.live-dot-on {
  background-color: #2ecc71;
}

.live-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
  background-color: #2ecc71;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  vertical-align: middle;
}

.btn-live {
  background-color: var(--gloria-primary);
  color: #fff;
  border-radius: 2rem;
  padding: 0.4rem 1rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}
</style>
