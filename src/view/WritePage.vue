<template>
  <CardContainer title="작성페이지" :isWritePage="true" @write="write">
    <label for="title">제목</label><br />
    <input
      type="text"
      id="title"
      class="input-title"
      placeholder=" 제목을 입력하세요."
      v-model="inputTitle"
    /><br />
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
      <a class="btn btn-sm bg-gradient-primary btn-round mb-0 me-1 mt-2 mt-md-0" href="javascript:;"
        >글수정</a
      >
    </div>
  </CardContainer>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: {
    CardContainer
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        placeholder: '글 내용을 입력하세요.'
      },
      inputTitle: '',
      store: useStore(),
      route: useRoute(),
      router: useRouter()
    }
  },
  methods: {
    write() {
      console.log('route name: ', this.route.name)
      const result = this.store.dispatch('WRITE_BOARD', {
        title: this.inputTitle,
        content: this.editorData,
        name: this.$route.query.name
      })
      if (result) {
        this.router.push(`/${this.$route.query.name}`)
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
</style>
