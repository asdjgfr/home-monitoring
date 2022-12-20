<template>
  <div class="dashboard">
    <HostList ref="hostListRef" />
    <GrafanaDashboard :host-list-ref="hostListRef" />
  </div>
</template>

<script lang="ts" setup>
import HostList from "@/views/Dashboard/HostList.vue";
import GrafanaDashboard from "@/views/Dashboard/GrafanaDashboard.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const hostListRef = ref(null);
const router = useRouter();
const controller = new AbortController();
const signal = controller.signal;

onMounted(async () => {
  try {
    const idleDetector = new window.IdleDetector();
    idleDetector.addEventListener("change", () => {
      if (idleDetector.userState !== "active") {
        router.push({ name: "clock" });
      }
    });

    await idleDetector.start({
      threshold: 30_000,
      signal,
    });
  } catch (err) {
    const { name, message } = err as Error;
    console.error(name, message);
  }
});
onBeforeUnmount(() => {
  controller.abort();
});
</script>

<style scoped lang="scss">
.dashboard {
  @apply h-full flex flex-col;
}
</style>
