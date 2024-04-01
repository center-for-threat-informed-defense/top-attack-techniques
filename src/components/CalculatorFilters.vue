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
            this.calculatorStore.updateActiveFilters(this.localFilters)
        },
    }
});
</script>

<style scoped></style>