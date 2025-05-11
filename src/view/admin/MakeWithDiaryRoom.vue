<template>
  <CardContainer :title="obj.title">
    <component
      :is="tabs[currentTab]"
      :user-list="userList"
      @search-user="search"
      @delete-user="deleteUser"
      @emit-info="getEmitInfo"
    />
    <div class="button-group">
      <div class="next-button-box pr-10" v-if="currentTab === 'MakeRoom'">
        <button type="button" class="btn bg-gradient-primary" @click="handleBack">이전</button>
      </div>
      <div class="next-button-box pr-10" v-if="userList.length > 0">
        <button
          type="button"
          class="btn bg-gradient-primary"
          @click="next"
          :disabled="!isMakeUserList && !isEnabled"
        >
          {{ isMakeUserList ? '다음' : '등록' }}
        </button>
      </div>
    </div>
  </CardContainer>
</template>

<script setup>
import Swal from 'sweetalert2'
import CardContainer from '@/components/common/card/CardContainer.vue'
import MakeUserList from '@/view/admin/MakeUserList.vue'
import MakeRoom from '@/view/admin/MakeRoom.vue'
import { useStore } from 'vuex'
import { ADMIN } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { formatDate } from '@/utils/dateFormat'

const tabs = { MakeUserList, MakeRoom }
const currentTab = ref('MakeUserList')
const isMakeUserList = ref(true)
const teamName = ref('')
const isEnabled = ref(false)

const getEmitInfo = ({ name, isDecided }) => {
  teamName.value = name
  isEnabled.value = isDecided
}

const next = async () => {
  if (!isMakeUserList.value) {
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
        title: '동행일기방이 개설되었습니다.',
        icon: 'success'
      }).then(() => {
        userList.value = []
        isMakeUserList.value = !isMakeUserList.value
        currentTab.value = isMakeUserList.value ? 'MakeUserList' : 'MakeRoom'
      })
    }
  } else {
    isMakeUserList.value = !isMakeUserList.value
    currentTab.value = isMakeUserList.value ? 'MakeUserList' : 'MakeRoom'
  }
}

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', ADMIN)
obj.value = ADMIN.find((o) => route.name === o.path)

const userList = ref([])

const handleBack = () => {
  isMakeUserList.value = !isMakeUserList.value
  currentTab.value = isMakeUserList.value ? 'MakeUserList' : 'MakeRoom'
}

const search = async (searchUser) => {
  if (searchUser.trim() === '') {
    Swal.fire({
      title: '아이디를 입력해주세요',
      icon: 'error'
    })
    return
  }

  try {
    // 사용자 검색 요청
    await store.dispatch('SEARCH_USER', { searchUser: searchUser })

    const resUser = store.state.user // 사용자 정보 가져오기

    // 검색 결과가 있을 때
    if (resUser && resUser.id) {
      const optionsHtml = `
  <style>
    .modal-info-container {
      width: 100%;
      padding: 10px 0;
      font-family: sans-serif;
    }

    .modal-info-table {
      width: 100%;
      border-collapse: collapse;
    }

    .modal-info-table tr {
      border-bottom: 1px solid #eee;
    }

    .modal-info-table td {
      padding: 6px 8px;
      vertical-align: middle;
      font-size: 14px;
    }

    .modal-info-label {
      color: #555;
      white-space: nowrap;
    }

    .modal-info-value {
      font-weight: 600;
      color: #222;
      text-align: center;
    }
  </style>

  <div class="modal-info-container">
    <table class="modal-info-table">
      <tr>
        <td class="modal-info-label">계정명</td>
        <td class="modal-info-value">${resUser.username}</td>
      </tr>
      <tr>
        <td class="modal-info-label">이름</td>
        <td class="modal-info-value">${resUser.name}</td>
      </tr>
      <tr>
        <td class="modal-info-label">권한</td>
        <td class="modal-info-value">${resUser.role}</td>
      </tr>
      <tr>
        <td class="modal-info-label">가입날짜</td>
        <td class="modal-info-value">${formatDate(resUser.create_at)}</td>
      </tr>
    </table>
  </div>
`

      Swal.fire({
        title: '성도를 찾았습니다. 추가하시겠습니까?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#f5c6aa',
        cancelButtonColor: '#f5d7c7',
        confirmButtonText: '예',
        cancelButtonText: '아니오',
        html: optionsHtml
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 기존 사용자 리스트에서 중복된 사용자가 있는지 확인
          const isExsistUser = userList.value.some((item) => item.id === resUser.id)
          if (!isExsistUser) {
            userList.value = [...userList.value, resUser]

            // 사용자 추가 알림
            await Swal.fire({
              title: '추가되었습니다.',
              icon: 'success'
            })
          } else {
            Swal.fire({
              title: '이미 추가된 사용자입니다',
              icon: 'info'
            })
          }
        }
      })
    } else {
      // 검색 결과가 없는 경우
      Swal.fire({
        title: '성도를 찾을 수 없습니다',
        showCancelButton: true
      })
    }
  } catch (error) {
    Swal.fire({
      title: '검색 중 오류가 발생했습니다',
      text: error.response?.data?.message || '서버와의 연결이 끊겼습니다',
      icon: 'error'
    })
  }
}

const deleteUser = (id) => {
  Swal.fire({
    title: '삭제되었습니다.',
    icon: 'success'
  }).then(() => {
    userList.value = userList.value.filter((user) => user.id !== id)
  })
}
</script>

<style scoped>
.next-button-box button {
  margin-left: 1rem;
  width: 8rem;
}
.button-group {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
