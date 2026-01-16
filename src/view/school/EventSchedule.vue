<template>
  <CardContainer :title="obj.title">
    <FullCalendar :options="calendarOptions" />
  </CardContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { SCHOOL } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', SCHOOL)
obj.value = SCHOOL.find((o) => route.name === o.path)

const { t } = useI18n()

const baseEvents = [
  {
    titleKey: 'newMonthDawnService',
    start: '2024-01-07',
    end: '2024-01-07',
    className: 'bg-gradient-danger'
  },
  {
    titleKey: 'familyCellMeeting',
    start: '2024-01-07',
    end: '2024-01-07',
    className: 'bg-gradient-danger'
  },
  {
    titleKey: 'birthdayWooHyun',
    start: '2024-04-11',
    end: '2024-04-11',
    className: 'bg-gradient-danger'
  },
  {
    titleKey: 'newMonthDawnService',
    start: '2024-04-04',
    end: '2024-02-04',
    className: 'bg-gradient-danger'
  },
  {
    titleKey: 'newYearVisionMeeting',
    start: '2024-04-21',
    end: '2024-04-26',
    className: 'bg-gradient-warning'
  },
  {
    titleKey: 'newYearSpecialDawn',
    start: '2024-01-02',
    end: '2024-01-05',
    className: 'bg-gradient-warning'
  }
]

const calendarBaseOptions = {
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
}

const translatedEvents = computed(() =>
  baseEvents.map((event) => ({
    ...event,
    title: t(`school.eventSchedule.events.${event.titleKey}`)
  }))
)

const calendarOptions = computed(() => ({
  ...calendarBaseOptions,
  events: translatedEvents.value
}))
</script>

<style lang="scss" scoped></style>
