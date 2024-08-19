import { createWebHistory, createRouter } from 'vue-router'
import MainView from '@/view/MainView.vue'
import ChurchIntro from '@/view/info/ChurchIntro.vue'
import PasterInfo from '@/view/info/PasterInfo.vue'
import NoticeBoard from '@/view/info/NoticeBoard.vue'
import SermonBoard from '@/view/smallGroup/SermonBoard.vue'
import ColumnBoard from '@/view/smallGroup/ColumnBoard.vue'
import SmallGroup from '@/view/smallGroup/SmallGroupBoard.vue'
import WeeklySermonBoard from '@/view/smallGroup/WeeklySermonBoard.vue'
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
import WithDiary from '@/view/withDiary/WithDiary.vue'
import WritePage from '@/view/WritePage.vue'
import EditPage from '@/view/EditPage.vue'
import PhotoEditPage from '@/view/PhotoEditPage.vue'
import PhotoWritePage from '@/view/PhotoWritePage.vue'
import DetailPage from '@/view/DetailPage.vue'
import PhotoDetailPage from '@/view/PhotoDetailPage.vue'
// sweetalert2
import Swal from 'sweetalert2'
import { useStore } from 'vuex'
import { getUserIdFromCookie } from '@/utils/cookie.js'

const routes = [
  // main
  {
    path: '/',
    name: 'main',
    component: MainView,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const payload = {
        name: 'photo',
        startRow: 0,
        pageSize: 8
      }
      await store.dispatch('FETCH_BOARDLIST', payload)
      await store.dispatch('FETCH_MAIN_CONTENTS')
      await next()
    }
  },
  // auth
  { path: '/logIn', name: 'logIn', component: LoginView },
  // 교회소개
  { path: '/intro', name: 'intro', component: ChurchIntro },
  { path: '/paster', name: 'paster', component: PasterInfo },
  {
    path: '/notice',
    name: 'notice',
    component: NoticeBoard,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'notice')
      await next()
    }
  },
  // 속회말씀
  {
    path: '/sermon',
    name: 'sermon',
    component: SermonBoard,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'sermon')
      await next()
    }
  },
  {
    path: '/column',
    name: 'column',
    component: ColumnBoard,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'column')
      await next()
    }
  },
  {
    path: '/classMeeting',
    name: 'classMeeting',
    component: SmallGroup,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'classMeeting')
      await next()
    }
  },
  {
    path: '/weekly',
    name: 'weekly',
    component: WeeklySermonBoard,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'weekly')
      await next()
    }
  },
  // 예배/훈련
  { path: '/jumokja', name: 'jumokja', component: JumokjaView },
  { path: '/training', name: 'training', component: TrainingView },
  // 주일학교
  { path: '/schedule', name: 'schedule', component: EventSchedule },
  {
    path: '/school_photo',
    name: 'school_photo',
    component: SchoolPhotoBoard,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'school_photo')
      await next()
    }
  },
  {
    path: '/library',
    name: 'library',
    component: SchoolLibrary,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'library')
      await next()
    }
  },
  // 전도섬김
  { path: '/evangelize', name: 'evangelize', component: EvangelizeView },
  // 교재마당
  {
    path: '/photo',
    name: 'photo',
    component: PhotoBoard,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'photo')
      await next()
    }
  },
  {
    path: '/generalForum',
    name: 'generalForum',
    component: FreeBoard,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'generalForum')
      await next()
    }
  },
  {
    path: '/testimony',
    name: 'testimony',
    component: TestimonyBoard,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      await store.dispatch('FETCH_BOARDCOUNT', 'testimony')
      await next()
    }
  },
  {
    path: '/withDiary',
    name: 'withDiary',
    component: WithDiary,
    beforeEnter: async (to, from, next) => {
      const store = useStore()

      const withDiaryNum = JSON.parse(sessionStorage.getItem(getUserIdFromCookie())).user.withDiary

      if (withDiaryNum === 0) {
        await Swal.fire({
          title: '예수동행일기 그룹이 존재하지 않습니다.',
          icon: 'warning'
        })

        await next(from)
      } else {
        await store.dispatch('FETCH_WITHDIARY_BOARDCOUNT', 'withDiary')
        return next()
      }
    }
  },
  {
    path: '/write',
    name: 'write',
    component: WritePage
  },
  {
    path: '/edit',
    name: 'edit',
    component: EditPage,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const name = to.query.name
      const id = to.query.id
      await store.dispatch('FETCH_CONTENT_DETAIL', { name: name, id: id })
      await next()
    }
  },
  {
    path: '/photo_write',
    name: 'photo_write',
    component: PhotoWritePage
  },
  {
    path: '/photo_edit',
    name: 'photo_edit',
    component: PhotoEditPage,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const name = to.query.name
      const id = to.query.id
      await store.dispatch('FETCH_PHOTO_CONTENT_DETAIL', { name: name, id: id })
      await next()
    }
  },
  {
    path: '/detail/:name/:id',
    name: 'detail',
    component: DetailPage,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const name = to.params.name
      const id = to.params.id
      await store.dispatch('FETCH_CONTENT_DETAIL', { name: name, id: id })
      await next()
    }
  },
  {
    path: '/photoDetail/:name/:id',
    name: 'photoDetail',
    component: PhotoDetailPage,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const name = to.params.name
      const id = to.params.id
      await store.dispatch('FETCH_PHOTO_CONTENT_DETAIL', { name: name, id: id })
      await next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
