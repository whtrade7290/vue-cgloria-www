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
                    <!-- {{ columnItem.title || '' }} -->
                  </h5>
                </div>
                <!-- <p v-html="truncatedText(columnItem?.content ?? '', 200)"></p> -->
                <!-- <template v-if="columnItem.id !== 999999">
                  <a
                    href="javascript:;"
                    @click="intoDetail(columnItem.id, 'column')"
                    style="color: #d4a59a; font-size: 1.2rem"
                    >{{ $t('common.more') }}</a
                  >
                </template> -->
              </div>
            </div>
            <div class="col-md-12">
              <div class="info mb-3">
                <div style="display: flex">
                  <h3 class="text-gradient text-primary" style="padding-left: 0px">
                    {{ $t('mainSectionOne.classMeeting') }}
                  </h3>
                  <h5 class="font-weight-bolder" style="padding-left: 10px; padding-top: 10px">
                    <!-- {{ classMeetingItem.title || '' }} -->
                  </h5>
                </div>
                <!-- <p v-html="truncatedText(classMeetingItem.content, 300)"></p>
                <template v-if="classMeetingItem.id !== 999999">
                  <a
                    href="javascript:;"
                    @click="intoDetail(classMeetingItem.id, 'classMeeting')"
                    style="color: #d4a59a; font-size: 1.2rem"
                    >{{ $t('common.more') }}</a
                  >
                </template> -->
              </div>
            </div>
            <div class="col-md-12">
              <div class="info mb-3">
                <div style="display: flex">
                  <h3 class="text-gradient text-primary" style="padding-left: 0px">
                    {{ $t('mainSectionOne.testimony') }}
                  </h3>
                  <h5 class="font-weight-bolder" style="padding-left: 10px; padding-top: 10px">
                    <!-- {{ testimonyItem.title || '' }} -->
                  </h5>
                </div>
                <!-- <p v-html="truncatedText(testimonyItem.content, 250)"></p>
                <template v-if="classMeetingItem.id !== 999999">
                  <a
                    href="javascript:;"
                    @click="intoDetail(testimonyItem.id, 'testimony')"
                    style="color: #d4a59a; font-size: 1.2rem"
                    >{{ $t('common.more') }}</a
                  >
                </template> -->
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 ms-auto me-auto p-lg-4 mt-lg-0 mt-4" style="padding-top: 0 !important">
          <div class="card card-background card-background-mask-primary tilt" data-tilt>
            <div
              class="full-background"
              :style="{ backgroundImage: `url('${staticPath}cross1.jpeg')` }"
            ></div>
            <div class="card-body pt-7 text-center">
              <h2 class="text-white up mb-0" style="text-align: left">
                {{ $t('mainSectionOne.midnightWorship') }}<br />{{ $t('mainSectionOne.am') }} 5:50 ~
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
const staticPath = `${import.meta.env.VITE_API_URL}uploads/assets/`
const store = useStore()
const router = useRouter()

const truncatedText = (content, limit) => {
  const cleanedContent = content.replaceAll('<p>', '').replaceAll('</p>', '')
  return cleanedContent.length > limit ? cleanedContent.slice(0, limit) + '...' : cleanedContent
}

const columnItem = store.state.mainContents[0]
const classMeetingItem = store.state.mainContents[1]
const testimonyItem = store.state.mainContents[2]

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

<style scoped></style>
