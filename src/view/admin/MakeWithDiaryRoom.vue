<template>
  <CardContainer :title="obj.title">
    <div class="container">
      <div class="display-box">
        <h3>성도검색</h3>
        <div>
          <label for="title">팀이름</label><br />
          <input
            type="text"
            id="title"
            class="input-title"
            placeholder="제 1기 예수동행일기"
            v-model="teamName"
          />
          <div class="search-box">
            <label for="title">성도검색</label><br />
            <div class="search-group">
              <input
                type="text"
                id="title"
                class="input-title"
                placeholder="whtrade7290"
                v-model="searchUser"
              />
              <button
                class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0 btn-search"
                @click="search"
              >
                검색
              </button>
            </div>
          </div>
        </div>
        <h5>검색결과</h5>
        <div>
          <div class="info-el">
            <label>ID</label>
            <h5>{{ user.id }}</h5>
          </div>
          <div class="info-el">
            <label for="info-el">계정명</label>
            <h5>{{ user.username }}</h5>
          </div>
          <div class="info-el">
            <label>이름</label>
            <h5>{{ user.name }}</h5>
          </div>
          <div class="info-el">
            <label>권한</label>
            <h5>{{ user.role }}</h5>
          </div>
          <div class="info-el">
            <label>가입날짜</label>
            <h5>{{ formatDate(user.createAt) }}</h5>
          </div>
        </div>
        <div class="btn-box">
          <button
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            @click="pushUser"
          >
            추가
          </button>
        </div>
      </div>
      <div class="display-box">
        <div>
          <h3>{{ teamName || '팀이름' }}</h3>
        </div>
        <div style="margin-bottom: 1.5rem; margin-top: 1rem">
          <h4>팀리스트</h4>
        </div>
        <div class="list-box">
          <div class="list-el" v-for="user in userList" :key="user">
            <span class="info-span">아이디: {{ user.id }}</span>
            <span class="info-span">계정명: {{ user.username }}</span>
            <span class="info-span">이름: {{ user.name }}</span>
            <span class="info-span"
              ><a href="javascript:;" class="btn-delete" @click="deleteUser(user.id)">
                삭제
              </a></span
            >
          </div>
        </div>
        <div class="btn-box">
          <button
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            @click="make"
          >
            개설
          </button>
        </div>
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

const user = ref({
  id: '',
  username: '',
  name: '',
  role: '',
  createAt: ''
})

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
    // 사용자 검색 요청
    await store.dispatch('SEARCH_USER', { searchUser: searchUser.value })

    const resUser = store.state.user // 사용자 정보 가져오기

    console.log('resUser: ', resUser)

    // 검색 결과가 있을 때
    if (resUser && resUser.id) {
      // 기존 사용자 리스트에서 중복된 사용자가 있는지 확인
      const existingUser = userList.value.find((item) => item.id === resUser.id)

      if (!existingUser) {
        // 중복되지 않은 경우에만 추가
        user.value.id = resUser.id
        user.value.username = resUser.username
        user.value.name = resUser.name
        user.value.role = resUser.role
        user.value.createAt = resUser.create_at

        console.log('user.value: ', user.value)

        // 사용자 추가 알림
        await Swal.fire({
          title: '사용자를 찾았습니다.',
          icon: 'success'
        })
      } else {
        Swal.fire({
          title: '이미 추가된 사용자입니다',
          icon: 'info'
        })
      }
    } else {
      // 검색 결과가 없는 경우
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

const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}. ${month}. ${day}. ${hours}:${minutes}`
  } else {
    return ''
  }
}

const pushUser = async () => {
  // user.value가 객체인지 확인하고, 비어있지 않다면 진행
  if (user.value && user.value.id !== '') {
    // user.value의 깊은 복사본을 userList에 추가
    userList.value.push({ ...user.value })

    await Swal.fire({
      title: '성도가 추가되었습니다.',
      icon: 'success'
    })

    // user.value 초기화
    user.value = {}
  } else {
    // user.value가 비어있는 경우 오류 메시지 표시
    await Swal.fire({
      title: '검색된 성도가 없습니다.',
      icon: 'error'
    })
  }
}

const deleteUser = async (id) => {
  await Swal.fire({
    title: '삭제되었습니다.',
    icon: 'success'
  })
  userList.value = userList.value.filter((user) => user.id !== id)
}
</script>

<style scoped>
.container {
  display: flex;
}
.display-box {
  width: 50%;
  height: 34rem;
  border: solid 1px #cccccc;
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin: 1rem;
}

.search-box {
  margin-bottom: 2rem;
}
.search-group {
  display: flex;
  justify-content: start;
}
.info-el {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
}
.btn-box {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.btn-search {
  margin-left: 1rem;
}
.list-box {
  width: 100%;
  height: 20rem;
  border: 1px solid #999999;
  border-radius: 1.5rem;
  padding: 1rem;
}
.list-el {
  width: 100%;
  height: 1.5rem;
  border: 1px dotted #cccccc;
  border-radius: 0.5rem;
}
.info-span {
  margin-left: 1rem;
  font-weight: bold;
  font-size: 0.9rem;
}
.btn-delete {
  color: #4d88ff;
}
</style>
