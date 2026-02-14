<template>
  <section class="my-5 py-5" style="padding-top: 0 !important">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 ms-auto">
          <div class="row justify-content-start">
            <div class="col-md-12">
              <div class="info mb-3">
                <div style="display: flex">
                  <h3 class="text-gradient text-primary" style="padding-left: 0px">
                    {{ $t('mainSectionOne.column') }}
                  </h3>
                  <h5 class="font-weight-bolder" style="padding-left: 10px; padding-top: 10px">
                    {{ column?.title || '' }}
                  </h5>
                </div>
                <div class="main-content" v-html="safeTruncated(column?.content ?? '')"></div>
                <template v-if="column?.id">
                  <a
                    href="javascript:;"
                    @click="intoDetail(column.id, 'column')"
                    class="more-link"
                    >{{ $t('common.more') }}</a
                  >
                </template>
              </div>
            </div>
            <div class="col-md-12">
              <div class="info mb-3">
                <div style="display: flex">
                  <h3 class="text-gradient text-primary" style="padding-left: 0px">
                    {{ $t('mainSectionOne.class_meeting') }}
                  </h3>
                  <h5 class="font-weight-bolder" style="padding-left: 10px; padding-top: 10px">
                    {{ classMeeting?.title || '' }}
                  </h5>
                </div>
                <div class="main-content" v-html="safeTruncated(classMeeting?.content ?? '')"></div>
                <template v-if="classMeeting?.id">
                  <a
                    href="javascript:;"
                    @click="intoDetail(classMeeting.id, 'class_meeting')"
                    class="more-link"
                    >{{ $t('common.more') }}</a
                  >
                </template>
              </div>
            </div>
            <div class="col-md-12">
              <div class="info mb-3">
                <div style="display: flex">
                  <h3 class="text-gradient text-primary" style="padding-left: 0px">
                    {{ $t('mainSectionOne.testimony') }}
                  </h3>
                  <h5 class="font-weight-bolder" style="padding-left: 10px; padding-top: 10px">
                    {{ testimony?.title || '' }}
                  </h5>
                </div>
                <div class="main-content" v-html="safeTruncated(testimony?.content ?? '')"></div>
                <template v-if="testimony?.id">
                  <a
                    href="javascript:;"
                    @click="intoDetail(testimony.id, 'testimony')"
                    class="more-link"
                    >{{ $t('common.more') }}</a
                  >
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 ms-auto me-auto p-lg-4 mt-lg-0 mt-4" style="padding-top: 0 !important">
          <div class="card card-background card-background-mask-primary tilt" data-tilt>
            <div class="full-background" :style="{ backgroundImage: `url('/cross1.jpeg')` }"></div>
            <div class="card-body pt-7 text-center">
              <h2 class="text-white up mb-0" style="text-align: left">
                {{ $t('mainSectionOne.midnightWorship') }}<br />{{ $t('mainSectionOne.am') }} 5:40 ~
                06:30
              </h2>
              <h2 class="text-white up mb-0" style="text-align: left">
                {{ $t('mainSectionOne.sundayWorsip1') }}<br />{{ $t('mainSectionOne.am') }} 8:50 ~
                10:00
              </h2>
              <h2 class="text-white up mb-0" style="text-align: left">
                {{ $t('mainSectionOne.sundayWorsip2') }}<br />{{ $t('mainSectionOne.am') }} 10:40 ~
                12:00
              </h2>
              <a
                href="#"
                style="font-size: 24px"
                class="btn btn-outline-white btn-round invisible"
                >{{ $t('mainSectionOne.worshipAndTraining') }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
const staticPath = `${import.meta.env.VITE_API_URL}uploads/assets/`
const store = useStore()
const router = useRouter()

const props = defineProps({
  column: {
    type: Object,
    default: () => ({})
  },
  classMeeting: {
    type: Object,
    default: () => ({})
  },
  testimony: {
    type: Object,
    default: () => ({})
  }
})

const TRUNCATE_LIMIT = 200

const safeTruncated = (content) => {
  if (!content) return ''
  const sanitized = sanitizeHtml(content)
  const temp = document.createElement('div')
  temp.innerHTML = sanitized
  const text = temp.textContent || temp.innerText || ''
  const truncated = text.length > TRUNCATE_LIMIT ? `${text.slice(0, TRUNCATE_LIMIT)}...` : text
  const escaped = truncated
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
  const normalizedBreaks = escaped
    .replace(/\r?\n+(?=\s*\d+\.)/g, ' ')
    .replace(/\r?\n\s*\r?\n/g, '<br /><br />')
    .replace(/\r?\n/g, '<br />')
  return normalizedBreaks.replace(/\s{2,}/g, (match) => '&nbsp;'.repeat(match.length))
}

async function intoDetail(id, name) {
  if (id) {
    await router.push({
      name: 'detail',
      params: { name: name, id: id },
      query: { pageNum: 1 }
    })
  }
}
</script>

<style scoped>
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
