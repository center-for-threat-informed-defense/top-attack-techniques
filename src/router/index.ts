import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import MethodologyPage from "@/views/MethodologyPage.vue";
import TopTen from "@/views/TopTen.vue";
import HelpPage from "@/views/HelpPage.vue";
import TopTenResults from "../views/TopTenResults.vue";
import CalculatorPage from "../views/CalculatorPage.vue";
const routes = [
  {
    path: "/",
    name: "",
    component: HomePage,
  },
  {
    path: "/methodology",
    name: "Methodology",
    component: MethodologyPage,
  },
  {
    path: "/help",
    name: "Help",
    component: HelpPage,
  },
  {
    path: "/calculator",
    name: "Calculator",
    component: CalculatorPage,
  },
  {
    path: "/top-10-lists",
    name: "Top Ten Lists",
    component: TopTen,
  },
  {
    path: "/calculator/results",
    name: "Calculator Results",
    component: TopTenResults,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach((to) => {
  document.title = to.name
    ? to.name.toString() + " | Top ATT&CK Techniques"
    : "Top ATT&CK Techniques";
});

export { router };
