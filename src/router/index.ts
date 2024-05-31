import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import MethodologyPage from "@/views/MethodologyPage.vue";
import TopTen from "@/views/TopTen.vue";
import HelpPage from "@/views/HelpPage.vue";
import TopTenResults from "../views/TopTenResults.vue";
import CalculatorPage from "../views/CalculatorPage.vue";
import { nextTick } from "vue";
const routes = [
  {
    path: "/",
    name: "",
    component: HomePage,
  },
  {
    path: "/methodology",
    name: "methodology",
    component: MethodologyPage,
    meta: { title: "Methodology" },
  },
  {
    path: "/help",
    name: "help",
    component: HelpPage,
    meta: { title: "Help" },
  },
  {
    path: "/calculator",
    name: "calculator",
    component: CalculatorPage,
    meta: { title: "Calculator" },
  },
  {
    path: "/top-10-lists",
    name: "top-ten-lists",
    component: TopTen,
    meta: { title: "Top 10 Lists" },
  },
  {
    path: "/calculator/results",
    name: "calculator-results",
    component: TopTenResults,
    meta: { title: "Calculator Results" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior() {
    // always scroll to top when linking to a new page
    return { top: 0 };
  },
});

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title
      ? to.meta.title + " | Top ATT&CK Techniques"
      : "Top ATT&CK Techniques";
  });
});

export { router };
