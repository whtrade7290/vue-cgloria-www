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
      <div v-if="currentTab === 'MakeRoom'" class="next-button-box pr-10">
        <button type="button" class="btn bg-gradient-primary" @click="handleBack">
          {{ t('admin.makeWithDiary.prev') }}
        </button>
      </div>
      <div v-if="userList.length > 0" class="next-button-box pr-10">
        <button
          type="button"
          class="btn bg-gradient-primary"
          :disabled="!isMakeUserList && !isEnabled"
          @click="next"
        >
          {{ isMakeUserList ? t('admin.makeWithDiary.next') : t('admin.makeWithDiary.register') }}
        </button>
      </div>
    </div>
  </CardContainer>
</template>

<script setup>
import Swal from 'sweetalert2'
import CardContainer from '@/components/common/card/CardContainer.vue'
import MakeUserList from '@/view/admin/MakeWithDiary/MakeUserList.vue'
import MakeRoom from '@/view/admin/MakeWithDiary/MakeRoom.vue'
import { useStore } from 'vuex'
import { ADMIN } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { formatDate } from '@/utils/dateFormat'
import { getThemeColor } from '@/utils/theme'
import { useI18n } from 'vue-i18n'

const tabs = { MakeUserList, MakeRoom }
const currentTab = ref('MakeUserList')
const isMakeUserList = ref(true)
const teamName = ref('')
const isEnabled = ref(false)
const { t } = useI18n()
const themePrimaryColor = getThemeColor('--gloria-primary', '#f5c6aa')
const themePrimaryLight = getThemeColor('--gloria-primary-light', '#f7e7dc')

const getEmitInfo = ({ name, isDecided }) => {
  teamName.value = name
  isEnabled.value = isDecided
}

const next = async () => {
  if (!isMakeUserList.value) {
    if (teamName.value.trim() === '') {
      Swal.fire({
        title: t('admin.makeWithDiary.teamNameRequired'),
        icon: 'error'
      })
      return
    }

    if (userList.value.length === 0) {
      Swal.fire({
        title: t('admin.makeWithDiary.memberRequired'),
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
      title: t('admin.makeWithDiary.usernameRequired'),
      icon: 'error'
    })
    return
  }

  try {
    // Request user search
    await store.dispatch('SEARCH_USER_BY_USERNAME_OR_NAME', { searchUser: searchUser })

    const resUser = store.state.searchedUser // Retrieved user info

    // When user exists
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
        <td class="modal-info-label">${t('table.approvePage.account')}</td>
        <td class="modal-info-value">${resUser.username}</td>
      </tr>
      <tr>
        <td class="modal-info-label">${t('table.approvePage.name')}</td>
        <td class="modal-info-value">${resUser.name}</td>
      </tr>
      <tr>
        <td class="modal-info-label">${t('table.approvePage.role')}</td>
        <td class="modal-info-value">${resUser.role}</td>
      </tr>
      <tr>
        <td class="modal-info-label">${t('admin.makeWithDiary.joinDate')}</td>
        <td class="modal-info-value">${formatDate(resUser.create_at)}</td>
      </tr>
    </table>
  </div>
`

      Swal.fire({
        title: t('admin.makeWithDiary.foundConfirm'),
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: themePrimaryColor,
        cancelButtonColor: themePrimaryLight,
        confirmButtonText: t('admin.makeWithDiary.confirmYes'),
        cancelButtonText: t('admin.makeWithDiary.confirmNo'),
        html: optionsHtml
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Prevent duplicate additions
          const isExsistUser = userList.value.some((item) => item.id === resUser.id)
          if (!isExsistUser) {
            userList.value = [...userList.value, resUser]

            // Show success feedback
            await Swal.fire({
              title: t('admin.makeWithDiary.added'),
              icon: 'success'
            })
          } else {
            Swal.fire({
              title: t('admin.makeWithDiary.alreadyAdded'),
              icon: 'info'
            })
          }
        }
      })
    } else {
      // No user found
      Swal.fire({
        title: t('admin.makeWithDiary.notFound'),
        icon: 'info'
      })
    }
  } catch (error) {
    Swal.fire({
      title: t('admin.makeWithDiary.searchError'),
      text: error.response?.data?.message || t('admin.makeWithDiary.networkError'),
      icon: 'error'
    })
  }
}

const deleteUser = (id) => {
  Swal.fire({
    title: t('admin.makeWithDiary.deleted'),
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
