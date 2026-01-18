<template>
  <CardContainer :title="obj.title">
    <div class="manual-form" v-if="isAdmin">
      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">제목</label>
          <input v-model="form.title" type="text" class="form-control" placeholder="이벤트 제목" />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">시작일</label>
          <input v-model="form.start" type="date" class="form-control" />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">종료일</label>
          <input v-model="form.end" type="date" class="form-control" />
        </div>
        <div class="col-12 mb-3">
          <label class="form-label d-block">색상</label>
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
          CSV 샘플 다운로드
        </button>
        <button class="btn btn-outline-secondary" @click="openCsvModal">CSV 일괄등록</button>
        <button class="btn btn-primary" @click="openModal">스케줄 등록</button>
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

const route = useRoute()
const store = useStore()
const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', SCHOOL)
obj.value = SCHOOL.find((o) => route.name === o.path)

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
    await Swal.fire('알림', '제목과 시작일을 입력해주세요.', 'warning')
    return
  }

  const result = await Swal.fire({
    title: '입력 내용 확인',
    html: `
      <div class="swal-review">
        <p><strong>제목:</strong> ${title}</p>
        <p><strong>시작일:</strong> ${start}</p>
        <p><strong>종료일:</strong> ${end}</p>
        <p><strong>색상:</strong> <span style="display:inline-block;width:16px;height:16px;background:${color};border:1px solid #ccc;margin-right:6px;"></span>${color}</p>
      </div>
    `,
    confirmButtonText: '확인',
    showCancelButton: true,
    cancelButtonText: '취소'
  })

  if (result.isConfirmed) {
    if (!adminId) {
      await Swal.fire('오류', '사용자 정보를 확인할 수 없습니다.', 'error')
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
      await Swal.fire('등록 완료', '이벤트가 등록되었습니다.', 'success')
    } catch (error) {
      console.error(error)
      await Swal.fire('오류', '스케줄 등록 중 문제가 발생했습니다.', 'error')
    }
  }
}

const openCsvModal = async () => {
  if (!adminId) {
    await Swal.fire('오류', '사용자 정보를 확인할 수 없습니다.', 'error')
    return
  }

  const { value: file } = await Swal.fire({
    title: 'CSV 업로드',
    html: `
      <div class="swal-form">
        <input id="csv-input" type="file" accept=".csv,text/csv" class="form-control" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: '업로드',
    cancelButtonText: '취소',
    preConfirm: () => {
      const input = document.getElementById('csv-input')
      const selectedFile = input?.files?.[0]
      if (!selectedFile) {
        Swal.showValidationMessage('CSV 파일을 선택해주세요.')
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
      <p>성공: ${data.successCount}</p>
      <p>실패: ${data.failCount}</p>
      ${
        data.errors?.length
          ? `<hr /><p><strong>오류 목록</strong></p>${data.errors
              .map((err) => `<p>행 ${err.row}: ${err.reason}</p>`)
              .join('')}`
          : ''
      }
    `
    await Swal.fire('업로드 결과', message, 'info')
  } catch (error) {
    console.error('CSV upload failed', error)
    await Swal.fire('오류', 'CSV 업로드 중 문제가 발생했습니다.', 'error')
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
    await Swal.fire('오류', '샘플 다운로드 중 문제가 발생했습니다.', 'error')
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
        <p><strong>시작일:</strong> ${toDateOnly(event.start)}</p>
        <p><strong>종료일:</strong> ${toDateOnly(event.end || event.start)}</p>
      </div>
    `,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: '수정',
    denyButtonText: '삭제',
    cancelButtonText: '닫기'
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
    title: '스케줄 수정',
    html: `
      <div class="swal-form">
        <label class="form-label">제목</label>
        <input id="edit-title" class="form-control" value="${event.title}" />
        <label class="form-label mt-2">시작일</label>
        <input id="edit-start" type="date" class="form-control" value="${toDateOnly(event.start)}" />
        <label class="form-label mt-2">종료일</label>
        <input id="edit-end" type="date" class="form-control" value="${toDateOnly(event.end || event.start)}" />
        <label class="form-label mt-2 d-block">색상</label>
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
    confirmButtonText: '저장',
    cancelButtonText: '취소',
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
        Swal.showValidationMessage('제목과 시작일을 입력해주세요.')
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
    Swal.fire('수정 완료', '스케줄이 수정되었습니다.', 'success')
  } catch (error) {
    console.error('Update failed', error)
    await Swal.fire('오류', '스케줄 수정 중 문제가 발생했습니다.', 'error')
  }
}

const confirmDelete = async (event) => {
  const confirm = await Swal.fire({
    title: '삭제 확인',
    text: '정말 삭제하시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
  })

  if (!confirm.isConfirmed || !adminId) return

  try {
    await ScheduleApi.remove(event.id, adminId)
    if (currentRange.value.start) {
      await fetchSchedules(currentRange.value.start, currentRange.value.end)
    }
    Swal.fire('삭제 완료', '스케줄이 삭제되었습니다.', 'success')
  } catch (error) {
    console.error('Delete failed', error)
    await Swal.fire('오류', '스케줄 삭제 중 문제가 발생했습니다.', 'error')
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
.calendar-wrapper {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
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
