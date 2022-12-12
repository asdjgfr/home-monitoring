import { post, prometheusBaseUrl } from "@/api/index";

export async function getUpHosts() {
  return await post(`${prometheusBaseUrl}/-/reload`);
}
