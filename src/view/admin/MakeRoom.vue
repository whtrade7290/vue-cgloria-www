<template>
  <div class="team-name-container">
    <div>
      <label>팀명 설정</label>
      <div class="team-name-box">
        <input
          v-if="!isDecided"
          type="text"
          class="form-control decide-team-name"
          placeholder="팀명"
          v-model="name"
        />
        <h4 v-else class="decide-team-name decided">{{ name }}</h4>
        <button
          type="button"
          class="btn bg-gradient-primary team-name-button"
          @click="decidedTeamName"
        >
          확정
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['team-name'])

const isDecided = ref(false)
const name = ref('')
const decidedTeamName = () => {
  isDecided.value = !isDecided.value
  emit('emit-info', { name: name.value, isDecided: isDecided.value })
}
</script>

<style scoped>
.team-name-container {
  width: 100%;
}
.team-name-box {
  display: flex;
  width: 100%;
}
.team-name-button {
  margin-bottom: 0 !important;
  margin-left: 2rem;
  width: 20%;
}
.decide-team-name {
  width: 100%;
}
.decided {
  margin-left: 0.8rem;
}
</style>
