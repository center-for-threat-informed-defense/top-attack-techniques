import { defineStore } from "pinia";

export const useCalculatorStore = defineStore("calculator", {
  state: () => ({
    activeFiltersObj: [],
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
      network: 1,
      process: 1,
      file: 1,
      cloud: 1,
      hardware: 1,
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
      this.activeFilters = filterValues;
    },
  },
});
