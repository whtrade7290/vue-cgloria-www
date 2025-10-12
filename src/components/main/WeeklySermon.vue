<template>
  <section class="pt-3 pb-4" id="count-stats">
    <div class="container">
      <div class="row">
        <div class="col-lg-9 z-index-2 border-radius-xl mt-n10 mx-auto py-3 blur shadow-blur">
          <div class="row">
            <div class="col-md-4 position-relative">
              <div class="p-3 text-center">
                <h3>{{ formatDate(sermon?.create_at) || '' }}</h3>
                <h5 class="mt-3">{{ $t('weeklySermon.sermon') }}</h5>
                <p class="text-sm">{{ sermon?.title || '' }}</p>
              </div>
              <hr class="vertical dark" />
            </div>
            <div class="col-md-8 position-relative">
              <div class="p-3">
                <h3 class="text-gradient text-primary">&nbsp;</h3>
                <h5 class="mt-3">{{ weekly?.title || '' }}</h5>
                <p class="text-sm" v-html="truncatedText(weekly?.content ?? '', 160)"></p>
                <template v-if="weekly?.id !== 999999">
                  <a
                    href="javascript:;"
                    @click="intoDetail(weekly?.id, 'weekly')"
                    style="color: #d4a59a; font-size: 1.2rem"
                    >{{ $t('common.more') }}</a
                  >
                </template>
              </div>
              <hr class="vertical dark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  sermon: {
    type: Object,
    default: () => ({})
  },
  weekly: {
    type: Object,
    default: () => ({})
  }
})

const truncatedText = (content, limit) => {
  const cleanedContent = content.replaceAll('<p>', '').replaceAll('</p>', '')
  return cleanedContent.length > limit ? cleanedContent.slice(0, limit) + '...' : cleanedContent
}

async function intoDetail(id, name) {
  await router.push({
    name: 'detail',
    params: { name: name, id: id },
    query: { pageNum: 1 }
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const dayOfWeek = date.getDay() // 0(일)~6(토)
  const daysUntilSunday = 7 - dayOfWeek // 다음 일요일까지 남은 일수

  date.setDate(date.getDate() + daysUntilSunday)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}. ${month}. ${day}`
}
</script>

<style scoped></style>
