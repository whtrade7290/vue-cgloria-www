<template>
  <tbody>
    <tr v-for="(body, key) in bodyList" :key="key">
      <td
        class="text-center"
        v-for="(header, key) in headerList"
        :key="key"
        :style="{ width: header.width }"
      >
        <p class="text-sm font-weight-bold mb-0" v-if="header.isSlot">
          <slot name="btn" :body="body" :header="header" />
        </p>
        <p class="text-sm font-weight-bold mb-0" v-else>
          {{
            header.key === 'update_at' || header.key === 'create_at'
              ? formatDate(body[header.key])
              : body[header.key]
          }}
        </p>
      </td>
    </tr>
  </tbody>
</template>

<script setup>
import { formatDate } from '@/utils/dateFormat'

const props = defineProps(['headerList', 'bodyList'])

console.log('bodyList', typeof props.bodyList[0].update_at)
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
