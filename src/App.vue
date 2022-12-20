<template>
  <van-config-provider theme="dark">
    <div class="flex flex-col h-screen" :class="{ 'overflow-hidden': isClock }">
      <div class="main-navbar" :class="{ 'hide-to-top': isClock }">
        <NavBar />
      </div>
      <div class="flex-1">
        <router-view />
      </div>
    </div>
  </van-config-provider>
</template>
<script lang="ts" setup>
import NavBar from "@/views/NavBar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const isClock = computed(() => route.name === "clock");
</script>

<style scoped lang="scss">
.main-navbar {
  @apply transition;

  &.hide-to-top {
    @apply pointer-events-none;
    transform: translateY(-100%);
  }
}
</style>
