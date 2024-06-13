<template>
  <div class="mx-4">
    <router-link :to="link" routerLinkActive="router-link-active" class="py-2 -ml-2 flex">
      <img v-bind:src="this.imgSrc" class="h-11" />
      <h2 class="text-2xl uppercase font-medium my-auto ml-2 mr-auto">
        {{ title }}
      </h2>
    </router-link>
    <p>{{ description }}</p>
    <router-link :to="link" routerLinkActive="router-link-active"
      class="flex border-b-2 border-ctid-light-purple uppercase w-max mt-6">
      <p class="link font-semibold">{{ linkText }}</p>
      <img :src="ArrowRight" class="h-6 ml-8" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ArrowRight from "@/assets/arrow-right.svg"

export default defineComponent({
  props: {
    title: String,
    description: String,
    imgSrc: String,
    link: String,
    linkText: {
      type: String,
      default: "Learn More"
    }
  },
  data() {
    return {
      ArrowRight
    };
  },
  methods: {
  },
});
</script>

<style scoped></style>
