<template>
  <CardContainer :title="obj.title">
    <div class="manual-form" v-if="isAdmin">
      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">{{ t('school.eventSchedule.form.title') }}</label>
          <input
            v-model="form.title"
            type="text"
            class="form-control"
            :placeholder="t('school.eventSchedule.form.titlePlaceholder')"
          />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">{{ t('school.eventSchedule.form.start') }}</label>
          <input v-model="form.start" type="date" class="form-control" />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">{{ t('school.eventSchedule.form.end') }}</label>
          <input v-model="form.end" type="date" class="form-control" />
        </div>
        <div class="col-12 mb-3">
          <label class="form-label d-block">{{ t('school.eventSchedule.form.color') }}</label>
          <div class="color-palette">
            <button
              v-for="color in colorOptions"
              :key="color"
              type="button"
              class="color-swatch"
              :style="{ backgroundColor: color }"
              :class="{ selected: form.color === color }"
              @click="form.color = color"
            ></button>
          </div>
        </div>
      </div>
      <div class="text-end d-flex gap-2 justify-content-end">
        <button class="btn btn-outline-secondary" @click="downloadCsvSample">
          {{ t('school.eventSchedule.form.sample') }}
        </button>
        <button class="btn btn-outline-secondary" @click="openCsvModal">
          {{ t('school.eventSchedule.form.upload') }}
        </button>
        <button class="btn btn-primary" @click="openModal">
          {{ t('school.eventSchedule.form.register') }}
        </button>
      </div>
    </div>
    <div class="calendar-wrapper">
      <FullCalendar :options="calendarOptions" />
    </div>
  </CardContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import CardContainer from '@/components/common/card/CardContainer.vue'
import { useStore } from 'vuex'
import { SCHOOL } from '@/data/sidemenu.js'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { getUserIdFromCookie } from '@/utils/cookie.ts'
import { ScheduleApi } from '@/api/schedule'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', SCHOOL)
obj.value = SCHOOL.find((o) => route.name === o.path)

const { t } = useI18n()

const storedData = localStorage.getItem(getUserIdFromCookie())
const storageUser = storedData ? JSON.parse(storedData) : {}
const isAdmin = computed(() => storageUser?.user?.role === 'ADMIN')
const adminId = storageUser?.user?.id ?? null

const colorOptions = [
  '#0F2854',
  '#1C4D8D',
  '#4988C4',
  '#BDE8F5',
  '#FA5C5C',
  '#FD8A6B',
  '#FEC288',
  '#FBEF76'
]

const events = ref([])
const currentRange = ref({ start: '', end: '' })

const form = ref({
  title: '',
  start: '',
  end: '',
  color: colorOptions[0]
})

const calendarOptions = computed(() => ({
  contentHeight: 'auto',
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    start: 'title',
    center: '',
    end: 'today prev,next'
  },
  selectable: false,
  editable: false,
  initialDate: new Date(),
  events: events.value,
  datesSet(info) {
    const start = toDateOnly(info.startStr)
    const end = toDateOnly(info.endStr)
    if (start && end) {
      currentRange.value = { start, end }
      fetchSchedules(start, end)
    }
  },
  eventClick: (info) => handleEventClick(info),
  eventClassNames: () => (isAdmin.value ? ['fc-admin-event'] : [])
}))

const openModal = async () => {
  const title = form.value.title.trim()
  const start = form.value.start
  const end = form.value.end || start
  const color = form.value.color

  if (!title || !start) {
    await Swal.fire(t('school.eventSchedule.alerts.missingFields'), '', 'warning')
    return
  }

  const result = await Swal.fire({
    title: t('school.eventSchedule.modal.createTitle'),
      html: `
      <div class="swal-review">
        <p><strong>${t('school.eventSchedule.form.title')}:</strong> ${title}</p>
        <p><strong>${t('school.eventSchedule.form.start')}:</strong> ${start}</p>
        <p><strong>${t('school.eventSchedule.form.end')}:</strong> ${end}</p>
        <p><strong>${t('school.eventSchedule.form.color')}:</strong> <span style="display:inline-block;width:16px;height:16px;background:${color};border:1px solid #ccc;margin-right:6px;"></span>${color}</p>
      </div>
    `,
    confirmButtonText: t('school.eventSchedule.modal.confirm'),
    showCancelButton: true,
    cancelButtonText: t('school.eventSchedule.modal.cancel')
  })

  if (result.isConfirmed) {
    if (!adminId) {
      await Swal.fire(t('school.eventSchedule.alerts.error'), t('alerts.loginRequired'), 'error')
      return
    }
    try {
      await ScheduleApi.create({
        userId: adminId,
        title,
        start,
        end,
        color
      })
      if (currentRange.value.start) {
        await fetchSchedules(currentRange.value.start, currentRange.value.end)
      }
      form.value = { title: '', start: '', end: '', color: colorOptions[0] }
      await Swal.fire(t('school.eventSchedule.alerts.registerSuccess'), '', 'success')
    } catch (error) {
      console.error(error)
      await Swal.fire(t('school.eventSchedule.alerts.error'), t('school.eventSchedule.alerts.uploadError'), 'error')
    }
  }
}

const openCsvModal = async () => {
  if (!adminId) {
    await Swal.fire(t('school.eventSchedule.alerts.error'), t('alerts.loginRequired'), 'error')
    return
  }

  const { value: file } = await Swal.fire({
    title: t('school.eventSchedule.form.upload'),
    html: `
      <div class="swal-form">
        <input id="csv-input" type="file" accept=".csv,text/csv" class="form-control" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: t('school.eventSchedule.form.upload'),
    cancelButtonText: t('school.eventSchedule.modal.cancel'),
    preConfirm: () => {
      const input = document.getElementById('csv-input')
      const selectedFile = input?.files?.[0]
      if (!selectedFile) {
        Swal.showValidationMessage(t('school.eventSchedule.alerts.csvSelect'))
        return false
      }
      return selectedFile
    }
  })

  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', adminId)

  try {
    const { data } = await ScheduleApi.uploadCsv(formData)
    if (currentRange.value.start) {
      await fetchSchedules(currentRange.value.start, currentRange.value.end)
    }

    const message = `
      <p>${t('school.eventSchedule.result.success')}: ${data.successCount}</p>
      <p>${t('school.eventSchedule.result.fail')}: ${data.failCount}</p>
      ${
        data.errors?.length
          ? `<hr /><p><strong>${t('school.eventSchedule.result.errorList')}</strong></p>${data.errors
              .map((err) => `<p>${t('school.eventSchedule.result.row')} ${err.row}: ${err.reason}</p>`)
              .join('')}`
          : ''
      }
    `
    await Swal.fire(t('school.eventSchedule.alerts.csvResult'), message, 'info')
  } catch (error) {
    console.error('CSV upload failed', error)
    await Swal.fire(t('school.eventSchedule.alerts.error'), t('school.eventSchedule.alerts.uploadError'), 'error')
  }
}

const downloadCsvSample = async () => {
  try {
    const response = await ScheduleApi.downloadSample()
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'schedule_sample.csv'
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download sample', error)
    await Swal.fire(t('school.eventSchedule.alerts.error'), t('school.eventSchedule.alerts.downloadError'), 'error')
  }
}

const toDateOnly = (value) => {
  if (!value) return ''
  if (typeof value === 'string') {
    return value.split('T')[0]
  }
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fetchSchedules = async (start, end) => {
  try {
    const { data } = await ScheduleApi.fetchByRange(start, end)
    events.value = data ?? []
  } catch (error) {
    console.error('Failed to fetch schedules', error)
  }
}

const handleEventClick = (info) => {
  const event = info.event
  if (!isAdmin.value) {
    return
  }

  Swal.fire({
    title: event.title,
    html: `
      <div class="swal-review">
        <p><strong>${t('school.eventSchedule.modal.start')}:</strong> ${toDateOnly(event.start)}</p>
        <p><strong>${t('school.eventSchedule.modal.end')}:</strong> ${toDateOnly(event.end || event.start)}</p>
      </div>
    `,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: t('school.eventSchedule.modal.editAction'),
    denyButtonText: t('school.eventSchedule.modal.deleteAction'),
    cancelButtonText: t('school.eventSchedule.modal.close')
  }).then((result) => {
    if (result.isConfirmed) {
      openEditModal(event)
    } else if (result.isDenied) {
      confirmDelete(event)
    }
  })
}

const openEditModal = async (event) => {
  let selectedColor = event.extendedProps.color || '#0F2854'
  const { value: formValues } = await Swal.fire({
    title: t('school.eventSchedule.modal.editTitle'),
    html: `
      <div class="swal-form">
        <label class="form-label">${t('school.eventSchedule.form.title')}</label>
        <input id="edit-title" class="form-control" value="${event.title}" />
        <label class="form-label mt-2">${t('school.eventSchedule.form.start')}</label>
        <input id="edit-start" type="date" class="form-control" value="${toDateOnly(event.start)}" />
        <label class="form-label mt-2">${t('school.eventSchedule.form.end')}</label>
        <input id="edit-end" type="date" class="form-control" value="${toDateOnly(event.end || event.start)}" />
        <label class="form-label mt-2 d-block">${t('school.eventSchedule.form.color')}</label>
        <div class="color-palette" id="edit-color-palette">
          ${colorOptions
            .map(
              (color) => `
              <button
                type="button"
                class="color-swatch ${color === selectedColor ? 'selected' : ''}"
                style="background-color: ${color}"
                data-color="${color}"
              ></button>`
            )
            .join('')}
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: t('school.eventSchedule.modal.save'),
    cancelButtonText: t('school.eventSchedule.modal.cancel'),
    didOpen: () => {
      const palette = document.getElementById('edit-color-palette')
      if (palette) {
        palette.querySelectorAll('.color-swatch').forEach((btn) => {
          btn.addEventListener('click', () => {
            palette.querySelectorAll('.color-swatch').forEach((b) => b.classList.remove('selected'))
            btn.classList.add('selected')
            selectedColor = btn.dataset.color
          })
        })
      }
    },
    preConfirm: () => {
      const title = document.getElementById('edit-title').value.trim()
      const start = document.getElementById('edit-start').value
      const end = document.getElementById('edit-end').value || start
      const color = selectedColor || '#0F2854'

      if (!title || !start) {
        Swal.showValidationMessage(t('school.eventSchedule.alerts.missingFields'))
        return false
      }

      return { title, start, end, color }
    }
  })

  if (!formValues || !adminId) return

  try {
    await ScheduleApi.update(event.id, {
      userId: adminId,
      ...formValues
    })
    if (currentRange.value.start) {
      await fetchSchedules(currentRange.value.start, currentRange.value.end)
    }
    Swal.fire(t('school.eventSchedule.alerts.updateSuccess'), '', 'success')
  } catch (error) {
    console.error('Update failed', error)
    await Swal.fire(t('school.eventSchedule.alerts.error'), t('school.eventSchedule.alerts.uploadError'), 'error')
  }
}

const confirmDelete = async (event) => {
  const confirm = await Swal.fire({
    title: t('school.eventSchedule.modal.deleteConfirm'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('school.eventSchedule.modal.deleteAction'),
    cancelButtonText: t('school.eventSchedule.modal.cancel')
  })

  if (!confirm.isConfirmed || !adminId) return

  try {
    await ScheduleApi.remove(event.id, adminId)
    if (currentRange.value.start) {
      await fetchSchedules(currentRange.value.start, currentRange.value.end)
    }
    Swal.fire(t('school.eventSchedule.alerts.deleteSuccess'), '', 'success')
  } catch (error) {
    console.error('Delete failed', error)
    await Swal.fire(t('school.eventSchedule.alerts.error'), t('school.eventSchedule.alerts.uploadError'), 'error')
  }
}

onMounted(() => {
  const now = new Date()
  const start = toDateOnly(new Date(now.getFullYear(), now.getMonth(), 1))
  const end = toDateOnly(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  currentRange.value = { start, end }
  fetchSchedules(start, end)
})
</script>

<style scoped>
.manual-form {
  margin-top: 2rem;
}
:deep(.calendar-wrapper) {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  overflow-x: auto;
}
:deep(.calendar-wrapper .fc) {
  min-width: 600px;
  font-family: 'Do Hyeon', 'Noto Sans KR', sans-serif;
}
:deep(.calendar-wrapper .fc-daygrid-day-number) {
  font-weight: 800;
  color: #081630;
  text-shadow:
    0 0 6px rgba(255, 255, 255, 0.85),
    0 2px 4px rgba(0, 0, 0, 0.35);
}
:deep(.calendar-wrapper .fc-daygrid-day-top) {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0a1a37;
}
:deep(.calendar-wrapper .fc-daygrid-event) {
  font-weight: 700;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
}
.color-palette {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}
.color-swatch.selected {
  border-color: #f7e7dc;
  border-width: 3px;
  transform: scale(1.5);
}
:global(.fc-admin-event) {
  cursor: pointer;
  transition: transform 0.2s ease;
}
:global(.fc-admin-event:hover) {
  transform: scale(1.04);
}
:global(.swal2-popup .color-palette) {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 5px;
}
:global(.swal2-popup .color-swatch) {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease;
}
:global(.swal2-popup .color-swatch.selected) {
  border-color: #f7e7dc;
  border-width: 3px;
  transform: scale(1.2);
}
</style>
