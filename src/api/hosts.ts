import { get, prometheusUrl } from "@/api/index";
import { isNil } from "lodash";

const hostJobMap = new Map([
  [
    "node_exporter",
    {
      query: (instance: string, job: string) =>
        `(sum by(instance) (irate(node_cpu_seconds_total{instance="${instance}",job="${job}", mode!="idle"}[2m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{instance="${instance}",job="${job}"}[5m])))) * 100`,
    },
  ],
  [
    "windows_exporter",
    {
      query: (instance: string, job: string) =>
        `100 - (avg(irate(windows_cpu_time_total{job=~"${job}",instance=~"${instance}",mode="idle"}[2m])))*100`,
    },
  ],
]);

export async function getUpHosts() {
  return (
    await get<{
      result: {
        metric: {
          instance: string;
          job: string;
          __name__: string;
        };
        value: [number, string];
      }[];
      resultType: string;
    }>(`${prometheusUrl}/query`, { params: { query: "up" } })
  ).data.result
    .filter((item) => item.value[1] === "1" && hostJobMap.has(item.metric.job))
    .map((item) => item.metric);
}

export async function getHostCPU(instance: string, job: string) {
  const query = hostJobMap.get(job)?.query(instance, job);
  if (isNil(query)) {
    throw new Error(`${job} 不存在`);
  }

  const res = (
    await get<{
      result: {
        metric: {
          instance: string;
          job: string;
          __name__: string;
        };
        value: [number, string];
      }[];
      resultType: string;
    }>(`${prometheusUrl}/query`, {
      params: {
        query,
      },
    })
  ).data.result[0];
  return {
    metric: {
      ...res?.metric,
      instance,
      job,
    },
    value: res?.value[1] ?? "-",
  };
}
