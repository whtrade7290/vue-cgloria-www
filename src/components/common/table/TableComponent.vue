<template>
  <div class="table-responsive p-0">
    <table class="table align-items-center justify-content-center mb-3">
      <thead>
        <tr>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
            style="width: 10%; text-align: center"
          >
            번호
          </th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
            style="width: 40%; text-align: center"
          >
            제목
          </th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
            style="width: 10%; text-align: center"
          >
            글쓴이
          </th>
          <th
            class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
            style="width: 20%; text-align: center"
          >
            날짜
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in store.state.dataList" :key="idx">
          <td style="width: 10%; text-align: center">
            <p class="text-sm font-weight-bold mb-0 text-center">{{ item.id }}</p>
          </td>
          <td style="width: 40%; text-align: center">
            <p class="text-sm font-weight-bold mb-0">
              <a href="javascript:;" @click="intoDetail(item.id)">{{ item.title }}</a>
            </p>
          </td>
          <td style="width: 10%; text-align: center">
            <p class="text-sm font-weight-bold mb-0 text-center">{{ item.writer }}</p>
          </td>
          <td style="width: 20%; text-align: center">
            <p class="text-sm font-weight-bold mb-0 text-center">
              {{ formatDate(item.create_at) }}
            </p>
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

let pageNum = route.query?.pageNum ?? 1
const pageSize = 5
let pageList = []

const totalCount = store.state.count
fetchList(pageNum)

function fetchList(num) {
  const payload = {
    name: props.called,
    startRow: (num - 1) * pageSize,
    pageSize: pageSize
  }

  let actionsName = ''

  if (route.name === 'withDiary') {
    actionsName = 'FETCH_WITHDIARY_DATALIST'
  } else {
    actionsName = 'FETCH_BOARDLIST'
  }
  store.dispatch(actionsName, payload)
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
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

async function intoDetail(id) {
  await router.push({
    name: 'detail',
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
