<template>
  <CardContainer :title="TITLE">
    <TableOrganisms>
      <template #header>
        <TableHead :header-list="MANAGE_WITHDIARY"></TableHead>
      </template>
      <template #body>
        <TableBody :body-list="store.state.rooms" :header-list="MANAGE_WITHDIARY">
          <template #btn="{ body, header }">
            <template v-if="header.key === 'member'">
              <button
                class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                @click="checkMember(body)"
              >
                구성원
              </button>
            </template>
            <template v-else>
              <button
                class="btn btn-sm btn-outline-primary btn-round mb-0 me-1 mt-2 mt-md-0"
                @click="deleteRoom(body)"
              >
                {{ $t('admin.manageWithDiary.removeRoomAction') }}
              </button>
            </template>
          </template>
        </TableBody>
      </template>
    </TableOrganisms>
  </CardContainer>
</template>

<script setup>
import CardContainer from '@/components/common/card/CardContainer.vue'
import TableOrganisms from '@/components/tableComponent/TableOrganisms.vue'
import TableBody from '@/components/tableComponent/TableBody.vue'
import TableHead from '@/components/tableComponent/TableHead.vue'
import { MANAGE_WITHDIARY } from '@/data/table'
import { useRoute } from 'vue-router'
import { ADMIN } from '@/data/sidemenu.js'
import { useStore } from 'vuex'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'

const TITLE = 'nav.adminPage.subTitles.approvePage'
const route = useRoute()
const store = useStore()
const { t } = useI18n()

const obj = ref(null)
store.dispatch('FETCH_SIDEMENU', ADMIN)
obj.value = ADMIN.find((o) => route.name === o.path)

const normalizeRoomId = (room) => {
  if (!room) return null
  if (typeof room.id !== 'undefined') return Number(room.id)
  if (typeof room.diaryRoomId !== 'undefined') return Number(room.diaryRoomId)
  if (room.diaryRoom && typeof room.diaryRoom.id !== 'undefined') return Number(room.diaryRoom.id)
  return null
}

const resolveRoomName = (room) => {
  return (
    room?.roomName ||
    room?.diaryRoom?.roomName ||
    room?.diaryRoomName ||
    room?.name ||
    t('admin.manageWithDiary.defaultRoomName')
  )
}

const checkMember = async (roomInfo) => {
  const roomId = normalizeRoomId(roomInfo)
  if (roomId === null) {
    await Swal.fire({
      icon: 'error',
      title: t('admin.manageWithDiary.noRoom')
    })
    return
  }

  let members = []
  try {
    members = await store.dispatch('FETCH_DIARY_ROOM_USERS', roomId)
  } catch (error) {
    console.error('Failed to fetch diary room users', error)
    await Swal.fire({
      icon: 'error',
      title: t('admin.manageWithDiary.fetchError')
    })
    return
  }

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')

  const formatMember = (entry) => {
    if (!entry) return t('admin.manageWithDiary.memberUnknown')
    const member = entry.user ?? entry
    if (typeof member === 'string') return escapeHtml(member)
    if (typeof member === 'object') {
      const displayName =
        member.name ||
        member.username ||
        member.writer_name ||
        member.nickname ||
        t('admin.manageWithDiary.memberUnknown')
      const details = []
      if (member.username && member.username !== displayName) details.push(member.username)
      if (member.role) details.push(member.role)
      if (member.email) details.push(member.email)
      const detailText = details.length ? ` <small>(${details.join(' / ')})</small>` : ''
      return `${escapeHtml(displayName)}${detailText}`
    }
    return escapeHtml(String(member))
  }

  showMemberModal(roomInfo, members, formatMember)
}

const buildMemberListHtml = (members, formatMemberFn) => {
  if (!members.length) {
    return `<p class="text-secondary mb-0">${t('admin.manageWithDiary.noMembers')}</p>`
  }

  return `<ul class="swal-member-list">${members
    .map((member, index) => {
      const userId = member.userId ?? member.user?.id ?? ''
      const displayName =
        formatMemberFn(member)
          .replace(/<[^>]+>/g, '') // remove html tags for dataset
          .trim() || t('admin.manageWithDiary.memberUnknown')
      return `
        <li class="swal-member-item">
          <div class="swal-member-info">
            <span class="swal-member-index">${index + 1}.</span>
            <span class="swal-member-label">${formatMemberFn(member)}</span>
          </div>
          <a
            href="javascript:;"
            class="swal-remove-member-link"
            data-user-id="${userId}"
            data-user-name="${displayName}"
          >
            ${t('admin.manageWithDiary.removeAction')}
          </a>
        </li>`
    })
    .join('')}</ul>`
}

const showMemberModal = (roomInfo, members, formatMemberFn) => {
  Swal.fire({
    title: t('admin.manageWithDiary.membersTitle', {
      room: resolveRoomName(roomInfo)
    }),
    html: buildMemberListHtml(members, formatMemberFn),
    confirmButtonText: t('button.confirm'),
    width: 600,
    didOpen: () => {
      const container = Swal.getHtmlContainer()
      if (!container) return
      container.querySelectorAll('.swal-remove-member-link').forEach((btn) => {
        btn.addEventListener('click', async (event) => {
          event.preventDefault()
          const userId = Number(btn.dataset.userId)
          const userName = btn.dataset.userName
          Swal.close()
          await handleRemoveMember(roomInfo, userId, userName)
        })
      })
    }
  })
}

const handleRemoveMember = async (roomInfo, userId, userName) => {
  if (!userId) {
    await checkMember(roomInfo)
    return
  }

  const roomId = normalizeRoomId(roomInfo)
  if (roomId === null) {
    await Swal.fire({
      icon: 'error',
      title: t('admin.manageWithDiary.noRoom')
    })
    return
  }

  const confirm = await Swal.fire({
    icon: 'warning',
    title: t('admin.manageWithDiary.confirmRemove', { name: userName || '' }),
    showCancelButton: true,
    confirmButtonText: t('admin.manageWithDiary.removeAction'),
    cancelButtonText: t('button.cancel')
  })

  if (!confirm.isConfirmed) {
    await checkMember(roomInfo)
    return
  }

  try {
    await store.dispatch('REMOVE_DIARY_ROOM_USER', { diaryRoomId: roomId, userId })
    await Swal.fire({
      icon: 'success',
      title: t('admin.manageWithDiary.removeSuccess')
    })
  } catch (error) {
    console.error('Failed to remove diary room user', error)
    await Swal.fire({
      icon: 'error',
      title: t('admin.manageWithDiary.removeFail')
    })
  }

  await checkMember(roomInfo)
}

const deleteRoom = async (roomInfo) => {
  const roomId = normalizeRoomId(roomInfo)
  if (roomId === null) {
    await Swal.fire({
      icon: 'error',
      title: t('admin.manageWithDiary.noRoom')
    })
    return
  }

  const confirm = await Swal.fire({
    icon: 'warning',
    title: t('admin.manageWithDiary.confirmRemoveRoom', {
      room: resolveRoomName(roomInfo)
    }),
    showCancelButton: true,
    confirmButtonText: t('admin.manageWithDiary.removeRoomAction'),
    cancelButtonText: t('button.cancel')
  })

  if (!confirm.isConfirmed) return

  try {
    await store.dispatch('REMOVE_DIARY_ROOM', roomId)
    await Swal.fire({
      icon: 'success',
      title: t('admin.manageWithDiary.removeRoomSuccess')
    })
    await store.dispatch('FETCH_WITHDIARY_ALL')
  } catch (error) {
    console.error('Failed to remove diary room', error)
    await Swal.fire({
      icon: 'error',
      title: t('admin.manageWithDiary.removeRoomFail')
    })
  }
}
</script>

<style scoped>
:global(.swal-member-list) {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
:global(.swal-member-item) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  gap: 0.3rem;
}
:global(.swal-member-info) {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  max-width: calc(100% - 90px);
  word-break: break-word;
}
:global(.swal-member-item:last-child) {
  border-bottom: none;
}
:global(.swal-member-label) {
  font-size: 0.95rem;
}
:global(.swal-remove-member-link) {
  color: #d9534f;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
  min-width: 80px;
  text-align: right;
}
</style>
