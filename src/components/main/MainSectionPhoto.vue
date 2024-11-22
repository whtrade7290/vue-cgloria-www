<template>
  <section class="py-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <h3 class="text-gradient text-primary mb-3">{{ $t('MainSectionPhoto.title') }}</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-sm-6" v-for="item in processedDataList" :key="item">
          <div class="card card-plain card-blog">
            <div class="card-image border-radius-lg position-relative">
              <a href="javascript:;" @click="intoDetail(item.id)">
                <img
                  class="w-100 border-radius-lg move-on-hover shadow"
                  style="height: 15rem"
                  :src="item.url"
                />
              </a>
            </div>
            <div class="card-body px-0" style="padding-top: 10px">
              <h6>
                <a href="javascript:;" class="text-dark font-weight-bold">{{ item.title }}</a>
                {{ item.id }}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const processedDataList = computed(() => {
  return store.state.dataList.map((item) => {
    let arr = []
    try {
      // item.files가 존재할 때만 파싱 시도
      if (item.files) {
        arr = JSON.parse(item.files)
      }
    } catch (error) {
      // JSON 파싱 오류가 발생할 경우 처리
      console.error('JSON 파싱 오류:', error)
      arr = [] // 빈 배열로 초기화
    }

    // 파일 데이터가 없거나 배열이 비어 있을 경우 기본값 설정

    const url = arr.length > 0 ? `http://160.251.179.146:3000/uploads/${arr[0]?.filename}` : null

    return {
      id: item.id,
      title: item.title,
      url: url
    }
  })
})

async function intoDetail(id) {
  await router.push({
    name: 'photoDetail',
    params: { name: 'photo', id: id },
    query: { pageNum: 1 }
  })
}
</script>

<style lang="scss" scoped></style>
