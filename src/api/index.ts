import { ipcRenderer } from "electron";

export const prometheusBaseUrl = "http://192.168.31.220:9090";
export const prometheusUrl = `${prometheusBaseUrl}/api/v1`;
export async function get<T = any>(
  url: string,
  config?: { params: Record<string, unknown> }
): Promise<{
  status: string;
  data: T;
}> {
  return await ipcRenderer.invoke("get", url, config);
}

export async function post(url: string, config?: Record<string, unknown>) {
  return await ipcRenderer.invoke("post", url, config);
}
