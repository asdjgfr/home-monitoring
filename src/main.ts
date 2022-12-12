import { createApp } from "vue";
import "@/assets/style/index.scss";
import "vant/es/notify/style";
import App from "./App.vue";
import router from "@/router";

async function main() {
  const app = createApp(App);
  app.use(router);

  await app.mount("#app").$nextTick(() => {
    postMessage({ payload: "vueReady" }, "*");
  });
}

main().then();
