import { createApp } from "vue";
import { router } from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./index.css";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/mdc-dark-deeppurple/theme.css";

const pinia = createPinia();
createApp(App).use(pinia).use(router).use(PrimeVue).mount("#app");
