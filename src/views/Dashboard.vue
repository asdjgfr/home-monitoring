<template>
  <div class="dashboard">
    <HostList />
  </div>
</template>

<script lang="ts" setup>
import HostList from "@/views/Dashboard/HostList.vue";
const url = import.meta.env.VITE_GRAFANA_URL;
</script>

<style scoped lang="scss">
.dashboard {
}
</style>
