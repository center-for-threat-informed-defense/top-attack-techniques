<template>
  <div class="mx-4">
    <router-link :to="link" routerLinkActive="router-link-active" class="py-2 -ml-2 flex">
      <img v-bind:src="imgSrc" class="md:h-11 h-8" alt="" />
      <h2 class="md:text-2xl text-xl uppercase font-medium my-auto ml-2 mr-auto">
        {{ title }}
      </h2>
    </router-link>
    <p class="text-sm md:text-[15px]">{{ description }}</p>
    <router-link :to="link" routerLinkActive="router-link-active"
      class="flex border-b-2 border-ctid-light-blue uppercase w-max md:mt-6 mt-3">
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
    link: {
      type: String,
      default: "/"
    },
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

<style scoped>
.link {
  @apply hover:text-ctid-light-blue md:text-lg;
  font-family: "Fira Sans Extra Condensed", sans-serif;
}
</style>
