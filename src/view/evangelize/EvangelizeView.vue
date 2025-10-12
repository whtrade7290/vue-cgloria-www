<template>
  <CardContainer :title="obj.title">
    <div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-7 mb-md-0 mb-4">
            <h3 class="text-gradient text-primary mb-0 mt-2">
              {{ $t('webContents.evengelize.main1') }}
            </h3>
            <p
              style="line-height: 40px; padding: 0 10px"
              v-html="$t('webContents.evengelize.content1')"
            ></p>
            <h3 class="text-gradient text-primary mb-0 mt-2">
              {{ $t('webContents.evengelize.main2') }}
            </h3>
            <p style="line-height: 40px; padding: 0 10px">
              {{ $t('webContents.evengelize.content2') }}
            </p>
          </div>
          <div class="col-md-5">
            <div class="card p-0 rounded-3">
              <div class="blur-shadow-image" style="text-align: center">
                <img
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/buildings.jpg"
                  alt="img-blur-shadow"
                  class="img-fluid shadow rounded-3"
                />
              </div>
              <div
                class="colored-shadow"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/buildings.jpg');
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- -------- START Features w/ icons and text on left & gradient title and text on right -------- -->
      <div class="card-body p-5">
        <h3 class="text-gradient text-primary mb-0 mt-2">
          {{ $t('webContents.evengelize.main3') }}
        </h3>
        <p>{{ $t('webContents.evengelize.content3-1') }}</p>
        <ul>
          <li>{{ $t('webContents.evengelize.content3-2-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content3-2-2') }}
          </p>
          <li>{{ $t('webContents.evengelize.content3-3-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content3-3-2') }}
          </p>
          <li>{{ $t('webContents.evengelize.content3-4-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content3-4-2') }}
          </p>
          <li>{{ $t('webContents.evengelize.content3-5-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content3-5-2') }}
          </p>
        </ul>
        <h3 class="text-gradient text-primary mb-0 mt-2">
          {{ $t('webContents.evengelize.main4') }}
        </h3>
        <ul>
          <li>{{ $t('webContents.evengelize.content4-1-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content4-1-2') }}
          </p>
          <li>
            {{ $t('webContents.evengelize.content4-2-1') }}
          </li>
          <p>
            {{ $t('webContents.evengelize.content4-2-2') }}
          </p>
          <li>{{ $t('webContents.evengelize.content4-3-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content4-3-2') }}
          </p>
        </ul>

        <h3 class="text-gradient text-primary mb-0 mt-2">
          {{ $t('webContents.evengelize.main5') }}
        </h3>
        <ul>
          <li>{{ $t('webContents.evengelize.content5-1-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content5-1-2') }}
          </p>
          <li>{{ $t('webContents.evengelize.content5-2-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content5-2-2') }}
          </p>
          <li>{{ $t('webContents.evengelize.content5-3-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content5-3-2') }}
          </p>
          <li>{{ $t('webContents.evengelize.content5-4-1') }}</li>
          <p>
            {{ $t('webContents.evengelize.content5-4-2') }}
          </p>
        </ul>
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

<style lang="scss" scoped></style>
