<template>
  <div class="team-name-container">
    <div>
      <label>{{ t('admin.makeWithDiary.teamNameLabel') }}</label>
      <div class="team-name-box">
        <input
          v-if="!isDecided"
          type="text"
          class="form-control decide-team-name"
          :placeholder="t('admin.makeWithDiary.teamNamePlaceholder')"
          v-model="name"
        />
        <h4 v-else class="decide-team-name decided">{{ name }}</h4>
        <button
          type="button"
          class="btn bg-gradient-primary team-name-button"
          @click="decidedTeamName"
        >
          {{ t('admin.makeWithDiary.confirmTeamName') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['team-name'])
const { t } = useI18n()

const isDecided = ref(false)
const name = ref('')
const decidedTeamName = () => {
  if (name.value.length > 0) {
    isDecided.value = !isDecided.value
    emit('emit-info', { name: name.value, isDecided: isDecided.value })
  } else {
    Swal.fire({
      title: t('admin.makeWithDiary.teamNameRequired'),
      icon: 'error'
    })
  }
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
