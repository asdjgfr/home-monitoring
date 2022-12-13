<template>
  <van-nav-bar title="家庭集群监控">
    <template #right>
      <van-icon name="ellipsis" size="18" @click="handleShowShare" />
    </template>
  </van-nav-bar>
  <van-share-sheet
    v-model:show="showShare"
    title="更多操作"
    :options="options"
    @select="handleSelect"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import reloadIcon from "@/assets/icons/reload.svg";
import fullscreenIcon from "@/assets/icons/fullscreen.svg";
import reloadPrometheusIcon from "@/assets/icons/reload_prometheus.svg";
import { ipcRenderer } from "electron";
import { getUpHosts } from "@/api/prometheus";

type Option = {
  name: string;
  icon: string;
  action: string;
};

const showShare = ref(false);
const options: Option[][] = [
  [
    { name: "刷新", icon: reloadIcon, action: "reload" },
    { name: "切换全屏", icon: fullscreenIcon, action: "fullscreen" },
    {
      name: "重载 Prometheus 配置",
      icon: reloadPrometheusIcon,
      action: "reloadPrometheus",
    },
  ],
];

function handleShowShare() {
  showShare.value = true;
}

async function handleSelect(option: Option) {
  switch (option.action) {
    case "reload":
      handleReload();
      break;
    case "fullscreen":
      await handleToggleFullScreen();
      break;
    case "reloadPrometheus":
      await handleReloadPrometheus();
      break;
  }
  showShare.value = false;
}

function handleReload() {
  window.location.reload();
}

async function handleToggleFullScreen() {
  await ipcRenderer.invoke(
    "set-full-screen",
    !(await ipcRenderer.invoke("is-full-screen"))
  );
}

async function handleReloadPrometheus() {
  await getUpHosts();
  handleReload();
}
</script>

<style scoped lang="scss"></style>
