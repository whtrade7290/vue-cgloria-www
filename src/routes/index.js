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
  { path: '/testimony', name: 'testimony', component: TestimonyBoard }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
