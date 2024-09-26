import { createWebHistory, createRouter, useRouter } from 'vue-router'
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
import SignUpView from '@/view/auth/SignUpView.vue'
import WithDiary from '@/view/withDiary/WithDiary.vue'
import WritePage from '@/view/WritePage.vue'
import EditPage from '@/view/EditPage.vue'
import PhotoEditPage from '@/view/PhotoEditPage.vue'
import PhotoWritePage from '@/view/PhotoWritePage.vue'
import DetailPage from '@/view/DetailPage.vue'
import PhotoDetailPage from '@/view/PhotoDetailPage.vue'
import MakeWithDiaryRoom from '@/view/admin/MakeWithDiaryRoom.vue'
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
  { path: '/signUp', name: 'signUp', component: SignUpView },
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

      const storedData = localStorage.getItem(getUserIdFromCookie())

      const sessionUser = storedData ? JSON.parse(storedData) : {}

      if (!sessionUser.token) {
        await Swal.fire({
          title: '로그인 전용 게시판입니다.',
          icon: 'warning'
        }).then(() => {
          next(from)
        })
      } else {
        await store.dispatch('FETCH_BOARDCOUNT', 'testimony')
        await next()
      }
    }
  },
  {
    path: '/withDiary',
    name: 'withDiary',
    component: WithDiary,
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
  },
  {
    path: '/make_withDiary',
    name: 'make_withDiary',
    component: MakeWithDiaryRoom
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
