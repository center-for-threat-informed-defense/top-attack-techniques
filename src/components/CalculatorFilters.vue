<template>
    <div>
        <Accordion>
            <AccordionTab v-for="group in Object.keys(calculatorStore.filterProperties)" :key="group"
                :header="calculatorStore.filterProperties[group].label">
                <div v-if="group === 'nist'" class="checkbox-group">
                    <Checkbox v-model="checkAllNIST" :binary="true" input-id="select_all_nist"></Checkbox>
                    <label for="select_all_nist" class="my-auto">All NIST Controls</label>
                </div>
                <div v-if="group === 'cis'" class="checkbox-group">
                    <Checkbox v-model="checkAllCIS" :binary="true" input-id="select_all_cis"></Checkbox>
                    <label for="select_all_cis" class="my-auto">All CIS Controls</label>
                </div>
                <div v-for="option in calculatorStore.filterProperties[group].options" :key="option.id"
                    class="checkbox-group">
                    <Checkbox v-model="filters[group]" :value="option.name" :input-id="option.name" class="my-auto">
                    </Checkbox>
                    <label :for="option.name" class="my-auto">{{ option.name }}</label>
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
        checkAllNIST: {
            get: function () {
                return this.calculatorStore.filterProperties.nist.options ? this.filters.nist.length == this.calculatorStore.filterProperties.nist.options.length : false;
            },
            set: function (value) {
                const checked = [];
                if (value) {
                    this.calculatorStore.filterProperties.nist.options.forEach(function (lang) {
                        checked.push(lang.id);
                    });
                }
                this.filters.nist = checked.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
            }
        },
        checkAllCIS: {
            get: function () {
                return this.calculatorStore.filterProperties.cis.options ? this.filters.cis.length == this.calculatorStore.filterProperties.cis.options.length : false;
            },
            set: function (value) {
                const checked = [];
                if (value) {
                    this.calculatorStore.filterProperties.cis.options.forEach(function (lang) {
                        checked.push(lang.id);
                    });
                }
                this.filters.cis = checked.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
            }
        },
        filters() {
            this.calculatorStore.setFilters()
            return this.calculatorStore.activeFilters
        },
    },
    methods: {
        saveNewFilterValues() {
            this.calculatorStore.updateActiveFilters(this.filters)
        },
    },
});
</script>

<style scoped></style>