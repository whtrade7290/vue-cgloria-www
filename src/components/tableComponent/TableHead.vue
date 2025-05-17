<template>
  <thead>
    <tr>
      <th
        v-for="(item, key) in headerList"
        :key="key"
        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center"
        :style="{ width: item.width }"
      >
        {{ $t(item.label) }}
      </th>
    </tr>
  </thead>
</template>

<script setup>
defineProps(['headerList'])
</script>

<style lang="scss" scoped></style>
