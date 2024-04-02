import { defineStore } from "pinia";

export const useCalculatorStore = defineStore("calculator", {
  state: () => ({
    activeFiltersObj: [],
    // todo: set NIST, CIS, and OS options from the technique data
    filterPropertiesObj: [
      {
        id: "nist",
        label: "NIST 800-53 Controls",
        options: [{ id: "test", name: "Test", value: false }],
      },
      {
        id: "cis",
        label: "CIS Security Controls",
        options: [{ id: "test", name: "Test", value: false }],
      },
      {
        id: "detection",
        label: "Detection Analytics",
        options: [
          { id: "has_car", name: "CAR", value: false },
          { id: "has_es_siem", name: "Elastic Search SIEM", value: false },
          { id: "has_sigma", name: "Sigma", value: false },
          { id: "has_splunk", name: "Splunk", value: false },
        ],
      },
      {
        id: "os",
        label: "Operating Systems",
        options: [{ id: "test", name: "Test", value: false }],
      },
    ],
    systemScoreObj: {
      network: { label: "None", value: 1 },
      process: { label: "None", value: 1 },
      file: { label: "None", value: 1 },
      cloud: { label: "None", value: 1 },
      hardware: { label: "None", value: 1 },
    },
  }),
  getters: {
    activeFilters(state) {
      return state.activeFiltersObj;
    },
    filterProperties(state) {
      return state.filterPropertiesObj;
    },
    systemScore(state) {
      return state.systemScoreObj;
    },
  },
  actions: {
    updateActiveFilters(filterValues) {
      console.log("updating filter values to", filterValues);
      this.activeFiltersObj = filterValues;
    },
    updateSystemScores(scores) {
      console.log("updating system scores to", scores);
      this.systemScoreObj = scores;
    },
  },
});
