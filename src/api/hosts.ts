import { get, prometheusUrl } from "@/api/index";

export async function getUpHosts() {
  return (
    await get<{
      result: {
        metric: {
          instance: string;
          job: string;
          __name__: string;
        };
        value: [number, "0" | "1"];
      }[];
      resultType: string;
    }>(`${prometheusUrl}/query`, { params: { query: "up" } })
  ).data.result
    .filter((item) => item.value[1] === "1")
    .map((item) => ({
      ip: item.metric.instance,
    }));
}
