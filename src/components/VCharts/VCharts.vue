<template>
  <div ref="chartRef" class="ni-chart" />
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import * as echarts from "echarts/core";
import { cloneDeep, debounce, isNil } from "lodash";
import { CanvasRenderer } from "echarts/renderers";
import darkCustom from "./themes/dark-custom";
import type { EChartsType } from "echarts";
import type { VChartsType } from "@/components/VCharts/VCharts.d";
import type { ECBasicOption } from "echarts/types/dist/shared";

const props = defineProps<{
  // FIXME echarts 的类型没有导出，等待导出后优化此处
  extensions: unknown;
  height?: string | number;
  loading?: boolean;
  theme?: string;
}>();
echarts.registerTheme("dark-custom", darkCustom);
echarts.registerTheme("dark-custom", {
  ...cloneDeep(darkCustom),
  backgroundColor: "rgba(20,20,20,1)",
});
const themeMap = new Map([
  ["dark", "dark-custom"],
  // 背景颜色为 rgb 20 20 20，故名为 dark-20
  ["dark-20", "dark-20"],
  ["light", "light"],
  ["default", "light"],
]);
const emits = defineEmits<{
  (e: "initialized", chartExpose: VChartsType): void;
}>();

const mounted = ref(false);
const chartRef = ref<HTMLElement | null>(null);
const chartExpose: VChartsType = {
  chartRef,
  echarts,
  chartInstance: null,
  mounted,
  setOption,
  use: echarts.use,
};
const resizeObserver = new ResizeObserver(debounce(resize, 40));
const computeHeight = computed(() => {
  const h = props.height ?? "100%";
  return isNaN(Number(h)) ? h : `${h}px`;
});

watch(
  () => props.loading,
  async (newVal) => {
    await waitMounted();
    if (newVal) {
      const isDark = /^dark/.test(props.theme ?? "");
      chartExpose.chartInstance?.showLoading({
        textColor: isDark ? "rgba(255,255,255)" : undefined,
        maskColor: isDark ? "rgba(0,0,0,0.8)" : undefined,
      });
    } else {
      chartExpose.chartInstance?.hideLoading();
    }
  },
  { immediate: true }
);

watch(
  () => props.theme,
  (t) => {
    const preData = chartExpose.chartInstance?.getOption() ?? {};
    if (t && !isNil(preData)) {
      chartExpose.chartInstance?.dispose();
      chartExpose.chartInstance = echarts.init(
        chartRef.value!,
        themeMap.get(t) ?? themeMap.get("default")
      ) as unknown as EChartsType;
      chartExpose.chartInstance.setOption(preData);
    }
  }
);

onMounted(async () => {
  await nextTick();
  echarts.use([
    CanvasRenderer,
    ...(Array.isArray(props.extensions)
      ? props.extensions
      : [props.extensions]),
  ]);
  chartExpose.chartInstance = echarts.init(
    chartRef.value!,
    themeMap.get(props.theme ?? "") ?? themeMap.get("default")
  ) as unknown as EChartsType;
  resizeObserver.observe(chartRef.value!);
  mounted.value = true;
  emits("initialized", chartExpose);
});

onBeforeUnmount(() => {
  chartExpose.chartInstance?.dispose();
  resizeObserver.disconnect();
});

/**
 * resize
 */
function resize() {
  chartExpose.chartInstance?.resize();
}

/**
 * 等待挂载完成
 *
 * @returns {Promise} - Promise
 */
function waitMounted() {
  return new Promise((resolve) => {
    if (mounted.value) {
      resolve(true);
      return;
    }
    const mountedWatcher = watch(mounted, (newVal) => {
      if (newVal) {
        mountedWatcher();
        resolve(newVal);
      }
    });
  });
}
/**
 * 设置图表
 *
 * @param {ECBasicOption} option - echarts 选项
 * @param {boolean} [notMerge] - 是否合并
 * @param {boolean} [lazyUpdate] - 懒加载
 */
async function setOption<Opt extends ECBasicOption>(
  option: Opt,
  notMerge?: boolean,
  lazyUpdate?: boolean
) {
  await waitMounted();
  chartExpose.chartInstance?.setOption(option, notMerge, lazyUpdate);
}

defineExpose(chartExpose);
</script>

<style scoped lang="scss">
.ni-chart {
  width: 100%;
  height: v-bind(computeHeight);
}
</style>
