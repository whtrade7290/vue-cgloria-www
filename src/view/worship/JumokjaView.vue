<template>
  <CardContainer :title="obj.title">
    <section class="py-5">
      <div class="container" style="padding: 30px 60px">
        <div class="row">
          <div class="col-md-6 position-relative">
            <div class="position-relative ms-md-5 me-md-n5">
              <div class="blur-shadow-image">
                <img
                  class="image-left rounded-3 img-fluid position-relative top-0 end-0 bg-cover"
                  src="https://160.251.179.146:3000/uploads/assets/jumok.jpg"
                />
              </div>
            </div>
            <!-- Second image on the left side of the article -->
            <div
              class="position-absolute bottom-0 mb-10 ms-n2 me-3 start-0 end-2 d-md-block d-none"
            >
              <div class="blur-shadow-image">
                <img
                  class="image-container rounded-3 img-fluid position-relative bg-cover"
                  src="https://160.251.179.146:3000/uploads/assets/ju2.jpeg"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <!-- First image on the right side, above the article -->
            <div class="position-relative ms-n4 mb-5 mt-8 d-md-block d-none">
              <div class="blur-shadow-image">
                <img
                  class="image-right rounded-3 img-fluid position-relative bg-cover"
                  style="width: 70%"
                  src="https://160.251.179.146:3000/uploads/assets/ju1.png"
                />
              </div>
            </div>
            <h3 class="mb-4">
              {{ $t('webContents.jumok.main') }}
            </h3>
            <p>
              {{ $t('webContents.jumok.content1') }}
            </p>
            <p>
              {{ $t('webContents.jumok.content2') }}
            </p>
            <p>
              {{ $t('webContents.jumok.content3') }}
            </p>
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
import { ref } from 'vue'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', WORSHIP)
obj.value = WORSHIP.find((o) => route.name === o.path)
</script>

<style lang="scss" scoped></style>
