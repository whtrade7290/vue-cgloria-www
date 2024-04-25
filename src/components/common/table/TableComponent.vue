<template>
  <div class="table-responsive p-0">
    <table class="table align-items-center justify-content-center mb-3">
      <thead>
        <tr>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
          >
            번호
          </th>
          <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">제목</th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
          >
            글쓴이
          </th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
          >
            날짜
          </th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
          >
            조회수
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in store.state.dataList" :key="idx">
          <td>
            <p class="text-sm font-weight-bold mb-0 text-center">{{ item.id }}</p>
          </td>
          <td>
            <p class="text-sm font-weight-bold mb-0">
              {{ item.title }}
            </p>
          </td>
          <td>
            <p class="text-sm font-weight-bold mb-0 text-center">{{ item.writer }}</p>
          </td>
          <td>
            <p class="text-sm font-weight-bold mb-0 text-center">{{ item.date }}</p>
          </td>
          <td>
            <p class="text-sm font-weight-bold mb-0 text-center">{{ item.hit }}</p>
          </td>
        </tr>
      </tbody>
    </table>
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
            <span class="sr-only">Previous</span>
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
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
useRoute
const store = useStore()
const router = useRouter()
const route = useRoute()
const props = defineProps({
  called: {
    type: String,
    default: ''
  },
  isTraining: {
    type: Boolean,
    default: false
  },
  pageNum: {
    type: Number,
    default: 1
  }
})

let pageNum = props.pageNum
const pageSize = 5
let pageList = []

const totalCount = store.state.count

if (props.isTraining) {
  const trainingNum = JSON.parse(sessionStorage.getItem(1)).training_num

  if (trainingNum) {
    console.log('test')
    store.dispatch('FETCH_TRAINING_DATALIST', { name: props.called, trainingNum: trainingNum })
  } else {
    Swal.fire({
      title: '훈련이 확인되지 않습니다.',
      icon: 'error'
    }).then(() => router.replace('/'))
  }
} else {
  fetchList(pageNum)
}

function fetchList(num) {
  store.dispatch('FETCH_BOARDLIST', {
    name: props.called,
    startRow: (num - 1) * pageSize,
    pageSize: pageSize
  })
  pageNum = num
  settingPageNumber()
}

function settingPageNumber() {
  console.log('totalCount: ', totalCount)
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
  console.log('pageList: ', pageList)

  return endIndex
}
</script>

<style scoped>
.selected {
  border: 3px solid #ffbaef;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
