<template>
  <div class="h-20">
    <ECharts :extensions="extensions" ref="chart"></ECharts>
  </div>
</template>

<script lang="ts" setup>
import ECharts from "@/components/VCharts/VCharts.vue";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
  MarkLineComponent,
  VisualMapComponent,
  TitleComponent,
  LegendComponent,
} from "echarts/components";
import * as echartsCore from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import type { VChartsType } from "@/components/VCharts/VCharts.d";
import type {
  DataZoomComponentOption,
  MarkLineComponentOption,
  VisualMapComponentOption,
  TitleComponentOption,
  LegendComponentOption,
} from "echarts/components";
import { nextTick, onMounted, ref } from "vue";
import { get } from "@/api";
import { getUpHosts } from "@/api/hosts";

const chart = ref<VChartsType | null>(null);

const extensions = [
  BarChart,
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
  MarkLineComponent,
  VisualMapComponent,
  TitleComponent,
  LegendComponent,
];

const barOption: echartsCore.ComposeOption<
  | BarSeriesOption
  | DataZoomComponentOption
  | MarkLineComponentOption
  | VisualMapComponentOption
  | TitleComponentOption
  | LegendComponentOption
> = {
  title: {
    text: "主机 CPU 平均负载",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // Use axis to trigger tooltip
      type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  series: [
    {
      name: "Direct",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: [90, 30, 50, 1, 2, 3, 4],
    },
    {
      name: "Mail Ad",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: [0.9, 13.0, "-", 15, 6, 7, 8],
    },
  ],
};

onMounted(async () => {
  await nextTick();
  await loadData();
  chart.value?.chartInstance?.setOption(barOption);
});

async function loadData() {
  console.log(await getUpHosts());
}
</script>

<style scoped lang="scss"></style>
