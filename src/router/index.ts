import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import MethodologyPage from "@/components/MethodologyPage.vue";
import TopTen from "@/components/TopTen.vue";
import HelpPage from "@/components/HelpPage.vue";
import CalculatorPage from "@/components/CalculatorPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/methodology",
    name: "methodology",
    component: MethodologyPage,
  },
  {
    path: "/help",
    name: "help",
    component: HelpPage,
  },
  {
    path: "/calculator",
    name: "calculator",
    component: CalculatorPage,
  },
  {
    path: "/top-10-lists",
    name: "top-10-lists",
    component: TopTen,
  },
  {
    path: "/calculator-results",
    name: "calculator-results",
    component: TopTenResults,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export { router };
