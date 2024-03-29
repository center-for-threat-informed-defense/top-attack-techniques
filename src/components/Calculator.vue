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
          <Accordion >
            <AccordionTab v-for="group in calculatorStore.filterProperties" :key="group.id" :header="group.label">
              <div v-for="option in group.options" :key="option.id" class="checkbox-group">
                <Checkbox :input-id="option.id" :value="option.id" v-model="localFilters[option.id]" class="my-auto"/>
                <label class="my-auto">{{ option.name }}</label>
              </div>
            </AccordionTab>
          </Accordion>
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
import { useCalculatorStore } from "../stores/calculator.store";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Checkbox from "primevue/checkbox";

export default defineComponent({
  components: { Accordion, AccordionTab, Checkbox },
  data() {
    return {
      calculatorStore: useCalculatorStore(),
      localFilters: {
        nist: [],
        cis: [],
        detection: [],
        os: [],
      }
    };
  },
  computed: {
    filters() {
      return this.calculatorStore.activeFilters
    },
  },
  methods: {
    saveNewFilterValues() {
      this.calculatorStore.updateActiveFilters(this.getNewFilterValues)
    },
    getNewFilterValues() {
      let nistFilters = [],
        cisFilters = [],
        detectionAnalytics = [],
        platforms = [];

      for (const filter of this.localFilters.values(this.filters)) {
        filter.options.forEach((option) => {
          if (option.value) {
            if (filter.id === "nist_controls") nistFilters.push(option.id);
            else if (filter.id === "cis_controls") cisFilters.push(option.id);
            else if (filter.id === "detection_analytics")
              detectionAnalytics.push(option.id);
            else if (filter.id === "platforms") platforms.push(option.id);
          }
        });
      }

      return {
        nist_controls: nistFilters,
        cis_controls: cisFilters,
        detection_analytics: detectionAnalytics,
        platforms: platforms,
      };
    },
  }
});
</script>

<style scoped></style>
