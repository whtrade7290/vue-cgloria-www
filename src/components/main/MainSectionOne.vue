<template>
  <section class="my-5 py-5" style="padding-top: 0 !important">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 ms-auto">
          <div class="row justify-content-start">
            <div class="col-md-12">
              <div class="info mb-3">
                <div style="display: flex">
                  <h3 class="text-gradient text-primary" style="padding-left: 0px">칼럼</h3>
                  <h5 class="font-weight-bolder" style="padding-left: 10px; padding-top: 10px">
                    {{ columnItem.title }}
                  </h5>
                </div>
                <p class="pe-5" v-html="truncatedText(columnItem.content, 200)"></p>
                <a
                  href="javascript:;"
                  @click="intoDetail(columnItem.id, 'column')"
                  style="color: #d4a59a; font-size: 1.2rem"
                  >...더보기</a
                >
              </div>
            </div>
            <div class="col-md-12">
              <div class="info mb-3">
                <div style="display: flex">
                  <h3 class="text-gradient text-primary" style="padding-left: 0px">속회교재실</h3>
                  <h5 class="font-weight-bolder" style="padding-left: 10px; padding-top: 10px">
                    {{ classMeetingItem.title }}
                  </h5>
                </div>
                <p class="pe-3" v-html="truncatedText(classMeetingItem.content, 300)"></p>
                <a
                  href="javascript:;"
                  @click="intoDetail(classMeetingItem.id, 'classMeeting')"
                  style="color: #d4a59a; font-size: 1.2rem"
                  >...더보기</a
                >
              </div>
            </div>
            <div class="col-md-12">
              <div class="info mb-3">
                <div style="display: flex">
                  <h3 class="text-gradient text-primary" style="padding-left: 0px">간증</h3>
                  <h5 class="font-weight-bolder" style="padding-left: 10px; padding-top: 10px">
                    {{ testimonyItem.title }}
                  </h5>
                </div>
                <p class="pe-3" v-html="truncatedText(testimonyItem.content, 250)"></p>
                <a
                  href="javascript:;"
                  @click="intoDetail(testimonyItem.id, 'testimony')"
                  style="color: #d4a59a; font-size: 1.2rem"
                  >...더보기</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 ms-auto me-auto p-lg-4 mt-lg-0 mt-4" style="padding-top: 0 !important">
          <div class="card card-background card-background-mask-primary tilt" data-tilt>
            <div
              class="full-background"
              style="background-image: url('/src/assets/img/cross1.jpeg')"
            ></div>
            <div class="card-body pt-7 text-center">
              <h2 class="text-white up mb-0" style="text-align: left">
                새벽예배<br />오전 5:50 ~ 06:40
              </h2>
              <h2 class="text-white up mb-0" style="text-align: left">
                주일1부예배<br />오전 8:50 ~ 10:00
              </h2>
              <h2 class="text-white up mb-0" style="text-align: left">
                주일2부예배<br />오전 10:30 ~ 12:00
              </h2>
              <a href="#" style="font-size: 24px" class="btn btn-outline-white mt-5 up btn-round"
                >예배 및 훈련시간</a
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

const store = useStore()
const router = useRouter()

const truncatedText = (content, limit) => {
  const cleanedContent = content.replaceAll('<p>', '').replaceAll('</p>', '')
  return cleanedContent.length > limit ? cleanedContent.slice(0, limit) + '...' : cleanedContent
}

console.log('store: ', store.state.mainContents[0])

const columnItem = store.state.mainContents[0]
const classMeetingItem = store.state.mainContents[1]
const testimonyItem = store.state.mainContents[2]

async function intoDetail(id, name) {
  await router.push({
    name: 'detail',
    params: { name: name, id: id },
    query: { pageNum: 1 }
  })
}
</script>

<style scoped></style>
