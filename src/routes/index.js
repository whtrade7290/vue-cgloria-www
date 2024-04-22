import { createMemoryHistory, createRouter } from 'vue-router'
import MainView from '@/view/MainView.vue'
import ChurchIntro from '@/view/info/ChurchIntro.vue'
import PasterInfo from '@/view/info/PasterInfo.vue'
import SermonBoard from '@/view/smallGroup/SermonBoard.vue'
import EventSchedule from '@/view/school/EventSchedule.vue'
import EvangelizeView from '@/view/evangelize/EvangelizeView.vue'
import PhotoBoard from '@/view/socialize/PhotoBoard.vue'
import JumokjaView from '@/view/worship/JumokjaView.vue'
import TrainingView from '@/view/worship/TrainingView.vue'

const routes = [
  { path: '/', name: 'main', component: MainView },
  { path: '/intro', name: 'intro', component: ChurchIntro },
  { path: '/paster', name: 'paster', component: PasterInfo },
  { path: '/sermon', name: 'sermon', component: SermonBoard },
  { path: '/schedule', name: 'schedule', component: EventSchedule },
  { path: '/evangelize', name: 'evangelize', component: EvangelizeView },
  { path: '/photo', name: 'photo', component: PhotoBoard },
  { path: '/jumokja', name: 'jumokja', component: JumokjaView },
  { path: '/training', name: 'training', component: TrainingView }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
