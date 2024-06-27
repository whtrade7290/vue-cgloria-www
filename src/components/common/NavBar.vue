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
              中央栄光教会
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
                    교회소개&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/intro" class="dropdown-item border-radius-md">
                        <span class="ps-3">교회소개</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">예배 및 훈련시간</span>
                      </a>
                      <router-link to="/paster" class="dropdown-item border-radius-md">
                        <span class="ps-3">목회자소개</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">교회약도</span>
                      </a>
                      <router-link to="/notice" class="dropdown-item border-radius-md">
                        <span class="ps-3">공지사항</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/intro" class="dropdown-item border-radius-md">
                        <span class="ps-3">교회소개</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">예배 및 훈련시간</span>
                      </a>
                      <router-link to="/paster" class="dropdown-item border-radius-md">
                        <span class="ps-3">목회자소개</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">교회약도</span>
                      </a>
                      <router-link to="/notice" class="dropdown-item border-radius-md">
                        <span class="ps-3">공지사항</span>
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
                    속회/말씀&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/sermon" class="dropdown-item border-radius-md">
                        <span class="ps-3">설교</span>
                      </router-link>
                      <router-link to="/column" class="dropdown-item border-radius-md">
                        <span class="ps-3">칼럼</span>
                      </router-link>
                      <router-link to="/weekly" class="dropdown-item border-radius-md">
                        <span class="ps-3">금주의 성경말씀</span>
                      </router-link>
                      <router-link to="/classMeeting" class="dropdown-item border-radius-md">
                        <span class="ps-3">속회교재실</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/sermon" class="dropdown-item border-radius-md">
                        <span class="ps-3">설교</span>
                      </router-link>
                      <router-link to="/column" class="dropdown-item border-radius-md">
                        <span class="ps-3">칼럼</span>
                      </router-link>
                      <router-link to="/weekly" class="dropdown-item border-radius-md">
                        <span class="ps-3">금주의 성경말씀</span>
                      </router-link>
                      <router-link to="/classMeeting" class="dropdown-item border-radius-md">
                        <span class="ps-3">속회교재실</span>
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
                    예배/훈련&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">예배/훈련시간</span>
                      </a>
                      <router-link to="/jumokja" class="dropdown-item border-radius-md">
                        <span class="ps-3">주목자예배</span>
                      </router-link>
                      <router-link to="/training" class="dropdown-item border-radius-md">
                        <span class="ps-3">훈련</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">중보기도</span>
                      </a>
                    </div>
                    <div class="d-lg-none">
                      <a href="./pages/about-us.html" class="dropdown-item border-radius-md">
                        <span class="ps-3">예배/훈련시간</span>
                      </a>
                      <router-link to="/jumokja" class="dropdown-item border-radius-md">
                        <span class="ps-3">주목자예배</span>
                      </router-link>
                      <router-link to="/training" class="dropdown-item border-radius-md">
                        <span class="ps-3">훈련</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">중보기도</span>
                      </a>
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
                    전도/섬김&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/evangelize" class="dropdown-item border-radius-md">
                        <span class="ps-3">전도비전</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">4영리</span>
                      </a>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">섬김</span>
                      </a>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/evangelize" class="dropdown-item border-radius-md">
                        <span class="ps-3">전도비전</span>
                      </router-link>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">4영리</span>
                      </a>
                      <a href="#" class="dropdown-item border-radius-md">
                        <span class="ps-3">섬김</span>
                      </a>
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
                    주일학교&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/schedule" class="dropdown-item border-radius-md">
                        <span class="ps-3">행사일정</span>
                      </router-link>
                      <router-link to="/school_photo" class="dropdown-item border-radius-md">
                        <span class="ps-3">주일학교 사진갤러리</span>
                      </router-link>
                      <router-link to="/library" class="dropdown-item border-radius-md">
                        <span class="ps-3">주일학교 자료실</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/schedule" class="dropdown-item border-radius-md">
                        <span class="ps-3">행사일정</span>
                      </router-link>
                      <router-link to="/school_photo" class="dropdown-item border-radius-md">
                        <span class="ps-3">주일학교 사진갤러리</span>
                      </router-link>
                      <router-link to="/library" class="dropdown-item border-radius-md">
                        <span class="ps-3">주일학교 자료실</span>
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
                    교재마당&nbsp;
                    <DownArrowDarkVue></DownArrowDarkVue>
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-animation dropdown-md p-3 border-radius-lg mt-0 mt-lg-3"
                    aria-labelledby="dropdownMenuPages"
                  >
                    <div class="d-none d-lg-block">
                      <router-link to="/generalForum" class="dropdown-item border-radius-md">
                        <span class="ps-3">자유게시판</span>
                      </router-link>
                      <router-link to="/photo" class="dropdown-item border-radius-md">
                        <span class="ps-3">사진갤러리</span>
                      </router-link>
                      <router-link to="/testimony" class="dropdown-item border-radius-md">
                        <span class="ps-3">간증게시판</span>
                      </router-link>
                    </div>
                    <div class="d-lg-none">
                      <router-link to="/generalForum" class="dropdown-item border-radius-md">
                        <span class="ps-3">자유게시판</span>
                      </router-link>
                      <router-link to="/photo" class="dropdown-item border-radius-md">
                        <span class="ps-3">사진갤러리</span>
                      </router-link>
                      <router-link to="/testimony" class="dropdown-item border-radius-md">
                        <span class="ps-3">간증게시판</span>
                      </router-link>
                    </div>
                  </div>
                </li>
                <li v-if="store.state.isLogIned" class="nav-item my-auto ms-3 ms-lg-0 ms-lg-auto">
                  <router-link
                    to="/logIn"
                    class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                    >로그인{{ store.state.isLogIned }}{{ store.state.userId }}</router-link
                  >
                </li>
                <template v-else>
                  <li
                    v-if="true"
                    class="nav-item my-auto ms-3 ms-lg-0 ms-lg-auto"
                    style="float: left"
                  >
                    <router-link
                      to="/training/home"
                      class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                      >나의 훈련</router-link
                    >
                  </li>
                  <li class="nav-item my-auto ms-3 ms-lg-0">
                    <a
                      href="#"
                      class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                      @click="logout"
                      >로그아웃</a
                    >
                  </li>
                </template>
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
import DownArrowDarkVue from '@/assets/img/svg/DownArrowDark.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import { getUserIdFromCookie } from '@/utils/cookie.js'

const router = useRouter()
const store = useStore()

function logout() {
  Swal.fire({
    title: '로그아웃 하시겠습니까?.',
    icon: 'question',
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.removeItem(getUserIdFromCookie())
      store.dispatch('CHECKING_SESSION', true)
      document.cookie = `userId=;`
      router.go()
    }
  })
}

onMounted(() => {
  console.log(getUserIdFromCookie())
  store.dispatch('CHECKING_SESSION', !sessionStorage.getItem(getUserIdFromCookie()))
})
</script>

<style scoped></style>
