<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <p v-if="message" class="loading-message">{{ message }}</p>
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.loading-message {
  font-size: 16px;
  color: #555;
  margin: 0;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 6px solid #ccc;
  border-top-color: var(--gloria-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
