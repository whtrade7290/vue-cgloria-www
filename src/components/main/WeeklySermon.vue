<template>
  <section id="count-stats" class="pt-3 pb-4">
    <div class="container">
      <div class="row">
        <div class="col-lg-9 z-index-2 border-radius-xl mt-n10 mx-auto py-3 blur shadow-blur">
          <div class="row">
            <div class="col-md-4 position-relative">
              <div class="p-3 text-center">
                <h3>{{ formatDate(sermon?.create_at) || '' }}</h3>
                <h5 class="mt-3 h4">{{ $t('weeklySermon.sermon') }}</h5>
                <div class="sermon-title">
                  <p class="h5 mb-2">{{ sermon?.title || '' }}</p>
                  <template v-if="sermon?.id">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-primary sermon-detail-btn"
                      @click="intoDetail(sermon.id, 'sermon')"
                    >
                      {{ $t('common.moveToPage') }}
                    </button>
                  </template>
                </div>
              </div>
              <hr class="vertical dark" />
            </div>
            <div class="col-md-8 position-relative">
              <div class="p-3">
                <h3 class="text-gradient text-primary">&nbsp;</h3>
                <h5 class="mt-3">{{ weekly?.title || '' }}</h5>
                <div class="text-sm" v-html="safeTruncated(weekly?.content ?? '')"></div>
                <template v-if="weekly?.id">
                  <a
                    href="javascript:;"
                    class="more-link"
                    @click="intoDetail(weekly?.id, 'weekly_bible_verse')"
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
import { formatDate } from '@/utils/dateFormat'

const router = useRouter()

defineProps({
  sermon: {
    type: Object,
    default: () => ({})
  },
  weekly: {
    type: Object,
    default: () => ({})
  }
})

import { sanitizeHtml } from '@/utils/sanitizeHtml'

const TRUNCATE_LIMIT = 100

const safeTruncated = (content) => {
  if (!content) return ''
  const sanitized = sanitizeHtml(content)
  const temp = document.createElement('div')
  temp.innerHTML = sanitized
  const text = temp.textContent || temp.innerText || ''
  const truncated = text.length > TRUNCATE_LIMIT ? `${text.slice(0, TRUNCATE_LIMIT)}...` : text
  const escaped = truncated.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const suppressNumberedBreaks = escaped.replace(/\r?\n+(?=\s*\d+\.)/g, ' ')
  const preserveBlankLines = suppressNumberedBreaks.replace(/\r?\n\s*\r?\n/g, '<br /><br />')
  return preserveBlankLines
    .replace(/\r?\n/g, '<br />')
    .replace(/\s{2,}/g, (match) => '&nbsp;'.repeat(match.length))
}

async function intoDetail(id, name) {
  await router.push({
    name: 'detail',
    params: { name: name, id: id },
    query: { pageNum: 1 }
  })
}
</script>

<style scoped>
.sermon-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 70px;
}

.sermon-detail-btn {
  font-weight: 600;
  border-radius: 999px;
  padding: 0.35rem 1.25rem;
}

.more-link {
  color: var(--gloria-primary);
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s ease;
}
.more-link:hover {
  opacity: 0.8;
}
</style>
