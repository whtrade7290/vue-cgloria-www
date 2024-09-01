// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import 'sweetalert2/dist/sweetalert2.min.css'
import CKEditor from '@ckeditor/ckeditor5-vue'
import mitt from 'mitt'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import i18n from '@/locales/i18n'

const emitter = mitt()

const app = createApp(App)

app.config.globalProperties.emitter = emitter

app.use(i18n)
app.use(router)
app.use(store)
app.use(CKEditor)
app.mount('#app')
