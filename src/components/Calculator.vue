<template>
  <section class="w-5/6 mx-auto py-20 text-center">
    <h1 class="uppercase text-4xl">Top ATT&CK Techniques Calculator</h1>
    <p>Use the following criteria to score your system and click generate in order to see your personalized list of techniques</p>
    <div class="container-row">
      <div class="lg:w-2/5 container">
        <div class="container-header">
          <h2>Filters</h2>
        </div>
        <div class="container-body">

        </div>
      </div>
      <div class="lg:w-3/5 container">
        <div class="container-header">
          <h2>Score your system</h2>
        </div>
        <div class="container-body">

        </div>
      </div>
    </div>
    <button class="btn-primary w-1/3">Generate</button>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useExampleStore } from "../stores/example.store";

export default defineComponent({
  data() {
    return {
      exampleStore: useExampleStore(),
    };
  },
});
</script>

<style scoped></style>
