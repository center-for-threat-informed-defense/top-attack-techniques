<template>
  <div>
    <div>This is the Top ATT&CK Techniques calculator page</div>
    <div>Data from store: {{ exampleStore.name }}</div>
  </div>
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
