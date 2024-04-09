<template>
  <Navigation />
  <router-view id="page-body"></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navigation from "@/components/Navigation.vue";
import 'primeicons/primeicons.css'

export default defineComponent({
  components: {
    Navigation,
  },
});
</script>

<style></style>
