import { createMemoryHistory, createRouter } from 'vue-router'
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
import TrainingHome from '@/view/training/TrainingHome.vue'
import TrainingDiary from '@/view/training/board/TraininDiary.vue'
import TrainingAssignment from '@/view/training/board/TrainingAssignment.vue'
import TrainingNotice from '@/view/training/board/TrainingNotice.vue'
// sweetalert2
import Swal from 'sweetalert2'
import { useStore } from 'vuex'

const routes = [
  // main
  { path: '/', name: 'main', component: MainView },
  // auth
  { path: '/logIn', name: 'logIn', component: LoginView },
  // 교회소개
  { path: '/intro', name: 'intro', component: ChurchIntro },
  { path: '/paster', name: 'paster', component: PasterInfo },
  { path: '/notice', name: 'notice', component: NoticeBoard },
  // 속회말씀
  { path: '/sermon', name: 'sermon', component: SermonBoard },
  { path: '/column', name: 'column', component: ColumnBoard },
  { path: '/small', name: 'small', component: SmallGroup },
  { path: '/weekly', name: 'weekly', component: WeeklySermonBoard },
  // 예배/훈련
  { path: '/jumokja', name: 'jumokja', component: JumokjaView },
  { path: '/training', name: 'training', component: TrainingView },
  // 주일학교
  { path: '/schedule', name: 'schedule', component: EventSchedule },
  { path: '/school_photo', name: 'school_photo', component: SchoolPhotoBoard },
  { path: '/library', name: 'library', component: SchoolLibrary },
  // 전도섬김
  { path: '/evangelize', name: 'evangelize', component: EvangelizeView },
  // 교재마당
  { path: '/photo', name: 'photo', component: PhotoBoard },
  { path: '/free', name: 'free', component: FreeBoard },
  { path: '/testimony', name: 'testimony', component: TestimonyBoard },
  // 훈련
  {
    path: '/training/home',
    name: 'trainingHome',
    component: TrainingHome,
    beforeEnter: async (to, from, next) => {
      if (sessionStorage.getItem(1)) {
        const store = useStore()

        const trainingId = JSON.parse(sessionStorage.getItem(1)).traning_num
        const response = await store.dispatch('FETCH_TRAINING_DATA', trainingId)

        if (response.status === 200 && response.data.length !== 0) {
          next()
        } else {
          Swal.fire({
            title: '훈련을 찾지 못했습니다.',
            icon: 'error'
          })
          next(false)
        }
      } else {
        console.log('not login')
        next(false)
      }
    }
  },
  { path: '/training/diary', name: 'diary', component: TrainingDiary },
  { path: '/training/assignment', name: 'assignment', component: TrainingAssignment },
  { path: '/training/notice', name: 'training_notice', component: TrainingNotice }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
