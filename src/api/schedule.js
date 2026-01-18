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
  },
  update(id, payload) {
    return instance.put(`/schedule/${id}`, payload)
  },
  remove(id, userId) {
    return instance.delete(`/schedule/${id}`, { data: { userId } })
  }
}
