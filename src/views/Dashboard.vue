<template>
  <div class="dashboard">
    <HostList ref="hostListRef" />
    <GrafanaDashboard :host-list-ref="hostListRef" />
  </div>
</template>

<script lang="ts" setup>
import HostList from "@/views/Dashboard/HostList.vue";
import GrafanaDashboard from "@/views/Dashboard/GrafanaDashboard.vue";
import { ref } from "vue";

const hostListRef = ref(null);
</script>

<style scoped lang="scss">
.dashboard {
  @apply h-full flex flex-col;
}
</style>
