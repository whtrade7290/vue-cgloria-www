<template>
  <div class="row">
    <div
      class="col-lg-3 col-sm-6"
      style="padding: 20px 30px 0 30px"
      v-for="(item, idx) in parsedFiles"
      :key="idx"
    >
      <div class="card card-plain card-blog">
        <div class="card-image border-radius-lg position-relative">
          <a href="javascript:;" @click="intoDetail(item.id)">
            <img class="w-100 border-radius-lg move-on-hover shadow" :src="item.thumnailUrl" />
          </a>
        </div>
        <div class="card-body px-0" style="padding: 10px 0 0 0">
          <span>
            <a href="javascript:;" class="text-dark font-weight-bold">{{ item.title }}</a>
          </span>
        </div>
        <div style="display: flex; justify-content: space-between">
          <span
            ><a href="javascript:;" class="text-dark" style="font-size: 14px; line-height: 16px">{{
              formatDate(item.create_at)
            }}</a>
          </span>
          <span> {{ item.writer_name ?? item.writer }} </span>
        </div>
      </div>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a
            class="page-link"
            :class="[pageNum == 1 ? 'disabled' : '']"
            href="javascript:;"
            tabindex="-1"
            @click="fetchList((pageNum = pageNum - 1))"
          >
            <i class="fa fa-angle-left"></i>
            <i class="material-icons" style="font-size: 1rem">arrow_back_ios</i>
          </a>
        </li>
        <li class="page-item" v-for="page in pageList" :key="page">
          <a
            class="page-link"
            :class="[pageNum == page ? 'selected' : '']"
            href="javascript:;"
            @click="fetchList(page)"
            >{{ page }}</a
          >
        </li>

        <li class="page-item">
          <a
            class="page-link"
            :class="[pageNum == Math.ceil(store.state.count / pageSize) ? 'disabled' : '']"
            href="javascript:;"
            @click="fetchList((pageNum = pageNum + 1))"
          >
            <i class="fa fa-angle-right"></i>
            <i class="material-icons" style="font-size: 1rem">arrow_forward_ios</i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const route = useRoute()
const store = useStore()

const props = defineProps({
  called: {
    type: String,
    default: ''
  }
})

let pageNum = 1
const pageSize = 8
let pageList = []

const totalCount = store.state.count
fetchList(pageNum)

function fetchList(num) {
  const payload = {
    name: props.called,
    startRow: (num - 1) * pageSize,
    pageSize: pageSize
  }
  store.dispatch('FETCH_BOARDLIST', payload)
  pageNum = num
  settingPageNumber()
}

function settingPageNumber() {
  let totalPages = Math.ceil(totalCount / pageSize)
  let startIndex = (Math.ceil(pageNum / pageSize) - 1) * pageSize + 1
  let endIndex = startIndex + pageSize > totalCount ? totalCount : startIndex + pageSize - 1
  if (endIndex > totalPages) {
    endIndex = totalPages
  }
  pageList = []
  for (let index = startIndex; index <= endIndex; index++) {
    pageList.push(index)
  }
  return endIndex
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}. ${month}. ${day}. ${hours}:${minutes}`
}

const parsedFiles = computed(() => {
  // dataList를 가져옵니다
  const dataList = store.state.dataList

  const newList = dataList.map((data) => {
    let files = []
    if (data.files) {
      files = JSON.parse(data.files)
    } else {
      files = []
    }

    return {
      id: data.id,
      title: data.title,
      writer: data.writer,
      content: data.content,
      writer: data.writer,
      files: files,
      thumnailUrl: `http://160.251.179.146:3000/uploads/${files[0]?.filename}`,
      update_at: data.update_at,
      create_at: data.create_at,
      deleted: data.deleted
    }
  })

  return newList
})

async function intoDetail(id) {
  await router.push({
    name: 'photoDetail',
    params: { name: route.name, id: id },
    query: { pageNum: pageNum }
  })
}
</script>

<style scoped>
.selected {
  border: 3px solid #c5b5aa;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
