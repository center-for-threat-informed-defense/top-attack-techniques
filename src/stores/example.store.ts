import { defineStore } from "pinia";

export const useExampleStore = defineStore("example", () => {
  const name = "Top ATT&CK Techniques";
  return { name };
});
