<template>
  <div class="container">
    <div class="search-people-container">
      <div>
        <label>{{ t('admin.makeWithDiary.searchLabel') }}</label>
        <div class="search-box">
          <input
            type="text"
            class="form-control"
            :placeholder="t('admin.makeWithDiary.searchPlaceholder')"
            v-model="acount"
          />
          <button type="button" class="btn bg-gradient-primary search-button" @click="searchUser">
            {{ t('common.searchAction') }}
          </button>
        </div>
      </div>
    </div>
    <div class="added-people-container" style="margin-top: 5rem">
      <!-- Mobile List -->
      <div class="d-lg-none">
        <ul class="list-group list-group-flush">
          <li
            v-for="(item, idx) in props.userList"
            :key="`${item.id}-${idx}`"
            class="list-group-item mobile-item"
          >
            <div class="mobile-grid-row">
              <span class="mobile-label">{{ t('table.tableComponent.number') }}</span>
              <span class="mobile-value">{{ item.id || '' }}</span>
            </div>
            <div class="mobile-grid-row">
              <span class="mobile-label">{{ t('table.approvePage.account') }}</span>
              <span class="mobile-value">{{ item.username || '' }}</span>
            </div>
            <div class="mobile-grid-row">
              <span class="mobile-label">{{ t('table.approvePage.name') }}</span>
              <span class="mobile-value">{{ item.name || '' }}</span>
            </div>
            <div class="mobile-grid-row">
              <span class="mobile-label">{{ t('admin.makeWithDiary.joinDate') }}</span>
              <span class="mobile-value">{{ formatDate(item.create_at) || '' }}</span>
            </div>
            <div class="mobile-actions">
              <a href="javascript:;" class="table-action-link danger" @click="deleteUser(item.id)">
                {{ t('button.delete') }}
              </a>
            </div>
          </li>
          <li v-if="props.userList.length === 0" class="list-group-item text-center">
            <p class="result-text mb-0">{{ t('admin.makeWithDiary.empty') }}</p>
          </li>
        </ul>
      </div>

      <!-- Desktop table -->
      <div class="d-none d-lg-block">
        <table class="table align-items-center justify-content-center mb-3">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
                style="width: 10%; text-align: center"
              >
                {{ t('table.tableComponent.number') }}
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
                style="width: 25%; text-align: center"
              >
                {{ t('table.approvePage.account') }}
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
                style="width: 25%; text-align: center"
              >
                {{ t('table.approvePage.name') }}
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
                style="width: 20%; text-align: center"
              >
                {{ t('admin.makeWithDiary.joinDate') }}
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
                style="width: 10%; text-align: center"
              >
                {{ t('button.delete') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="props.userList.length > 0">
              <tr v-for="(item, idx) in props.userList" :key="idx">
                <td style="width: 10%; text-align: center">
                  <p class="text-sm font-weight-bold mb-0 text-center">{{ item.id || '' }}</p>
                </td>
                <td style="width: 25%; text-align: left">
                  <p class="text-sm font-weight-bold mb-0 text-center">{{ item.username || '' }}</p>
                </td>
                <td style="width: 25%; text-align: center">
                  <p class="text-sm font-weight-bold mb-0 text-center">{{ item.name || '' }}</p>
                </td>
                <td style="width: 20%; text-align: center">
                  <p class="text-sm font-weight-bold mb-0 text-center">
                    {{ formatDate(item.create_at) || '' }}
                  </p>
                </td>
                <td style="width: 10%; text-align: center">
                  <a href="javascript:;" @click="deleteUser(item.id)"
                    ><p class="text-sm font-weight-bold mb-0 text-center text-danger">
                      {{ t('button.delete') }}
                    </p></a
                  >
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="5" class="no-results">
                  <div class="result-container">
                    <i class="fas fa-search"></i>
                    <p class="result-text">{{ t('admin.makeWithDiary.empty') }}</p>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/utils/dateFormat'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const acount = ref('')
const emit = defineEmits(['search-user'])

const props = defineProps({
  userList: Array
})

const { t } = useI18n()

const searchUser = () => {
  emit('search-user', acount.value)
  acount.value = ''
}

const deleteUser = (id) => {
  emit('delete-user', id)
}
</script>

<style scoped>
.search-people-container {
  width: 100%;
}
.search-box {
  display: flex;
}
.search-button {
  margin-bottom: 0 !important;
  margin-left: 2rem;
  width: 30%;
}

.added-people-container {
  overflow: auto;
}
.no-results {
  text-align: center;
  vertical-align: middle;
  height: 200px;
  background-color: #f8f9fa; /* 연한 회색 배경 */
  border: 1px solid #ddd; /* 테두리 */
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

.result-text {
  font-size: 18px;
  font-weight: bold;
  color: #555; /* 어두운 회색 */
  margin-top: 10px;
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
  justify-content: flex-end;
  margin-top: 0.75rem;
}
.table-action-link {
  color: #475569;
  text-decoration: underline;
  font-weight: 600;
}
.table-action-link.danger {
  color: #f87171;
}
.table-action-link:hover {
  opacity: 0.9;
}
@media (max-width: 360px) {
  .mobile-grid-row {
    grid-template-columns: 78px 1fr;
  }
}
</style>
