<template>
  <section class="pt-3 pb-4" id="count-stats">
    <div class="container">
      <div class="row">
        <div class="col-lg-9 z-index-2 border-radius-xl mt-n10 mx-auto py-3 blur shadow-blur">
          <div class="row">
            <div class="col-md-4 position-relative">
              <div class="p-3 text-center">
                <h3>{{ formatDate(sermonItem.create_at) }}</h3>
                <h5 class="mt-3">설교말씀</h5>
                <p class="text-sm">{{ sermonItem.title }}</p>
              </div>
              <hr class="vertical dark" />
            </div>
            <div class="col-md-8 position-relative">
              <div class="p-3">
                <h3 class="text-gradient text-primary">&nbsp;</h3>
                <h5 class="mt-3">{{ weeklyItem.title }}</h5>
                <p class="text-sm" v-html="truncatedText(weeklyItem.content, 160)"></p>
                <a
                  href="javascript:;"
                  @click="intoDetail(weeklyItem.id, 'weekly')"
                  style="color: #d4a59a; font-size: 1.2rem"
                  >...더보기</a
                >
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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

const sermonItem = store.state.mainContents[3]
const weeklyItem = store.state.mainContents[4]

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
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate() - date.getDay()).padStart(2, '0')
  return `${year}. ${month}. ${day} `
}
</script>

<style scoped></style>
