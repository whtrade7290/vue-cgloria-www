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

export default async function useGetMainContents() {
  const payload = {
    name: 'photoBoard',
    startRow: 0,
    pageSize: 8
  }
  const [sermon, weekly, column, classMeeting, testimony, photoBoard] = await Promise.allSettled([
    getMainSermon('sermon'),
    getMainWeekly('weekly_bible_verse'),
    getMainColumn('column'),
    getMainClassMeeting('class_meeting'),
    getMainTestimony('testimony'),
    getBoardList(payload)
  ]).then((results) => {
    return results.map((result) => {
      if (result.status === 'fulfilled') return result.value.data
      return { ...defaultValue }
    })
  })

  return { sermon, weekly, column, classMeeting, testimony, photoBoard }
}
