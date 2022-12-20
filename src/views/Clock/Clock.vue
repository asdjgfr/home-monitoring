<template>
  <div class="clock" @click="backToMain">
    <p class="text-center">
      {{ date }} <span class="text-red-700">{{ arr[day] }}</span>
    </p>
    <div class="number-clock">
      <span>{{ hour }}</span>
      <span class="separator">:</span>
      <span>{{ minute }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";

const arr = ["日", "一", "二", "三", "四", "五", "六"];

const router = useRouter();
const hour = ref("");
const minute = ref("");
const date = ref("");
const day = ref(0);
setVal();
const timer = setInterval(setVal, 1000);

onBeforeUnmount(() => {
  clearTimeout(timer);
});

function setVal() {
  const d = new Date();
  hour.value = padZero(d.getHours());
  minute.value = padZero(d.getMinutes());
  date.value = d.toLocaleDateString();
  day.value = d.getDay();
}

function padZero(str: string | number) {
  return String(str).padStart(2, "0");
}

function backToMain() {
  router.push("/");
}
</script>

<style scoped lang="scss">
.clock {
  @apply h-full relative text-white;

  .number-clock {
    @apply absolute w-full h-full flex justify-center;
    span {
      font-size: 20vw;
    }
    .separator {
      animation: twinkle linear 1s alternate infinite;
      transform: translateY(-0.1em);
    }
  }
}
@keyframes twinkle {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
