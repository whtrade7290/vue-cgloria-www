<template>
  <section class="py-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <h3 class="text-gradient text-primary mb-3">{{ $t('MainSectionPhoto.title') }}</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-sm-6" v-for="photo in photoList" :key="photo">
          <div class="card card-plain card-blog">
            <div class="card-image border-radius-lg position-relative">
              <a href="javascript:;" @click="intoDetail(photo.id)">
                <img
                  class="w-100 border-radius-lg move-on-hover shadow"
                  style="height: 15rem"
                  :src="`${staticPath}/${photo.files[0].filename}`"
                />
              </a>
            </div>
            <div class="card-body px-0" style="padding-top: 10px">
              <h6>
                <a href="javascript:;" class="text-dark font-weight-bold">{{
                  photo.title || ''
                }}</a>
                {{ photo.id || '' }}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const props = defineProps({
  photos: {
    type: Object,
    default: () => ({})
  }
})

const photoList = ref([])

photoList.value = props.photos
  .map((photo) => {
    return {
      ...photo,
      files: photo.files ? JSON.parse(photo.files) : null
    }
  })
  .filter((photo) => photo.files && photo.files.length > 0)

console.log('photoList.value: ', photoList.value)

const staticPath = `${import.meta.env.VITE_API_URL}uploads`

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

    const url = arr.length > 0 ? `${import.meta.env.VITE_API_URL}uploads/${arr[0]?.filename}` : null

    return {
      id: item.id,
      title: item.title,
      url: url
    }
  })
})

async function intoDetail(id) {
  if (id) {
    await router.push({
      name: 'photoDetail',
      params: { name: 'photoBoard', id: id },
      query: { pageNum: 1 }
    })
  }
}
</script>

<style lang="scss" scoped></style>
