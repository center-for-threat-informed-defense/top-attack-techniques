import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import Methodology from "@/components/Methodology.vue";
import Help from "@/components/Help.vue";
import Calculator from "@/components/Calculator.vue";
import TopTen from "@/components/TopTen.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/methodology",
    name: "methodology",
    component: Methodology,
  },
  {
    path: "/help",
    name: "help",
    component: Help,
  },
  {
    path: "/calculator",
    name: "calculator",
    component: Calculator,
  },
  {
    path: "/top-10-lists",
    name: "top-10-lists",
    component: TopTen,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { router };
