module.exports = {
  // 프로젝트 루트임을 명시 (상위 디렉토리 ESLint 설정 무시)
  root: true,

  // 실행 환경 설정
  env: {
    node: true, // Node.js 환경 (require, module 등 인식)
    browser: true // 브라우저 환경 (window, document 등 인식)
  },

  // 파서(parser) 설정
  parser: 'vue-eslint-parser', // Vue 파일(.vue) 지원을 위한 파서
  parserOptions: {
    // <script lang="ts"> 블록을 해석하기 위해 TypeScript 파서 지정
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest', // 최신 ECMAScript 문법 지원
    sourceType: 'module' // ES Module(import/export) 지원
  },

  // 기본 규칙 세트 확장
  extends: [
    'eslint:recommended', // 기본 ESLint 권장 규칙
    'plugin:vue/vue3-recommended', // Vue 3 권장 규칙 (template, script 모두 검사)
    'plugin:@typescript-eslint/recommended', // TypeScript 권장 규칙 (타입 관련 규칙)
    'prettier' // Prettier와 충돌하는 규칙 해제
  ],

  // 사용할 플러그인
  plugins: [
    'vue', // Vue 관련 규칙
    '@typescript-eslint' // TypeScript 관련 규칙
  ],

  // 개별 규칙 커스터마이징
  rules: {
    // 사용하지 않는 변수가 있으면 경고 (TS 전용)
    '@typescript-eslint/no-unused-vars': ['warn'],

    // 함수 반환 타입을 명시적으로 쓰지 않아도 허용
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
}
