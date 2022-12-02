<template>
  <div class="h-20">
    <VCharts :extensions="extensions" ref="chart"></VCharts>
  </div>
</template>

<script lang="ts" setup>
import VCharts from "@/components/VCharts/VCharts.vue";
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
import { getHostCPU, getUpHosts } from "@/api/hosts";
import { getStatusColor, prometheusLoop } from "@/utils";
import { isEqual, isNumber } from "lodash";

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
    text: "主机 CPU 使用率排行榜",
    left: "center",
    top: 5,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // Use axis to trigger tooltip
      type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    min: 0,
    max: "dataMax",
  },
  yAxis: {
    type: "category",
    data: [],
    inverse: true,
    animationDuration: 300,
    animationDurationUpdate: 300,
    axisLabel: { show: false },
  },
  series: [
    {
      realtimeSort: true,
      name: "CPU 使用率",
      type: "bar",
      data: [],
      barGap: "-100%",
      label: {
        show: true,
        position: "top",
        formatter: "{b}",
      },
    },
    {
      data: [],
      name: "CPU 使用率标题内部标题",
      type: "bar",
      itemStyle: {
        color: "transparent",
      },
      label: {
        show: true,
        fontSize: 20,
        position: "right",
        valueAnimation: true,
        formatter: "{c} %",
      },
    },
  ],
  animationDuration: 0,
  animationDurationUpdate: 200,
};

onMounted(async () => {
  await nextTick();
  await prometheusLoop(loadData);
});

async function loadData() {
  const timer = setTimeout(
    () => chart.value?.chartInstance?.showLoading(),
    200
  );
  const hosts = await getUpHosts();
  (barOption.series as any[]).forEach((s) => {
    s.data = Array.from({ length: hosts.length }, () => 0);
  });
  chart.value?.chartInstance?.setOption(barOption);
  const yAxis = hosts.map((item) => item.instance);

  const shouldUpdateYAxis = !isEqual(
    (barOption.yAxis as { data: string[] }).data,
    yAxis
  );

  if (shouldUpdateYAxis) {
    Object.assign(barOption.yAxis!, { data: yAxis });
  }

  const series: (
    | number
    | {
        value: number;
        itemStyle: {
          color: string;
        };
      }
  )[] = [];
  for (let i = 0; i < hosts.length; i++) {
    const value = Number(
      Number((await getHostCPU(hosts[i].instance, hosts[i].job)).value).toFixed(
        2
      )
    );

    series.push(
      ((value) => {
        if (value > 80)
          return {
            value,
            itemStyle: {
              color: `rgb(${getStatusColor("danger")})`,
            },
          };

        if (value > 70)
          return {
            value,
            itemStyle: {
              color: `rgb(${getStatusColor("serious")})`,
            },
          };

        return value;
      })(value)
    );
  }
  const dataMax =
    Math.max(...series.map((item) => (isNumber(item) ? item : item.value))) * 2;
  chart.value?.chartInstance?.setOption({
    ...(shouldUpdateYAxis
      ? {
          yAxis: {
            type: "category",
            data: yAxis,
          },
        }
      : null),
    series: [
      {
        type: "bar",
        data: series,
      },
      {
        type: "bar",
        data: series.map((item) => {
          if (isNumber(item)) return item;
          return {
            ...item,
            ...(item.value > 70
              ? {
                  label: {
                    position: "insideRight",
                  },
                }
              : null),
          };
        }),
      },
    ],
    xAxis: {
      max: dataMax > 100 ? 100 : dataMax,
    },
  });
  clearTimeout(timer);
  chart.value?.chartInstance?.hideLoading();
}
</script>

<style scoped lang="scss"></style>
