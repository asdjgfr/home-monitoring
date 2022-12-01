import * as echarts from "echarts/core";
import { ECBasicOption } from "echarts/types/dist/shared";
import type { EChartsType } from "echarts";
import type { Ref } from "vue";

export interface VChartsType {
  chartRef: Ref<HTMLElement | null>;
  mounted: Ref<boolean>;
  chartInstance: EChartsType | null;
  echarts: typeof echarts;
  setOption: <Opt extends ECBasicOption>(
    option: Opt,
    notMerge?: boolean,
    lazyUpdate?: boolean
  ) => void;
  use: (
    ext:
      | EChartsExtensionInstaller
      | EChartsExtension
      | (EChartsExtensionInstaller | EChartsExtension)[]
  ) => void;
}
