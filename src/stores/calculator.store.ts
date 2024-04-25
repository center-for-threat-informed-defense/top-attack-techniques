import { defineStore } from "pinia";
import json from "../data/Techniques.json";

export const useCalculatorStore = defineStore("calculator", {
  state: () => ({
    myJson: json,
    techniques: [],
    activeFiltersObj: {
      nist: [] as Array<string>,
      cis: [] as Array<string>,
      detection: [] as Array<string>,
      os: [] as Array<string>,
    },
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
    updateActiveFilters(filterValues: {
      nist: [];
      cis: [];
      detection: [];
      os: [];
    }) {
      this.activeFiltersObj = filterValues;
    },
    updateSystemScores(scores: {
      network: { label: string; value: number };
      process: { label: string; value: number };
      file: { label: string; value: number };
      cloud: { label: string; value: number };
      hardware: { label: string; value: number };
    }) {
      this.systemScoreObj = scores;
    },
    setTechniques() {
      this.techniques = this.myJson;
    },
    removeTechnique(index) {
      this.techniques.splice(index, 1);
    },
    setFilters() {
      // set filter options from technique values
      this.setTechniques();
      const platforms = new Set();
      const nist = new Set();
      const cis = new Set();
      const platform_array = [] as Array<string>;
      const cis_array = [] as Array<string>;
      const nist_array = [] as Array<string>;
      // get all unique filter values for each category by adding to set objects
      for (const t of this.techniques) {
        if (t.platforms) {
          platforms.add(...t.platforms);
        }
        if (t.nist_controls) {
          nist.add(...t.nist_controls);
        }
        if (t.cis_controls) {
          cis.add(...t.cis_controls);
        }
      }
      // convert sets to array objects in checkbox format and remove undefined values
      for (const platform of platforms) {
        if (platform) {
          platform_array.push({ id: platform, name: platform, value: false });
        }
      }
      for (const item of cis) {
        if (item) {
          cis_array.push({ id: item, name: item, value: false });
        }
      }
      for (const item of nist) {
        if (item) {
          nist_array.push({ id: item, name: item, value: false });
        }
      }
      // sort filter arrays alphabetically
      nist_array.sort((a, b) =>
        a.name.localeCompare(b.name, "en", { numeric: true })
      );
      cis_array.sort((a, b) =>
        a.name.localeCompare(b.name, "en", { numeric: true })
      );
      platform_array.sort((a, b) =>
        a.name.localeCompare(b.name, "en", { numeric: true })
      );
      // update filter object with list of all nist, cis, and os options
      this.filterPropertiesObj[0].options = nist_array;
      this.filterPropertiesObj[1].options = cis_array;
      this.filterPropertiesObj[3].options = platform_array;
    },
  },
});
