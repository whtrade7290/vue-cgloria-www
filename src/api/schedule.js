import { instance } from '@/api/intercept.js'

export const ScheduleApi = {
  create(data) {
    return instance.post('/schedule/single', data)
  },
  fetchByRange(start, end) {
    return instance.get('/schedule', { params: { start, end } })
  },
  downloadSample() {
    return instance.get('/schedule/csv_sample', { responseType: 'blob' })
  },
  uploadCsv(formData) {
    return instance.post('/schedule/csv_upload', formData)
  }
}
