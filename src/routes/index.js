import { createWebHistory, createRouter } from 'vue-router'
import MainView from '@/view/common/MainView.vue'
import ChurchIntro from '@/view/info/ChurchIntro.vue'
import ChurchMap from '@/view/info/ChurchMap.vue'
import PasterInfo from '@/view/info/PasterInfo.vue'
import NoticeBoard from '@/view/info/NoticeBoard.vue'
import SermonBoard from '@/view/smallGroup/SermonBoard.vue'
import ColumnBoard from '@/view/smallGroup/ColumnBoard.vue'
import SmallGroup from '@/view/smallGroup/SmallGroupBoard.vue'
import WeeklySermonBoard from '@/view/smallGroup/WeeklySermonBoard.vue'
import BiblePlanView from '@/view/smallGroup/BiblePlanView.vue'
import EventSchedule from '@/view/school/EventSchedule.vue'
import SchoolPhotoBoard from '@/view/school/SchoolPhotoBoard.vue'
import SchoolLibrary from '@/view/school/SchoolLibrary.vue'
import EvangelizeView from '@/view/evangelize/EvangelizeView.vue'
import PhotoBoard from '@/view/socialize/PhotoBoard.vue'
import FreeBoard from '@/view/socialize/FreeBoard.vue'
import TestimonyBoard from '@/view/socialize/TestimonyBoard.vue'
import JumokjaView from '@/view/worship/JumokjaView.vue'
import TrainingView from '@/view/worship/TrainingView.vue'
import LoginView from '@/view/auth/LoginView.vue'
import SignUpView from '@/view/auth/SignUpView.vue'
import EditPassword from '@/view/auth/EditPassword.vue'
import ProfileEditView from '@/view/user/ProfileEditView.vue'
import WithDiary from '@/view/withDiary/WithDiary.vue'
import WritePage from '@/view/common/WritePage.vue'
import EditPage from '@/view/common/EditPage.vue'
import DetailPage from '@/view/common/DetailPage.vue'
import MakeWithDiaryRoom from '@/view/admin/MakeWithDiary/MakeWithDiaryRoom.vue'
import ApprovePage from '@/view/admin/Approve/ApprovePage.vue'
import ManageWithDiary from '@/view/admin/ManageWithDiary/ManageWithDiary.vue'
import UserApproveTable from '@/components/admin/UserApproveTable.vue'
// sweetalert2
import Swal from 'sweetalert2'
import { useStore } from 'vuex'
import { getUserIdFromCookie } from '@/utils/cookie.ts'

const routes = [
  // main
  {
    path: '/',
    name: 'main',
    component: MainView,
    meta: { titleKey: 'common.siteTitle' }
  },
  // auth
  { path: '/login', name: 'login', component: LoginView, meta: { titleKey: 'button.login' } },
  {
    path: '/signUp/:isQr?',
    name: 'signUp',
    component: SignUpView,
    meta: { titleKey: 'auth.signUpTitle' }
  },
  {
    path: '/edit_password',
    name: 'edit_password',
    component: EditPassword,
    meta: { titleKey: 'auth.editPassword.title' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileEditView,
    meta: { titleKey: 'profile.title' },
    beforeEnter: async (to, from, next) => {
      const storedData = localStorage.getItem(getUserIdFromCookie())
      const storageUser = storedData ? JSON.parse(storedData) : {}

      if (!storageUser?.user?.id) {
        await Swal.fire({
          title: window.i18n?.global?.t('alerts.loginRequired'),
          icon: 'warning'
        })
        await next({ name: 'login' })
      } else {
        await next()
      }
    }
  },
  // 교회소개
  { path: '/intro', name: 'intro', component: ChurchIntro, meta: { titleKey: 'nav.intro.title' } },
  {
    path: '/location',
    name: 'location',
    component: ChurchMap,
    meta: { titleKey: 'nav.intro.subTitles.location' }
  },
  {
    path: '/paster',
    name: 'paster',
    component: PasterInfo,
    meta: { titleKey: 'nav.intro.subTitles.paster' }
  },
  {
    path: '/notice',
    name: 'notice',
    component: NoticeBoard,
    meta: { titleKey: 'nav.intro.subTitles.notice' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'notice' })
      await next()
    }
  },
  // 속회말씀
  {
    path: '/sermon',
    name: 'sermon',
    component: SermonBoard,
    meta: { titleKey: 'nav.classWord.subTitles.sermon' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'sermon' })
      await next()
    }
  },
  {
    path: '/column',
    name: 'column',
    component: ColumnBoard,
    meta: { titleKey: 'nav.classWord.subTitles.column' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'column' })
      await next()
    }
  },
  {
    path: '/class_meeting',
    name: 'class_meeting',
    component: SmallGroup,
    meta: { titleKey: 'nav.classWord.subTitles.class_meeting' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'class_meeting' })
      await next()
    }
  },
  {
    path: '/weekly_bible_verse',
    name: 'weekly_bible_verse',
    component: WeeklySermonBoard,
    meta: { titleKey: 'nav.classWord.subTitles.weekly_bible_verse' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'weekly_bible_verse' })
      await next()
    }
  },
  {
    path: '/bible_plan',
    name: 'bible_plan',
    component: BiblePlanView,
    meta: { titleKey: 'biblePlan.title' }
  },
  // 예배/훈련
  { path: '/jumok', name: 'jumok', component: JumokjaView, meta: { titleKey: 'nav.worshipTraining.title' } },
  {
    path: '/training',
    name: 'training',
    component: TrainingView,
    meta: { titleKey: 'nav.worshipTraining.title' }
  },
  // 주일학교
  {
    path: '/eventSchedule',
    name: 'eventSchedule',
    component: EventSchedule,
    meta: { titleKey: 'nav.sundaySchool.subTitles.eventSchedule' }
    // beforeEnter: async (from, next) => {
    //   await Swal.fire({
    //     title: '준비중입니다.',
    //     icon: 'warning'
    //   })

    //   await next(from)
    // }
  },
  {
    path: '/school_photo_board',
    name: 'school_photo_board',
    component: SchoolPhotoBoard,
    meta: { titleKey: 'nav.sundaySchool.subTitles.school_photo_board' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'school_photo_board' })
      await next()
    }
  },
  {
    path: '/sunday_school_resource',
    name: 'sunday_school_resource',
    component: SchoolLibrary,
    meta: { titleKey: 'nav.sundaySchool.subTitles.sunday_school_resource' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'sunday_school_resource' })
      await next()
    }
  },
  // 전도섬김
  {
    path: '/evangelismAndVision',
    name: 'evangelismAndVision',
    component: EvangelizeView,
    meta: { titleKey: 'nav.evangelismService.title' }
  },
  // 교재마당
  {
    path: '/photo_board',
    name: 'photo_board',
    component: PhotoBoard,
    meta: { titleKey: 'nav.fellowshipArea.subTitles.photo_board' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'photo_board' })
      await next()
    }
  },
  {
    path: '/general_forum',
    name: 'general_forum',
    component: FreeBoard,
    meta: { titleKey: 'nav.fellowshipArea.subTitles.general_forum' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'general_forum' })
      await next()
    }
  },
  {
    path: '/testimony',
    name: 'testimony',
    component: TestimonyBoard,
    meta: { titleKey: 'nav.fellowshipArea.subTitles.testimony' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', { name: 'testimony' })
      await next()
    }
  },
  {
    path: '/withDiary',
    name: 'withDiary',
    component: WithDiary,
    meta: { titleKey: 'nav.withDiary.title' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()

      await store.dispatch('FETCH_WITHDIARY_ROOM', { roomId: to.query.roomId })

      let payload = {
        name: 'withDiary',
        startRow: 0,
        pageSize: 5,
        roomId: store.state.room.id
      }

      await store.dispatch('FETCH_WITHDIARY_BOARDCOUNT', store.state.room.id)
      await store.dispatch('FETCH_WITHDIARY_DATALIST', payload)

      const roomId = store.state.room.id

      if (roomId) {
        if (!to.query.roomId) {
          next({ name: to.name, query: { ...to.query, roomId } }) // 쿼리 파라미터에 roomId 추가
        } else {
          next() // 이미 쿼리 파라미터에 roomId가 있으면 그대로 진행
        }
      } else {
        next(false) // roomId가 없으면 진행 중단
      }
    }
  },
  {
    path: '/write',
    name: 'write',
    component: WritePage,
    meta: { titleKey: 'writePage.mainTitle' }
  },
  {
    path: '/edit',
    name: 'edit',
    component: EditPage,
    meta: { titleKey: 'writePage.mainTitle' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const name = to.query.name
      const id = to.query.id
      await store.dispatch('FETCH_CONTENT_DETAIL', { name: name, id: id })
      await next()
    }
  },
  {
    path: '/detail/:name/:id',
    name: 'detail',
    component: DetailPage,
    meta: { titleKey: 'common.siteTitle' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const name = to.params.name
      const id = to.params.id
      await store.dispatch('FETCH_CONTENT_DETAIL', { name: name, id: id })
      await next()
    }
  },
  {
    path: '/makeWithDiary',
    name: 'makeWithDiary',
    component: MakeWithDiaryRoom,
    meta: { titleKey: 'nav.adminPage.subTitles.makeWithDiary' },
    beforeEnter: async (to, from, next) => {
      const storedData = localStorage.getItem(getUserIdFromCookie())
      const storageUser = storedData ? JSON.parse(storedData) : {}

      if (storageUser?.user?.role !== 'ADMIN') {
        await Swal.fire({
          title: window.i18n.global.t('alerts.adminOnly'),
          icon: 'warning'
        })
        await next(from)
      } else {
        await next()
      }
    }
  },
  {
    path: '/approvePage',
    name: 'approvePage',
    component: ApprovePage,
    meta: { titleKey: 'nav.adminPage.subTitles.approvePage' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const storedData = localStorage.getItem(getUserIdFromCookie())

      const storageUser = storedData ? JSON.parse(storedData) : {}

      if (storageUser?.user?.role !== 'ADMIN') {
        await Swal.fire({
          title: window.i18n.global.t('alerts.adminOnly'),
          icon: 'warning'
        })
        await next(from)
      } else {
        await store.dispatch('FIND_DISAPPROVE_USERS')

        await next()
      }
    }
  },
  {
    path: '/manageWithDiary',
    name: 'manageWithDiary',
    component: ManageWithDiary,
    meta: { titleKey: 'nav.adminPage.subTitles.manageWithDiary' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const storedData = localStorage.getItem(getUserIdFromCookie())

      const storageUser = storedData ? JSON.parse(storedData) : {}

      if (storageUser?.user?.role !== 'ADMIN') {
        await Swal.fire({
          title: window.i18n.global.t('alerts.adminOnly'),
          icon: 'warning'
        })
        await next(from)
      } else {
        await store.dispatch('FETCH_WITHDIARY_ALL')

        await next()
      }
    }
  },
  {
    path: '/userApprove',
    name: 'userApprove',
    component: UserApproveTable,
    meta: { titleKey: 'nav.adminPage.subTitles.userApprove' },
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const storedData = localStorage.getItem(getUserIdFromCookie())

      const storageUser = storedData ? JSON.parse(storedData) : {}

      if (storageUser?.user?.role !== 'ADMIN') {
        await Swal.fire({
          title: window.i18n.global.t('alerts.adminOnly'),
          icon: 'warning'
        })
        await next(from)
      } else {
        await store.dispatch('FIND_DISAPPROVE_USERS')

        await next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 페이지 이동 시 항상 상단으로 스크롤
    return { top: 0 }
  }
})

const applyDocumentTitle = (route) => {
  const translator = window?.i18n?.global?.t
  const siteTitle = translator ? translator('common.siteTitle') : '중앙영광교회'
  const key = route?.meta?.titleKey
  if (translator && key) {
    document.title = `${translator(key)} - ${siteTitle}`
  } else {
    document.title = siteTitle
  }
}

window.__applyDocumentTitle = applyDocumentTitle

router.afterEach((to) => applyDocumentTitle(to))

export default router
