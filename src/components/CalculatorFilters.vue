<template>
    <div>
        <Accordion>
            <AccordionTab v-for="group in calculatorStore.filterProperties" :key="group.id" :header="group.label">
                <div v-for="option in group.options" :key="option.id" class="checkbox-group">
                    <Checkbox :input-id="option.id" :value="option.name" v-model="this.filters[group.id]"
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
        };
    },
    computed: {
        filters() {
            this.calculatorStore.setFilters()
            return this.calculatorStore.activeFilters
        },
    },
    methods: {
        saveNewFilterValues() {
            this.calculatorStore.updateActiveFilters(this.filters)
        },
    }
});
</script>

<style scoped></style>