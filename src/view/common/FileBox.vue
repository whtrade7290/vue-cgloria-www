<template>
  <div class="download-wrapper" @mouseenter="showList = true" @mouseleave="showList = false">
    <i class="icon-download material-symbols-outlined">download</i>

    <ul v-show="showList" class="file-list">
      <li v-for="file in files" :key="file">
        <a :href="file.url" download>{{ file }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  files: {
    type: Array,
    default: () => []
  }
})

console.log(props)

// ✅ hover 상태 제어
const showList = ref(false)
</script>

<style scoped>
.download-wrapper {
  position: relative;
  display: inline-block;
}

.icon-download {
  cursor: pointer;
  font-size: 1.5rem;
  transition: transform 0.2s;
  margin-left: 0.3rem;
}

.icon-download:hover {
  transform: translateY(-2px);
}

/* 리스트 스타일 */
.file-list {
  position: absolute;
  top: 50%; /* 아이콘 위로 (아래쪽으로 열고 싶으면 top: 100%) */
  left: 50%;
  background: #fff;
  border: 1px solid #ccc;
  padding: 6px 10px;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  z-index: 100;
  width: max-content;
  animation: fadeIn 0.2s ease-out;
}

.file-list li {
  margin: 4px 0;
}

.file-list a {
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.file-list a:hover {
  text-decoration: underline;
}
</style>
