<template>
  <!-- Navbar -->
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <nav
          class="navbar navbar-expand-xl blur blur-rounded top-0 z-index-fixed shadow position-absolute my-3 py-2 start-0 end-0 mx-4"
        >
          <div class="container-fluid px-0">
            <img src="/f_logo.png" style="width: 50px" />
            <router-link
              to="/"
              class="navbar-brand font-weight-bolder ms-sm-3"
              rel="tooltip"
              title="Designed and Coded by Creative Tim"
              data-placement="bottom"
              style="
                font-size: 18px;
                padding: 0;
                letter-spacing: 5px;
                font-family: 'M PLUS Rounded 1c';
              "
            >
              {{ $t('main') }}
            </router-link>
            <button class="navbar-toggler shadow-none ms-2" type="button" @click="toggleMenu">
              <span class="navbar-toggler-icon mt-2">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
              </span>
            </button>
            <div class="collapse navbar-collapse" id="navigation">
              <ul class="navbar-nav navbar-nav-hover w-100 nav-container">
                <template v-for="menu in mainMenus" :key="menu.mainKey">
                  <li
                    v-if="
                      (menu.mainKey === 'adminPage' && store.state.isLogin && role === 'ADMIN') ||
                      (menu.mainKey === 'withDiary' && store.state.isLogin) ||
                      (menu.mainKey !== 'adminPage' && menu.mainKey !== 'withDiary')
                    "
                    class="nav-item dropdown dropdown-hover mx-2"
                  >
                    <a
                      class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center"
                      href="javascript:;"
                      :id="`${menu.mainKey}Dropdown`"
                      @click="toggleDropdown(menu.mainKey)"
                    >
                      {{ $t(`nav.${menu.mainKey}.title`) }}&nbsp;
                      <DownArrowDarkVue></DownArrowDarkVue>
                    </a>
                    <div
                      class="dropdown-menu dropdown-menu-xl-start dropdown-menu-animation dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
                    >
                      <div class="d-none d-lg-block" v-for="subTitle in menu.subTitles">
                        <div
                          @click="goToPage(subTitle)"
                          class="dropdown-item border-radius-md nav-btn"
                        >
                          <span class="ps-3">{{
                            $t(`nav.${menu.mainKey}.subTitles.${subTitle}`)
                          }}</span>
                        </div>
                      </div>
                      <div class="d-lg-none" v-for="subTitle in menu.subTitles">
                        <div @click="goToPage(subTitle)" class="dropdown-item border-radius-md">
                          <span class="ps-3">{{
                            $t(`nav.${menu.mainKey}.subTitles.${subTitle}`)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
              <div class="nav-btn-container">
                <template v-if="store.state.isLogin">
                  <a
                    href="javascript:;"
                    class="btn bg-gradient-primary btn-round btn-style"
                    @click="logout"
                    >{{ $t('button.logout') }}</a
                  >

                  <a
                    href="javascript:;"
                    class="btn btn-sm bg-gradient-primary btn-round btn-style"
                    @click="changeLanguage()"
                    >{{ $t('button.lang') }}</a
                  >
                </template>
                <template v-else>
                  <div
                    @click="goToPage('login')"
                    class="btn btn-sm bg-gradient-primary btn-round btn-style"
                  >
                    {{ $t('button.login') }}
                  </div>
                  <a
                    href="javascript:;"
                    class="btn btn-sm bg-gradient-primary btn-round btn-style"
                    @click="changeLanguage()"
                    >{{ $t('button.lang') }}</a
                  >
                </template>
              </div>
            </div>
          </div>
        </nav>
        <!-- End Navbar -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { useI18n } from 'vue-i18n'
import DownArrowDarkVue from '@/assets/img/svg/DownArrowDark.vue'
import ko from '@/locales/ko.json'
import { useRouter } from 'vue-router'
import { Collapse, Dropdown } from 'bootstrap'

const store = useStore()
const router = useRouter()

let bsCollapse = null
const dropdownInstances = ref([])

const mainMenus = Object.entries(ko.nav).map((mainMenu) => {
  return {
    mainKey: mainMenu[0],
    subTitles: Object.keys(mainMenu[1].subTitles)
  }
})

const staticPath = `${import.meta.env.VITE_API_URL}uploads/assets/main/`
const { locale, t } = useI18n()

function getParsedStoredData() {
  const storedData = localStorage.getItem(getUserIdFromCookie())
  if (storedData) {
    const parsedData = JSON.parse(storedData)

    return {
      accessToken: parsedData.token || '',
      refreshToken: parsedData.refreshToken || '',
      userId: parsedData.user?.id || '',
      storedRole: parsedData.user?.role || ''
    }
  }
  return {
    accessToken: '',
    refreshToken: '',
    userId: '',
    storedRole: ''
  }
}

const { accessToken, refreshToken, storedRole } = getParsedStoredData()
const role = ref(storedRole)

console.log('role: ', role)

// 로그아웃 함수
function logout() {
  Swal.fire({
    title: t('modalMsg.logout'),
    icon: 'question',
    showCancelButton: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      localStorage.removeItem(getUserIdFromCookie())
      document.cookie = 'userId=;'
      await Swal.fire({
        title: t('modalMsg.logouted'),
        icon: 'success'
      }).then(async () => {
        role.value = ''
        await store.dispatch('CHECKING_TOKEN', { accessToken: '', refreshToken: '' })
        store.dispatch('CLEAR_STATE')
        router.push('/')
      })
    }
  })
}

// 준비중입니다 알림
const readyYet = () => {
  Swal.fire({
    title: '준비중입니다^^;',
    icon: 'info'
  })
}

// 언어 변경 함수
const changeLanguage = () => {
  Swal.fire({
    title: t('modalMsg.changeLang'),
    icon: 'question',
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      const newLang = localStorage.getItem('getLanguage') === 'jp' ? 'ko' : 'jp'
      localStorage.setItem('getLanguage', newLang) // ✅ 변경된 언어를 localStorage에 저장
      locale.value = newLang // ✅ Vue I18n 언어 변경
      window.document.title = t('main')
    }
    toggleHide()
    closeAllDropdowns()
  })
}

// 예수동행일기 그룹 존재 여부 확인
const checkRoomAvailability = async () => {
  const rooms = store.state.rooms
  if (!rooms || rooms.length === 0) {
    await Swal.fire({
      title: '예수동행일기 그룹이 존재하지 않습니다.',
      icon: 'warning'
    })
    return false
  }
  return true
}

const goToPage = async (path) => {
  if (!path) return

  toggleHide()
  closeAllDropdowns()

  if (path !== 'withDiary') {
    router.push({ name: path })
  } else {
    try {
      const { userId } = getParsedStoredData()

      await store.dispatch('FETCH_WITHDIARY_ROOM_LIST', { userId: userId })

      if (!(await checkRoomAvailability())) return

      const roomList = store.state.rooms

      const optionsHtml =
        `
      <style>
        .custom-radio-label {
          display: inline-block;
          margin-bottom: 10px;
        }

        .custom-radio-label input[type="radio"] {
          display: none; /* 기본 라디오 버튼 숨김 */
        }

        .custom-radio-button {
          display: inline-block;
          padding: 10px 20px;
          border: 2px solid #ccc;
          border-radius: 4px;
          background-color: #f7f7f7;
          cursor: pointer;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .custom-radio-label input[type="radio"]:checked + .custom-radio-button {
          background-color: #4CAF50; /* 선택된 버튼 배경색 */
          border-color: #4CAF50; /* 선택된 버튼 테두리색 */
          color: white; /* 선택된 버튼 텍스트 색 */
        }

        .custom-radio-button:hover {
          background-color: #e0e0e0;
          border-color: #bdbdbd;
        }
      </style>
    ` +
        roomList
          .map(
            (room) =>
              `
     <label class="custom-radio-label">
        <input type="radio" name="radioOption" value="${room.diaryRoom.id}">
        <span class="custom-radio-button">${room.diaryRoom.roomName}</span>
    </label><br>
    `
          )
          .join('')

      const result = await Swal.fire({
        title: t('modalMsg.withDiaryRoom'),
        html: optionsHtml,
        showCancelButton: true,
        cancelButtonText: '취소',
        confirmButtonText: t('button.enterWithDiary'),
        preConfirm: () => {
          const selectedOption = document.querySelector('input[name="radioOption"]:checked')
          if (!selectedOption) {
            Swal.showValidationMessage('일기방을 선택해주세요.')
          }
          return selectedOption ? selectedOption.value : null
        }
      })

      if (result.isConfirmed) {
        await router.push({ name: 'withDiary', query: { roomId: result.value, pageNum: 1 } })
        await store.dispatch('FETCH_WITHDIARY_ROOM', { roomId: result.value })

        let payload = {
          name: 'withDiary',
          startRow: 0,
          pageSize: 5,
          roomId: store.state.room.id
        }

        await store.dispatch('FETCH_WITHDIARY_BOARDCOUNT', store.state.room.id)
        await store.dispatch('FETCH_WITHDIARY_DATALIST', payload)
      }
    } catch (error) {
      console.error('Error in withDiary:', error)
    }
  }
}

const toggleMenu = () => {
  bsCollapse?.toggle()
}

const toggleHide = () => {
  bsCollapse?.hide()
}

const closeAllDropdowns = () => {
  dropdownInstances.value.forEach((dropdown) => dropdown.hide())
}

const toggleDropdown = (id) => {
  const target = dropdownInstances.value.find((_, i) => mainMenus[i].mainKey === id)

  if (target) {
    target.toggle()
  }
}

// 토큰 검사 실행
onMounted(async () => {
  await nextTick()
  await store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken }) // ✅ 비동기 액션 대기
  getParsedStoredData()

  const storedLang = localStorage.getItem('getLanguage') // ✅ 중복 호출 제거

  if (!storedLang) {
    locale.value = 'jp'
    localStorage.setItem('getLanguage', 'jp') // ✅ 한 번만 저장
  } else {
    locale.value = storedLang // ✅ 기존 값 사용
  }

  const collapseEl = document.getElementById('navigation')
  bsCollapse = new Collapse(collapseEl, { toggle: false })

  dropdownInstances.value = mainMenus
    .map((menu) => {
      const el = document.getElementById(`${menu.mainKey}Dropdown`)
      if (el) {
        return new Dropdown(el, { autoClose: true })
      }
      return null
    })
    .filter(Boolean)
})
</script>

<style scoped>
.custom-radio-label {
  color: red;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 5px;
}

.custom-radio-label input[type='radio'] {
  margin-right: 10px;
}
.nav-container {
  display: flex;
  justify-content: flex-start;
}
.nav-btn-container {
  display: flex;
  justify-content: end;
  margin-top: 16px;
  gap: 10px;
}
.btn-style {
  display: flex;
  align-items: center; /* 세로 가운데 */
  justify-content: center; /* 가로 가운데 */
  width: 120px;
  height: 35px;
}
</style>
