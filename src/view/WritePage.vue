<template>
  <CardContainer title="작성페이지">
    <ckeditor
      class="ck_contents"
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
    ></ckeditor>
    editorData: {{ editorData }}
  </CardContainer>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CardContainer from '@/components/common/card/CardContainer.vue'
export default {
  components: {
    CardContainer
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        placeholder: 'Type the content here!',
        height: '500px'
      }
    }
  }
}
</script>

<style scoped>
.ck-content {
  height: 300px;
}
</style>
