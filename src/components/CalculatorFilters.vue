<template>
    <div>
        <Accordion>
            <AccordionTab v-for="group in calculatorStore.filterProperties" :key="group.id" :header="group.label">
                <div v-for="option in group.options" :key="option.id" class="checkbox-group">
                    <Checkbox :input-id="option.id" :value="option.id" v-model="localFilters[group.id]"
                        class="my-auto" />
                    <label class="my-auto">{{ option.name }}</label>
                </div>
            </AccordionTab>
        </Accordion>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Checkbox from "primevue/checkbox";
import { useCalculatorStore } from "../stores/calculator.store";

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