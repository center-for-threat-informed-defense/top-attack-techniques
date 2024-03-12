import { defineStore } from "pinia";

export const useExampleStore = defineStore("example", () => {
    const name = "App Lab";
    return { name };
});