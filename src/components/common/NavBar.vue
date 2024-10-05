<template>
  <!-- Navbar -->
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <nav
          class="navbar navbar-expand-lg blur blur-rounded top-0 z-index-fixed shadow position-absolute my-3 py-2 start-0 end-0 mx-4"
        >
          <div class="container-fluid px-0">
            <img src="@/assets/img/main/f_logo.png" style="width: 50px" />
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
              {{ $t('nav.main') }}
            </router-link>
            <button
              class="navbar-toggler shadow-none ms-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navigation"
              aria-controls="navigation"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon mt-2">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
              </span>
            </button>
            <div class="collapse navbar-collapse pt-3 pb-2 py-lg-0 w-100" id="navigation">
              <ul class="navbar-nav navbar-nav-hover w-100">
                <li class="nav-item dropdown dropdown-hover mx-2">
                  <a
                    class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center"
                    href="javascript:;"
                    id="dropdownMenuPages"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ $t('nav.intro') }}&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/intro" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle1.intro') }}</span>
                      </router-link>
                      <!-- <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">예배 및 훈련시간</span>
                      </a> -->
                      <router-link to="/paster" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle1.paster') }}</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md" @click="readyYet">
                        <span class="ps-3">{{ $t('nav.subTitle1.location') }}</span>
                      </a>
                      <router-link to="/notice" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle1.notice') }}</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/intro" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle1.intro') }}</span>
                      </router-link>
                      <!-- <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">예배 및 훈련시간</span>
                      </a> -->
                      <router-link to="/paster" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle1.paster') }}</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md" @click="readyYet">
                        <span class="ps-3">{{ $t('nav.subTitle1.location') }}</span>
                      </a>
                      <router-link to="/notice" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle1.notice') }}</span>
                      </router-link>
                    </div>
                  </div>
                </li>

                <li class="nav-item dropdown dropdown-hover mx-2">
                  <a
                    class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center"
                    href="javascript:;"
                    id="dropdownMenuPages"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ $t('nav.class/word') }}&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/sermon" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle2.sermon') }}</span>
                      </router-link>
                      <router-link to="/column" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle2.column') }}</span>
                      </router-link>
                      <router-link to="/weekly" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle2.weeklyWord') }}</span>
                      </router-link>
                      <router-link to="/classMeeting" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle2.classMeeting') }}</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/sermon" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle2.sermon') }}</span>
                      </router-link>
                      <router-link to="/column" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle2.column') }}</span>
                      </router-link>
                      <router-link to="/weekly" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle2.weeklyWord') }}</span>
                      </router-link>
                      <router-link to="/classMeeting" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle2.classMeeting') }}</span>
                      </router-link>
                    </div>
                  </div>
                </li>

                <li class="nav-item dropdown dropdown-hover mx-2">
                  <a
                    class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center"
                    href="javascript:;"
                    id="dropdownMenuPages"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ $t('nav.worship/training') }}&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <!-- <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">예배/훈련시간</span>
                      </a> -->
                      <router-link to="/jumokja" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle3.jumok') }}</span>
                      </router-link>
                      <router-link to="/training" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle3.training') }}</span>
                      </router-link>
                      <!-- <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">중보기도</span>
                      </a> -->
                    </div>
                    <div class="d-lg-none">
                      <!-- <a href="./pages/about-us.html" class="dropdown-item border-radius-md">
                        <span class="ps-3">예배/훈련시간</span>
                      </a> -->
                      <router-link to="/jumokja" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle3.jumok') }}</span>
                      </router-link>
                      <router-link to="/training" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle3.training') }}</span>
                      </router-link>
                      <!-- <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">중보기도</span>
                      </a> -->
                    </div>
                  </div>
                </li>

                <li class="nav-item dropdown dropdown-hover mx-2">
                  <a
                    class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center"
                    href="javascript:;"
                    id="dropdownMenuPages"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ $t('nav.evangelism/service') }}&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/evangelize" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle4.evangelismAndVision') }}</span>
                      </router-link>
                      <!-- <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">4영리</span>
                      </a> -->
                      <a
                        href="javascript:;"
                        class="dropdown-item border-radius-md"
                        @click="readyYet"
                      >
                        <span class="ps-3">{{ $t('nav.subTitle4.readBible') }}</span>
                      </a>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/evangelize" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle4.evangelismAndVision') }}</span>
                      </router-link>
                      <a href="javascript:;" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle4.readBible') }}</span>
                      </a>
                      <!-- <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">섬김</span>
                      </a> -->
                    </div>
                  </div>
                </li>

                <li class="nav-item dropdown dropdown-hover mx-2">
                  <a
                    class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center"
                    href="javascript:;"
                    id="dropdownMenuPages"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ $t('nav.sundaySchool') }}&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/schedule" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle5.eventSchedule') }}</span>
                      </router-link>
                      <router-link to="/school_photo" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle5.schoolPhotoBoard') }}</span>
                      </router-link>
                      <router-link to="/library" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle5.library') }}</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/schedule" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle5.eventSchedule') }}</span>
                      </router-link>
                      <router-link to="/school_photo" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle5.schoolPhotoBoard') }}</span>
                      </router-link>
                      <router-link to="/library" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle5.library') }}</span>
                      </router-link>
                    </div>
                  </div>
                </li>

                <li class="nav-item dropdown dropdown-hover mx-2">
                  <a
                    class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center"
                    href="javascript:;"
                    id="dropdownMenuPages"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ $t('nav.fellowshipArea') }}&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/generalForum" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle6.generalFolum') }}</span>
                      </router-link>
                      <router-link to="/photo" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle6.photoBoard') }}</span>
                      </router-link>
                      <router-link to="/testimony" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle6.testimony') }}</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/generalForum" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle6.generalFolum') }}</span>
                      </router-link>
                      <router-link to="/photo" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle6.photoBoard') }}</span>
                      </router-link>
                      <router-link to="/testimony" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle6.testimony') }}</span>
                      </router-link>
                    </div>
                  </div>
                </li>
                <li
                  class="nav-item dropdown dropdown-hover mx-2"
                  v-if="store.state.role === 'ADMIN' || role === 'ADMIN'"
                >
                  <a
                    class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center"
                    href="javascript:;"
                    id="dropdownMenuPages"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ $t('nav.adminPage') }}
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/make_withDiary" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle7.makeWithDiary') }}</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/make_withDiary" class="dropdown-item border-radius-md">
                        <span class="ps-3">{{ $t('nav.subTitle7.makeWithDiary') }}</span>
                      </router-link>
                    </div>
                  </div>
                </li>
                <template v-if="store.state.isLogIned">
                  <li class="nav-item my-auto ms-3 ms-lg-0 ms-lg-auto" style="float: left">
                    <a
                      href="javascript:;"
                      @click="goToWithDiary"
                      class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                      >{{ $t('button.withDiary') }}</a
                    >
                  </li>
                  <li class="nav-item my-auto ms-3 ms-lg-0">
                    <a
                      href="javascript:;"
                      class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                      @click="logout"
                      >{{ $t('button.logout') }}</a
                    >
                  </li>
                  <li class="nav-item my-auto ms-3 ms-lg-0">
                    <a
                      href="javascript:;"
                      class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                      @click="changeLanguage()"
                      >{{ $t('button.lang') }}</a
                    >
                  </li>
                </template>
                <li v-else class="nav-item my-auto ms-3 ms-lg-0 ms-lg-auto">
                  <router-link
                    to="/logIn"
                    class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                    >로그인</router-link
                  >
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <!-- End Navbar -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { getUserIdFromCookie } from '@/utils/cookie.js'
import router from '@/routes'
import { useI18n } from 'vue-i18n'
import DownArrowDarkVue from '@/assets/img/svg/DownArrowDark.vue'

const store = useStore()
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
const toggle = ref(true)

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
  locale.value = toggle.value ? 'jp' : 'ko'
  toggle.value = !toggle.value
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

// 예수동행일기 방 선택 및 이동
const goToWithDiary = async () => {
  try {
    const { userId } = getParsedStoredData()

    await store.dispatch('FETCH_WITHDIARY_ROOM_LIST', { userId: userId })

    if (!(await checkRoomAvailability())) return

    const roomList = store.state.rooms

    const optionsHtml = roomList
      .map(
        (room) =>
          `
      <label>
        <input type="radio" name="radioOption" value="${room.diaryRoom.id}"> ${room.diaryRoom.roomName}
      </label><br>
    `
      )
      .join('')

    const result = await Swal.fire({
      title: t('modalMsg.withDiaryRoom'),
      html: optionsHtml,
      confirmButtonText: 'Submit',
      preConfirm: () => {
        const selectedOption = document.querySelector('input[name="radioOption"]:checked')
        if (!selectedOption) {
          Swal.showValidationMessage('Please select an option')
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

// 토큰 검사 실행
onMounted(async () => {
  store.dispatch('CHECKING_TOKEN', { accessToken, refreshToken })
  getParsedStoredData()
})
</script>

<style scoped></style>
