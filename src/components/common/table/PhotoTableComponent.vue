<template>
  <div class="row">
    <div
      class="col-lg-3 col-sm-6"
      style="padding: 20px 30px 0 30px"
      v-for="(item, idx) in store.state.dataList"
      :key="idx"
    >
      <div class="card card-plain card-blog">
        <div class="card-image border-radius-lg position-relative">
          <a href="javascript:;">
            <img class="w-100 border-radius-lg move-on-hover shadow" :src="item.img_url" />
          </a>
        </div>
        <div class="card-body px-0" style="padding: 10px 0 0 0">
          <span>
            <a href="javascript:;" class="text-dark font-weight-bold">{{ item.title }}</a>
          </span>
        </div>
        <span>
          <a href="javascript:;" class="text-dark" style="font-size: 14px; line-height: 16px">{{
            formatDate(item.date)
          }}</a>
        </span>
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
import { useStore } from 'vuex'
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
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일  ${date.getHours()}:${date.getMinutes()}`
}
</script>

<style scoped>
.selected {
  border: 3px solid #ffbaef;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
