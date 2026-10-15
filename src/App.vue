<template>
  <navigation-menu />
  <router-view id="page-body"></router-view>
  <navigation-footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import 'primeicons/primeicons.css'
import NavigationMenu from "@/components/NavigationMenu.vue";
import NavigationFooter from "@/components/NavigationFooter.vue";

export default defineComponent({
  components: {
    NavigationMenu, NavigationFooter
  },
});
</script>

<style></style>
