import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Methodology from "@/views/Methodology.vue";
import Help from "@/views/Help.vue";
import Calculator from "@/views/Calculator.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { router };
