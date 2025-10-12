import {
  getMainColumn,
  getMainClassMeeting,
  getMainTestimony,
  getMainSermon,
  getMainWeekly
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
  const [sermon, weekly, column, classMeeting, testimony] = await Promise.allSettled([
    getMainSermon('sermon'),
    getMainWeekly('weeklyWord'),
    getMainColumn('column'),
    getMainClassMeeting('classMeeting'),
    getMainTestimony('testimony')
  ]).then((results) => {
    return results.map((result) => {
      if (result.status === 'fulfilled') return result.value.data
      return { ...defaultValue }
    })
  })

  return { sermon, weekly, column, classMeeting, testimony }
}
