import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Clock from "@/views/Clock/Clock.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/clock", component: Clock, name: "clock" },
  { path: "/404", redirect: "/" },
  { path: "/:pathMatch(.*)*", redirect: "/404" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
