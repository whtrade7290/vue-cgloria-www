<template>
  <div class="container">
    <div class="search-people-container">
      <div>
        <label>성도검색</label>
        <div class="search-box">
          <input type="text" class="form-control" placeholder="acount" v-model="acount" />
          <button type="button" class="btn bg-gradient-primary search-button" @click="searchUser">
            검색
          </button>
        </div>
      </div>
    </div>
    <div class="added-people-container" style="margin-top: 5rem">
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
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
              style="width: 25%; text-align: center"
            >
              계정명
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
              style="width: 25%; text-align: center"
            >
              이름
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
              style="width: 20%; text-align: center"
            >
              가입날짜
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
              style="width: 10%; text-align: center"
            >
              삭제
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="props.userList.length > 0">
            <tr v-for="(item, idx) in props.userList" :key="idx">
              <td style="width: 10%; text-align: center">
                <p class="text-sm font-weight-bold mb-0 text-center">{{ item.id }}</p>
              </td>
              <td style="width: 25%; text-align: left">
                <p class="text-sm font-weight-bold mb-0 text-center">{{ item.username }}</p>
              </td>
              <td style="width: 25%; text-align: center">
                <p class="text-sm font-weight-bold mb-0 text-center">{{ item.name }}</p>
              </td>
              <td style="width: 20%; text-align: center">
                <p class="text-sm font-weight-bold mb-0 text-center">
                  {{ formatDate(item.create_at) }}
                </p>
              </td>
              <td style="width: 10%; text-align: center">
                <a href="javascript:;" @click="deleteUser(item.id)"
                  ><p class="text-sm font-weight-bold mb-0 text-center text-danger">삭제</p></a
                >
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5" class="no-results">
                <div class="result-container">
                  <i class="fas fa-search"></i>
                  <p class="result-text">성도를 추가해주세요.</p>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/utils/dateFormat'
import { ref } from 'vue'

const acount = ref('')
const emit = defineEmits(['search-user'])

const props = defineProps({
  userList: Array
})

const searchUser = () => {
  emit('search-user', acount.value)
  acount.value = ''
}

const deleteUser = (id) => {
  emit('delete-user', id)
}
</script>

<style scoped>
.search-people-container {
  width: 100%;
}
.search-box {
  display: flex;
}
.search-button {
  margin-bottom: 0 !important;
  margin-left: 2rem;
  width: 20%;
}

.added-people-container {
  overflow: auto;
}
.no-results {
  text-align: center;
  vertical-align: middle;
  height: 200px;
  background-color: #f8f9fa; /* 연한 회색 배경 */
  border: 1px solid #ddd; /* 테두리 */
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

.result-text {
  font-size: 18px;
  font-weight: bold;
  color: #555; /* 어두운 회색 */
  margin-top: 10px;
}
</style>
