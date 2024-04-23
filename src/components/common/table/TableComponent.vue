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
        <li class="page-item disabled">
          <a class="page-link" href="javascript:;" tabindex="-1">
            <i class="fa fa-angle-left"></i>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item"><a class="page-link" href="javascript:;">1</a></li>
        <li class="page-item active"><a class="page-link" href="javascript:;">2</a></li>
        <li class="page-item"><a class="page-link" href="javascript:;">3</a></li>
        <li class="page-item">
          <a class="page-link" href="javascript:;">
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
const store = useStore()

const props = defineProps({
  called: {
    type: String,
    default: ''
  }
})
store.dispatch('FETCH_BOARDLIST', props.called)
</script>

<style lang="scss" scoped></style>
