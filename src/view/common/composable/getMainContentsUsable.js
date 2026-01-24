import {
  getMainColumn,
  getMainClassMeeting,
  getMainTestimony,
  getMainSermon,
  getMainWeekly,
  getBoardList
} from '@/api/index'

const defaultValue = {
  content: '',
  create_at: '',
  deleted: false,
  extension: '',
  fileType: '',
  filename: '',
  id: 0,
  mainContent: true,
  title: '',
  update_at: '',
  uuid: '',
  writer: '',
  writer_name: ''
}

const normalizeContent = (data) => {
  if (data && typeof data === 'object') {
    return data
  }
  return { ...defaultValue }
}

export default async function useGetMainContents(language) {
  const payload = {
    name: 'photo_board',
    startRow: 0,
    pageSize: 8
  }
  const [sermon, weekly, column, classMeeting, testimony, photoBoard] = await Promise.allSettled([
    getMainSermon('sermon'),
    getMainWeekly('weekly_bible_verse'),
    getMainColumn('column', language),
    getMainClassMeeting('class_meeting', language),
    getMainTestimony('testimony'),
    getBoardList(payload)
  ]).then((results) => {
    return results.map((result) => {
      if (result.status === 'fulfilled') {
        return normalizeContent(result.value?.data)
      }
      return { ...defaultValue }
    })
  })

  return { sermon, weekly, column, classMeeting, testimony, photoBoard }
}
