<template>
  <van-skeleton title avatar :row="3" :loading="hostLoading">
    <van-empty
      v-if="isNil(activeHostId)"
      image="error"
      description="无可用主机"
    />
    <iframe
      ref="iframeRef"
      class="w-full overflow-auto flex-1"
      :src="url"
      v-else
      @load="handleLoad"
    ></iframe>
  </van-skeleton>
</template>

<script lang="ts" setup>
import type { Host } from "@/api/hosts.d";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { isNil, debounce } from "lodash-es";

interface IHost extends Host {
  id: symbol;
  thumb: string;
}

const baseUrl = import.meta.env.VITE_GRAFANA_URL;
const props = defineProps<{
  hostListRef: {
    loading: boolean;
    activeId: symbol | null;
    hostMap: Map<symbol, IHost>;
  } | null;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);
const hostLoading = computed(() => props.hostListRef?.loading ?? true);
const activeHostId = computed(() => props.hostListRef?.activeId ?? null);
const hostMap = computed(
  () => props.hostListRef?.hostMap ?? new Map<symbol, IHost>()
);
const currentHost = computed(() =>
  isNil(activeHostId.value)
    ? null
    : hostMap.value.get(activeHostId.value!) ?? null
);
const url = computed(() => {
  if (isNil(currentHost.value)) {
    return "";
  }
  let url = "";
  switch (currentHost.value!.metric.job) {
    case "windows_exporter":
      url = `/d/Kdh0OoSGz/1-windows_exporter-for-prometheus-dashboard-cn-v20201012?orgId=1&var-job=windows_exporter&var-instance=${
        currentHost.value!.metric.instance
      }&var-hostname=All&kiosk&refresh=5s`;
      break;
    case "node_exporter":
    case "mac_node_exporter":
      url = `/d/aka/1-node-exporter-dashboard-22-04-13-consulmanagerzi-dong-tong-bu-ban?orgId=1&var-instance=${
        currentHost.value!.metric.instance.split(":")[0]
      }&kiosk&refresh=5s`;
      break;
  }
  return `${baseUrl}${url}`;
});

async function handleLoad() {
  await nextTick();
}
</script>

<style scoped lang="scss"></style>
