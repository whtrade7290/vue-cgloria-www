import { createI18n } from 'vue-i18n' // Vue 3에서 사용하는 vue-i18n 모듈
import ko from '../locales/ko.json'
import jp from '../locales/jp.json'

const i18n = createI18n({
  locale: 'jp', // 기본 언어
  fallbackLocale: 'ko', // 기본 언어 표시에 문제가 있을 경우 대체할 언어
  messages: {
    ko,
    jp
  }
})

export default i18n
