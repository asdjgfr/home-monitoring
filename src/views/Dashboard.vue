<template>
  <div class="dashboard">
    <HostsAverageCPULoad />
  </div>
</template>

<script lang="ts" setup>
import HostsAverageCPULoad from "@/views/Dashboard/HostsAverageCPULoad.vue";
</script>

<style scoped lang="scss">
.dashboard {
  @apply grid grid-cols-2 gap-4;
  > div {
    height: 50vh;
  }
}
</style>
