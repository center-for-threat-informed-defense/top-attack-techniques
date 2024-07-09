import { defineStore } from "pinia";
import json from "../data/Techniques.json";
import type { Technique } from "@/data/DataTypes";

export const useCalculatorStore = defineStore("calculator", {
  state: () => ({
    techniques: json as Array<Technique>,
    activeFiltersObj: {
      nist: new Set<string>(),
      cis: new Set<string>(),
      detection: new Set<string>(),
      os: new Set<string>(),
    },
    filterPropertiesObj: {
      nist: {
        label: "NIST 800-53 Controls",
        options: [] as Array<{ id: string; name: string; value: boolean }>,
      },
      cis: {
        label: "CIS Security Controls",
        options: [] as Array<{ id: string; name: string; value: boolean }>,
      },
      detection: {
        label: "Detection Analytics",
        options: [
          { id: "has_car", name: "CAR", value: false },
          { id: "has_es_siem", name: "Elastic Search SIEM", value: false },
          { id: "has_sigma", name: "Sigma", value: false },
          { id: "has_splunk", name: "Splunk", value: false },
        ],
      },
      os: {
        label: "Operating Systems",
        options: [] as Array<{ id: string; name: string; value: boolean }>,
      },
    },
    systemScoreObj: {
      network: { label: "None", value: 1 },
      process: { label: "None", value: 1 },
      file: { label: "None", value: 1 },
      cloud: { label: "None", value: 1 },
      hardware: { label: "None", value: 1 },
    },
    topTenListInfo: [
      {
        id: "ransomware",
        name: "Ransomware",
        description: "This is the Ransomware list",
        techniques: [
          "T1059",
          "T1078",
          "T1021.001",
          "T1047",
          "T1490",
          "T1105",
          "T1083",
          "T1486",
          "T1190",
          "T1489",
        ],
      },
      // {
      //   id: "sector",
      //   name: "Sector",
      //   description: "This is the Sector list",
      //   techniques: []
      // },
      // {
      //   id: "black_cat",
      //   name: "BlackCat",
      //   description: "This is the BlackCat list",
      //   techniques: []
      // },
    ],
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
    allNISTOptions(state) {
      return state.filterPropertiesObj.nist.options.map((i) => i.name);
    },
    allCISOptions(state) {
      return state.filterPropertiesObj.cis.options.map((i) => i.name);
    },
    topTenLists(state) {
      return state.topTenListInfo;
    },
  },

  actions: {
    updateActiveFilters(filterValues: {
      nist: Set<string>;
      cis: Set<string>;
      detection: Set<string>;
      os: Set<string>;
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
    removeTechnique(index: number) {
      this.techniques.splice(index, 1);
    },
    setFilters() {
      // set filter options from technique values
      const platforms = new Set<string>();
      const nist = new Set<string>();
      const cis = new Set<string>();
      const platform_array = [] as Array<{
        id: string;
        name: string;
        value: boolean;
      }>;
      const cis_array = [] as Array<{
        id: string;
        name: string;
        value: boolean;
      }>;
      const nist_array = [] as Array<{
        id: string;
        name: string;
        value: boolean;
      }>;
      // get all unique filter values for each category by adding to set objects
      for (const t of this.techniques) {
        if (t.platforms) {
          t.platforms.forEach((i) => platforms.add(i));
        }
        if (t.nist_controls) {
          t.nist_controls.forEach((i) => nist.add(i));
        }
        if (t.cis_controls) {
          t.cis_controls.forEach((i) => cis.add(i));
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
      this.filterPropertiesObj.nist.options = nist_array;
      this.filterPropertiesObj.cis.options = cis_array;
      this.filterPropertiesObj.os.options = platform_array;
    },
    getTopTenList(ids: Array<string>): Array<Technique> {
      // return static list as determined by list of ids sent in
      const ransomwareTop = [] as Array<Technique>;
      for (const id of ids) {
        const technique = this.techniques.find((t) => t.tid === id);
        if (technique) {
          ransomwareTop.push(technique);
        }
      }
      return ransomwareTop;
    },
  },
});
// Define Calculator Store Type
export type CalculatorStore = ReturnType<typeof useCalculatorStore>;
