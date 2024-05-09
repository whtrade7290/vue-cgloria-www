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
  </CardContainer>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'

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
      store: useStore()
    }
  },
  methods: {
    write() {
      this.store.dispatch('WRITE_BOARD', { title: this.inputTitle, content: this.editorData })
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
