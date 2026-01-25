import { instance } from '@/api/intercept.js'
import { getUserIdFromCookie } from '@/utils/cookie.ts'

/* ------------------------- 성경 통독 ------------------------- */
export async function requestBiblePlan(days) {
  return await instance.post(
    '/bible',
    { days },
    {
      responseType: 'blob'
    }
  )
}

export async function fetchBibleBooks() {
  return await instance.get('/bible/books')
}

export async function fetchBibleChapters(longLabel) {
  return await instance.get('/bible/chapters', {
    params: {
      long_label: longLabel
    }
  })
}

export async function fetchBibleParagraphs(longLabel, chapter) {
  return await instance.get('/bible/paragraphs', {
    params: {
      long_label: longLabel,
      chapter
    }
  })
}

export async function fetchBibleVerse(longLabel, chapter, paragraph) {
  return await instance.post('/bible/verse', {
    long_label: longLabel,
    chapter,
    paragraph
  })
}

export async function fetchBibleVerseById(verseId) {
  return await instance.get(`/bible/verse/${verseId}`)
}

export async function requestRememberBibleDownload({ fromDate, toDate }) {
  return await instance.post('/weekly_bible_verse/remember_bible_download', {
    fromDate,
    toDate
  })
}

/* ------------------------- 게시판 관련 ------------------------- */
export async function getBoardList(obj) {
  const { name, startRow, pageSize, searchWord } = obj
  return await instance.post(`${name}/${name}`, { startRow, pageSize, searchWord, board: name })
}

export async function getBoardCount({ name, searchWord }) {
  return await instance.post(`${name}/${name}_count`, { searchWord, board: name })
}

/* ------------------------- 로그인 / 회원 ------------------------- */
export async function requestLogin(username, password) {
  try {
    const response = await instance.post(
      'signIn',
      { username, password },
      {
        headers: {
          'x-skip-auth': 'true'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(error, 'error login')
  }
}

export async function signUp(payload) {
  return await instance.post('/signUp', payload)
}

export async function editPassword(username, password, name, email) {
  return await instance.post('/editPassword', { username, password, name, email })
}

export async function updateProfile(payload) {
  return await instance.post('/updateProfile', payload)
}

/* ------------------------- withDiary 관련 ------------------------- */
export async function getWithDiaryBoardList(obj) {
  const { startRow, pageSize, roomId } = obj
  return await instance.post('withDiary/withDiary', { startRow, pageSize, roomId })
}

export async function getWithDiaryBoardCount(id) {
  return await instance.post('withDiary/withDiary_count', { id })
}

export async function getWithDiaryAll() {
  return await instance.get('withDiary/withDiary_all')
}

export async function makeWithDiary(teamName, userIdList) {
  const user = JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user
  if (!user) return null

  return await instance.post('/withDiary/make_withDiary', {
    teamName,
    userIdList,
    creator: user.id ?? 0,
    creator_name: user.name ?? ''
  })
}

export async function fetchWithDiaryRoomList(userId) {
  return await instance.post('/withDiary/fetch_withDiaryList', { userId })
}

export async function fetchWithDiaryRoom(roomId) {
  return await instance.post('/withDiary/fetch_withDiary', { roomId })
}

export async function fetchDiaryRoomUsers(diaryRoomId) {
  return await instance.post('/withDiary/fetch_withDiary_room_users', { diaryRoomId })
}

export async function removeDiaryRoomUser({ diaryRoomId, userId }) {
  return await instance.post('/withDiary/remove_withDiary_room_user', { diaryRoomId, userId })
}

export async function removeDiaryRoom(diaryRoomId) {
  return await instance.post('/withDiary/remove_withDiary_room', { diaryRoomId })
}

/* ------------------------- 게시판 CRUD ------------------------- */
export async function writeBoard(formData, name) {
  if (name === 'withDiary') {
    formData.append(
      'withDiaryNum',
      JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user.withDiary
    )
  }
  return await instance.post(`${name}/${name}_write`, formData)
}

export async function editBoard(formData, name) {
  if (name === 'withDiary') {
    formData.append(
      'withDiaryNum',
      JSON.parse(localStorage.getItem(getUserIdFromCookie()))?.user.withDiary
    )
  }
  return await instance.post(`${name}/${name}_edit`, formData)
}

export async function getContentById(name, id) {
  return await instance.post(`${name}/${name}_detail`, { id, board: name })
}

export async function deleteBoard(name, id, deleteKeyList) {
  return await instance.post(`${name}/${name}_delete`, { id, deleteKeyList })
}

export async function deleteCommentRequest({ commentId, boardId, boardName }) {
  return await instance.post('comment/comment_delete', { commentId, boardId, boardName })
}

export async function updateCommentRequest({ commentId, boardId, boardName, comment }) {
  return await instance.post('comment/comment_edit', { commentId, boardId, boardName, comment })
}

export async function fetchApprovedUsers({ startRow = 0, pageSize = 20, searchWord = '' }) {
  return await instance.post('/approvedUsers', { startRow, pageSize, searchWord })
}

export async function updateUserRoleRequest({ id, role }) {
  return await instance.post('/updateUserRole', { id, role })
}

export async function revokeApproveStatusRequest(id) {
  return await instance.post('/revokeApproveStatus', { id })
}

/* ------------------------- 메인 콘텐츠 ------------------------- */
export async function getMainColumn(name, language) {
  const payload = { board: name }
  if (language) {
    payload.language = language
  }
  return await instance.post(`${name}/main_${name}`, payload)
}

export async function getMainClassMeeting(name, language) {
  const payload = { board: name }
  if (language) {
    payload.language = language
  }
  return await instance.post(`${name}/main_${name}`, payload)
}

export async function getMainTestimony(name) {
  return await instance.post(`${name}/main_${name}`, { board: name })
}

export async function getMainSermon(name) {
  return await instance.post(`${name}/main_${name}`, { board: name })
}

export async function getMainWeekly(name) {
  return await instance.post(`${name}/main_${name}`, { board: name })
}

/* ------------------------- 댓글 ------------------------- */
export async function writeComment(boardId, boardName, comment, writerName, writer) {
  return await instance.post('comment/comment_write', {
    boardId,
    boardName,
    comment,
    writerName,
    writer
  })
}

export async function getCommentList(boardId, boardName) {
  return await instance.post('comment/comment', { boardId, boardName })
}

/* ------------------------- 토큰 / 유저 ------------------------- */
export async function checkToken(accessToken, refreshToken) {
  return await instance.post(
    '/check_Token',
    { accessToken, refreshToken, skipAuth: true },
    {
      headers: {
        'x-skip-auth': 'true'
      }
    }
  )
}

export async function getUserByUsername(username) {
  return await instance.post('/find_user', { username })
}

/* ------------------------- 승인 관리 ------------------------- */
export async function fetchDisapproveUsers() {
  return await instance.get('/disapproveUsers')
}

/* ------------------------- 스케줄 ------------------------- */
export async function createSchedule(payload) {
  return await instance.post('/schedule/single', payload)
}

export async function approveUser(id) {
  return await instance.post('/approveUser', { id })
}
