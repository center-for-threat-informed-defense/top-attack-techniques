import { defineStore } from "pinia";

export const useCalculatorStore = defineStore({
  id: "calculator",
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
  }),
  getters: {
    activeFilters(state) {
      return state.activeFiltersObj;
    },
    filterProperties(state) {
      return state.filterPropertiesObj;
    },
  },
  actions: {
    updateActiveFilters(filterValues) {
      this.activeFilters = filterValues;
    },
  },
});
