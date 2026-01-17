<template>
  <CardContainer :title="TITLE">
    <!-- Mobile Cards -->
    <div class="d-lg-none px-3 pt-3">
      <ul class="list-group list-group-flush">
        <li
          v-for="room in store.state.rooms"
          :key="normalizeRoomId(room) ?? room.roomName"
          class="list-group-item mobile-item"
        >
          <div class="mobile-grid-row">
            <span class="mobile-label">{{ $t('table.manageWithDiary.id') }}</span>
            <span class="mobile-value">{{ getDisplayRoomId(room) }}</span>
          </div>
          <div class="mobile-grid-row">
            <span class="mobile-label">{{ $t('table.manageWithDiary.roomName') }}</span>
            <span class="mobile-value">{{ resolveRoomName(room) }}</span>
          </div>
          <div class="mobile-grid-row">
            <span class="mobile-label">{{ $t('table.manageWithDiary.creator_name') }}</span>
            <span class="mobile-value">{{ getCreatorName(room) }}</span>
          </div>
          <div class="mobile-grid-row">
            <span class="mobile-label">{{ $t('table.manageWithDiary.update_at') }}</span>
            <span class="mobile-value">{{ getUpdatedAt(room) }}</span>
          </div>
          <div class="mobile-actions">
            <a href="javascript:;" class="table-action-link" @click="checkMember(room)">
              {{ $t('admin.manageWithDiary.memberAction') }}
            </a>
            <a href="javascript:;" class="table-action-link danger" @click="deleteRoom(room)">
              {{ $t('admin.manageWithDiary.removeRoomAction') }}
            </a>
          </div>
        </li>
        <li v-if="!store.state.rooms || store.state.rooms.length === 0" class="list-group-item">
          <p class="result-text mb-0 text-center">{{ $t('common.noResults') }}</p>
        </li>
      </ul>
    </div>

    <!-- Desktop Table -->
    <div class="d-none d-lg-block">
      <TableOrganisms>
        <template #header>
          <TableHead :header-list="MANAGE_WITHDIARY"></TableHead>
        </template>
        <template #body>
          <TableBody :body-list="store.state.rooms" :header-list="MANAGE_WITHDIARY">
            <template #btn="{ body, header }">
              <template v-if="header.key === 'member'">
                <a href="javascript:;" class="table-action-link" @click="checkMember(body)">
                  {{ $t('admin.manageWithDiary.memberAction') }}
                </a>
              </template>
              <template v-else>
                <a href="javascript:;" class="table-action-link danger" @click="deleteRoom(body)">
                  {{ $t('admin.manageWithDiary.removeRoomAction') }}
                </a>
              </template>
            </template>
          </TableBody>
        </template>
      </TableOrganisms>
    </div>
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

const TITLE = 'nav.adminPage.subTitles.manageWithDiary'
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

const getCreatorName = (room) =>
  room?.creator_name ||
  room?.creatorName ||
  room?.creator?.name ||
  room?.diaryRoom?.creator_name ||
  t('admin.manageWithDiary.memberUnknown')

const getUpdatedAt = (room) =>
  room?.update_at || room?.updated_at || room?.updatedAt || room?.diaryRoom?.update_at || '-'

const getDisplayRoomId = (room) => normalizeRoomId(room) ?? '-'

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
:global(.table-action-link) {
  color: #475569;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
}
:global(.table-action-link.danger) {
  color: #f87171;
}
:global(.table-action-link:hover) {
  opacity: 0.9;
}

.mobile-item {
  padding: 1rem 0.9rem;
  background: #fff;
  border-radius: 0.75rem;
  margin-bottom: 0.85rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0;
}
.mobile-grid-row {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.35rem 0;
}
.mobile-label {
  font-size: 0.8rem;
  color: #6b7280;
}
.mobile-value {
  font-weight: 600;
  font-size: 0.95rem;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mobile-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.75rem;
}
.result-text {
  color: #94a3b8;
}
@media (max-width: 360px) {
  .mobile-grid-row {
    grid-template-columns: 78px 1fr;
  }
  .mobile-actions {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
