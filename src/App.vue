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

<style>

.v-popper--theme-my-theme .v-popper__inner {
  background: #fff;
  color: black;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: 0 6px 30px rgba(0, 0, 0, .1);
}

.v-popper--theme-my-theme .v-popper__arrow-inner {
  visibility: visible;
  border-color: #fff;
}

.v-popper--theme-my-theme .v-popper__arrow-outer {
  border-color: #ddd;
}

/* Transition */

.v-popper--theme-my-theme.v-popper__popper--hidden {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.v-popper--theme-my-theme.v-popper__popper--shown {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}

.v-popper--theme-my-theme.v-popper__popper--skip-transition {
  transition: none !important;
}

</style>
