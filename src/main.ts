import { createApp } from "vue";
import "vant/es/notify/style";
import "@/assets/style/index.scss";
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
