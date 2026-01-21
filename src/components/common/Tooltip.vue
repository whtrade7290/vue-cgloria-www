<template>
  <div class="tooltip-wrapper" :class="[`tooltip-${position}`]">
    <slot />
    <span class="tooltip-content">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'top'
  }
})
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.tooltip-content {
  position: absolute;
  background: rgba(33, 37, 41, 0.9);
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 0.35rem;
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, -100%);
  left: 50%;
  top: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tooltip-wrapper.tooltip-bottom .tooltip-content {
  top: 100%;
  transform: translate(-50%, 0);
}
.tooltip-wrapper:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
  transform: translate(-50%, -110%);
}
.tooltip-wrapper.tooltip-bottom:hover .tooltip-content {
  visibility: visible;
  transform: translate(-50%, 10%);
}
</style>
