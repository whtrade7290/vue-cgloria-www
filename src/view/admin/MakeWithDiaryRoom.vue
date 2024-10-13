<template>
  <CardContainer :title="obj.title">
    <div style="padding: 1.5rem">
      <div class="withDiary-box">
        <div>
          <label for="title">팀이름</label><br />
          <input
            type="text"
            id="title"
            class="input-title"
            placeholder="제 1기 예수동행일기"
            v-model="teamName"
          />
        </div>
        <div>
          <label for="title">성도 검색</label><br />
          <input
            type="text"
            id="title"
            class="btn-search"
            placeholder="whtrade7290"
            v-model="searchUser"
          />

          <a
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            href="javascript:;"
            @click="search"
            >성도검색</a
          >
        </div>
      </div>
      <div class="member-container">
        <div class="member-box">
          <div class="name-label-box" v-for="item in userList" :key="item">
            <div class="name-label">{{ item.name || item.username }}</div>
          </div>
        </div>
      </div>
      <div style="margin-top: 1rem; margin-left;: 2.5rem; display: flex; justify-content: end;">
        <a
          class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
          href="javascript:;"
          @click="make"
          >개설</a
        >
      </div>
    </div>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import Swal from 'sweetalert2'
import { useStore } from 'vuex'
import { ADMIN } from '@/data/sidemenu.js'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', ADMIN)
obj.value = ADMIN.find((o) => route.name === o.path)

const { t } = useI18n()
const router = useRouter()

const teamName = ref('')
const searchUser = ref('')

const userList = ref([])

const make = async () => {
  if (teamName.value.trim() === '') {
    Swal.fire({
      title: '팀이름을 입력하여주세요.',
      icon: 'error'
    })
    return
  }

  if (userList.value.length === 0) {
    Swal.fire({
      title: '팀원을 입력하여주세요.',
      icon: 'error'
    })
    return
  }

  let userIdList = userList.value.map((user) => {
    return user.id
  })

  const result = await store.dispatch('MAKE_WITHDIARY', {
    teamName: teamName.value,
    userIdList: userIdList
  })

  if (result) {
    Swal.fire({
      title: t('modalMsg.makeWithDiary'),
      icon: 'success'
    }).then(() => {
      router.push('/')
    })
  } else {
    Swal.fire({
      title: t('modalMsg.failWithDiary'),
      icon: 'error'
    })
  }

  teamName.value = ''
  userIdList = []
  userList.value = []
}

const search = async () => {
  if (searchUser.value.trim() === '') {
    Swal.fire({
      title: '아이디를 입력해주세요',
      icon: 'error'
    })
    return
  }

  try {
    await store.dispatch('SEARCH_USER', { searchUser: searchUser.value })

    const user = store.state.user
    if (user) {
      // 기존 사용자 리스트에서 중복된 사용자가 있는지 확인
      const existingUser = userList.value.find((item) => item.id === user.id)

      if (!existingUser) {
        // 중복되지 않은 경우에만 추가
        userList.value.push(user)
        store.commit('SET_USER', {}) // store에서 사용자 정보 초기화
      } else {
        Swal.fire({
          title: '이미 추가된 사용자입니다',
          icon: 'info'
        })
      }
    } else {
      Swal.fire({
        title: '사용자를 찾을 수 없습니다',
        icon: 'error'
      })
    }

    searchUser.value = '' // 검색어 초기화
  } catch (error) {
    Swal.fire({
      title: '검색 중 오류가 발생했습니다',
      text: error.response?.data?.message || '서버와의 연결이 끊겼습니다',
      icon: 'error'
    })
  }
}
</script>

<style scoped>
.withDiary-box {
  display: flex;

  justify-content: space-around;
}
.btn-search {
  margin-right: 1rem;
}
.member-box {
  width: 40rem;
  height: 5rem;
  border: 1px solid #dddddd;
  border-radius: 1.5rem;
  display: flex;
  margin-top: 3rem;
  margin-right: 6.5rem;
}
.name-label-box {
  width: 7rem;
  height: 3.5rem;
  border-radius: 1.25rem;
  border: 2px solid #c5b5aa;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem;
}
.name-label {
  font-weight: bold;
  color: #c5b5aa;
}
.member-container {
  display: flex;
  justify-content: center;
}
</style>
