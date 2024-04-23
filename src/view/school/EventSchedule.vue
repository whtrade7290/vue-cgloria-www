<template>
  <CardContainer :title="obj.title">
    <FullCalendar :options="calendarOptions" />
  </CardContainer>
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { SCHOOL } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', SCHOOL)
obj.value = SCHOOL.find((info) => route.name === info.path)

const calendarOptions = ref({
  contentHeight: 'auto',
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    start: 'title', // will normally be on the left. if RTL, will be on the right
    center: '',
    end: 'today prev,next' // will normally be on the right. if RTL, will be on the left
  },
  selectable: false,
  editable: false,
  initialDate: new Date(),
  weekends: false,
  events: [
    {
      title: '새달새벽예배',
      start: '2024-01-07',
      end: '2024-01-07',
      className: 'bg-gradient-danger'
    },
    {
      title: '가족속회',
      start: '2024-01-07',
      end: '2024-01-07',
      className: 'bg-gradient-danger'
    },
    {
      title: '우현생일',
      start: '2024-04-11',
      end: '2024-04-11',
      className: 'bg-gradient-danger'
    },
    {
      title: '새달새벽예배',
      start: '2024-04-04',
      end: '2024-02-04',
      className: 'bg-gradient-danger'
    },
    {
      title: '신년Vision모임(당회)',
      start: '2024-04-21',
      end: '2024-04-26',
      className: 'bg-gradient-warning'
    },
    {
      title: '신년특별새벽예배',
      start: '2024-01-02',
      end: '2024-01-05',
      className: 'bg-gradient-warning'
    }
  ],
  views: {
    month: {
      titleFormat: {
        month: 'long',
        year: 'numeric'
      }
    },
    agendaWeek: {
      titleFormat: {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
      }
    },
    agendaDay: {
      titleFormat: {
        month: 'short',
        year: 'numeric',
        day: 'numeric'
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
