<template>
  <div class="bg-white my-6 shadow-lg">
    <router-link
      :to="link"
      routerLinkActive="router-link-active"
      class="bg-mitre-primary-purple text-white py-2 px-4 flex"
    >
      <img v-bind:src="getImgUrl()" class="h-11" />
      <h2 class="text-xl uppercase my-auto ml-4 mr-auto">{{ title }}</h2>
      <img src="../assets/arrow-right.svg" />
    </router-link>
    <div class="py-2 px-4 pb-4">
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: String,
    description: String,
    imgSrc: String,
    link: String,
  },
  data() {
    return {};
  },
  methods: {
    getImgUrl() {
      return "/src/assets/" + this.imgSrc;
    },
  },
});
</script>

<style scoped></style>
