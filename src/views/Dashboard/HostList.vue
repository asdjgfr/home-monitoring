<template>
  <header class="host-title">
    <h1>主机列表</h1>
  </header>

  <div class="host-list">
    <van-card
      v-for="host in hosts"
      :class="{ active: host.id === activeId }"
      class="cursor-pointer"
      :key="host.id"
      :desc="host.metric.instance"
      title="商品标题"
      :thumb="host.thumb"
    >
      <template #tags>
        <van-tag v-if="host.value[1] === '1'" plain type="success "
          >在线</van-tag
        >
        <van-tag v-else plain type="danger">离线</van-tag>
      </template>
    </van-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { getUpHosts } from "@/api/hosts";
import { showNotify } from "vant";
import type { Host } from "@/api/host.d";
import WindowsIcon from "@/assets/icons/windows_11.svg";
import LinuxIcon from "@/assets/icons/linux.svg";
import QuestionIcon from "@/assets/icons/question.svg";

interface IHost extends Host {
  id: Symbol;
  thumb: string;
}

const hosts = reactive<IHost[]>([]);
const activeId = ref<Symbol | null>(null);

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    hosts.splice(
      0,
      hosts.length,
      ...(await getUpHosts()).map((h) => ({
        ...h,
        id: Symbol(),
        thumb: ((h) => {
          switch (h.metric.job) {
            case "windows_exporter":
              return WindowsIcon;
            case "node_exporter":
              return LinuxIcon;
            default:
              return QuestionIcon;
          }
        })(h),
      }))
    );
    activeId.value = hosts.find((h) => h.value[1] === "1")?.id ?? null;
  } catch (e) {
    showNotify({ type: "danger", message: `主机获取失败：${e}` });
  }
}
</script>

<style scoped lang="scss">
.host-title {
  @apply text-2xl text-center my-3;
}

.host-list {
  @apply flex overflow-x-auto gap-3 py-3;
  .active {
    @apply bg-slate-900;
    box-shadow: inset 0 0 0 1px hsl(0deg 0% 100% / 10%);
  }
}
</style>
