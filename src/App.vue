<template>
  <navigation-menu />
  <router-view id="page-body"></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import 'primeicons/primeicons.css'
import NavigationMenu from "@/components/NavigationMenu.vue";

export default defineComponent({
  components: {
    NavigationMenu
  },
});
</script>

<style></style>
