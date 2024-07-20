<template>
  <div style="display: flex; justify-content: center; background-color: #e9ecef">
    <div
      style="
        margin-top: 7rem;
        margin-bottom: 5rem;
        width: 50%;
        background-color: #fff;
        border-radius: 1.5rem;
      "
    >
      <div
        class="card-header bg-gradient-primary p-5 position-relative"
        style="border-radius: 1rem"
      >
        <h3 class="text-white mb-0">글작성</h3>
        <p class="text-white opacity-8 mb-4">중앙 영광교회 교회 역사와 형제교회 소개</p>
        <div class="position-absolute w-100 z-index-1 bottom-0 ms-n5">
          <svg
            class="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 40"
            preserveAspectRatio="none"
            shape-rendering="auto"
            style="height: 7vh; min-height: 50px"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              ></path>
            </defs>
            <g class="moving-waves">
              <use xlink:href="#gentle-wave" x="48" y="-1" fill="rgba(255,255,255,0.40"></use>
              <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.35)"></use>
              <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.25)"></use>
              <use xlink:href="#gentle-wave" x="48" y="8" fill="rgba(255,255,255,0.20)"></use>
              <use xlink:href="#gentle-wave" x="48" y="13" fill="rgba(255,255,255,0.15)"></use>
              <use xlink:href="#gentle-wave" x="48" y="16" fill="rgba(255,255,255,0.95"></use>
            </g>
          </svg>
        </div>
      </div>
      <div style="padding: 1.5rem">
        <label for="title">제목</label><br />
        <input
          type="text"
          id="title"
          class="input-title"
          placeholder=" 제목을 입력하세요."
          v-model="inputTitle"
        /><br />
        <label for="image">이미지 첨부</label><br />
        <div style="width: 100%; display: flex; justify-content: center">
          <div class="image-container" v-if="files.length !== 0">
            <img :src="imageData" alt="img" />
          </div>
        </div>
        <input type="file" id="image" @change="changeImage" name="fileField" /><br />
        <label for="content">내용</label><br />
        <ckeditor
          id="content"
          class="ck_contents"
          :editor="editor"
          v-model="editorData"
          :config="editorConfig"
        ></ckeditor>
        <div style="margin-top: 1rem; margin-left;: 2.5rem; display: flex; justify-content: end;">
          <a
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            href="javascript:;"
            @click="write"
            >글작성</a
          >
          <a
            class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0"
            href="javascript:;"
            @click="backPage"
            >목록으로</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getUserIdFromCookie } from '@/utils/cookie.js'

export default {
  components: {},
  data() {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        placeholder: '글 내용을 입력하세요.',
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'blockQuote',
          'insertTable',
          '|',
          'undo',
          'redo'
        ]
      },

      inputTitle: '',
      store: useStore(),
      route: useRoute(),
      router: useRouter(),
      files: [],
      imageData: null,
      file: null
    }
  },
  methods: {
    write() {
      let formData = new FormData()

      formData.append('title', this.inputTitle)
      formData.append('content', this.editorData)
      formData.append(
        'writer',
        JSON.parse(sessionStorage.getItem(getUserIdFromCookie())).user.username
      )
      formData.append('fileField', this.file)

      const result = this.store.dispatch('WRITE_BOARD', {
        formData: formData,
        name: this.$route.query.name
      })
      if (result) {
        this.router.push(`/${this.$route.query.name}`)
      }
    },
    backPage() {
      this.router.back()
    },
    changeImage(event) {
      this.files = event.target?.files

      if (this.files.length > 0) {
        const file = this.files[0]

        const reader = new FileReader()
        this.file = this.files[0]

        reader.onload = (e) => {
          this.imageData = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style scoped>
.input-title {
  width: 100%;
  border: 1px solid #ccced1;
}
.input-title:focus {
  outline: 0.001rem solid #2977ff;
  box-shadow: inset 0 0 0.5px 0 #2977ff;
}
</style>

<style>
.ck-content {
  height: 300px;
  border-radius: 1.5rem;
}
.image-container {
  width: 22rem;
  height: 17rem;
  overflow: hidden;
  margin-top: 0.2rem;
  margin-bottom: 0.7rem;
  border-radius: 0.7rem;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율을 유지하면서 컨테이너에 맞게 조정 */
}
</style>
