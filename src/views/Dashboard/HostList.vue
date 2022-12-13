<template>
  <div class="host-list">
    <van-card
      v-for="[id, host] in hostMap.entries()"
      :class="{
        active: id === activeId,
        'cursor-pointer': host.value[1] === '1',
        'cursor-not-allowed': host.value[1] === '0',
      }"
      :key="host.id"
      :desc="host.metric.instance"
      :title="host.name"
      :thumb="host.thumb"
      @click="handleChangeActiveHost(id)"
    >
      <template #tags>
        <van-tag v-if="host.value[1] === '1'" plain type="success "
          >在线</van-tag
        >
        <van-tag v-else plain type="danger">离线</van-tag>
      </template>
    </van-card>
  </div>
  <van-divider />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { getUpHosts } from "@/api/hosts";
import { showNotify } from "vant";
import type { Host } from "@/api/hosts.d";
import WindowsIcon from "@/assets/icons/windows 11.png";
import LinuxIcon from "@/assets/icons/linux.png";
import QuestionIcon from "@/assets/icons/question.svg";
import AppleIcon from "@/assets/icons/apple.png";

interface IHost extends Host {
  id: symbol;
  name: string;
  thumb: string;
}

const hostMap = reactive<Map<symbol, IHost>>(new Map());
const loading = ref(true);
const activeId = ref<symbol | null>(null);

onMounted(async () => {
  await loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const hosts = await getUpHosts();
    hostMap.clear();
    for (let i = 0; i < hosts.length; i++) {
      const id = Symbol();
      const host = hosts[i];
      const key = `name_${host.metric.instance
        .split(":")[0]!
        .replace(/\./g, "_")}`;
      hostMap.set(id, {
        ...host,
        id,
        name: (host.metric[key] as string) ?? host.metric.instance,
        thumb: ((host) => {
          switch (host.metric.job) {
            case "windows_exporter":
              return WindowsIcon;
            case "node_exporter":
              return LinuxIcon;
            case "mac_node_exporter":
              return AppleIcon;
            default:
              return QuestionIcon;
          }
        })(host),
      });
    }

    activeId.value =
      [...hostMap.values()].find((h) => h.value[1] === "1")?.id ?? null;
  } catch (e) {
    showNotify({ type: "danger", message: `主机获取失败：${e}` });
  }
  loading.value = false;
}

function handleChangeActiveHost(id: symbol) {
  if (hostMap.has(id) && hostMap.get(id)!.value[1] !== "0") {
    activeId.value = id;
  }
}

defineExpose({
  activeId,
  hostMap,
  loading,
});
</script>

<style scoped lang="scss">
.host-title {
  @apply text-2xl text-center my-3;
}

.host-list {
  @apply shadow-xl flex overflow-x-auto gap-3 p-3 mb-5;
  .active {
    @apply bg-slate-900;
    box-shadow: inset 0 0 0 1px hsl(0deg 0% 100% / 10%);
  }
}
</style>
