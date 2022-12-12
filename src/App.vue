<template>
  <van-config-provider theme="dark">
    <div class="flex flex-col h-screen">
      <NavBar />
      <div class="flex-1">
        <router-view />
      </div>
    </div>
  </van-config-provider>
</template>
<script lang="ts" setup>
import NavBar from "@/views/NavBar.vue";
</script>

<style></style>
