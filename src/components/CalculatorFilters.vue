<template>
    <div>
        <Accordion>
            <AccordionTab v-for="group in Object.keys(calculatorStore.filterProperties)" :key="group"
                :header="calculatorStore.filterProperties[group].label">
                <div class="checkbox-group">
                    <Checkbox :model-value="isSelected(group)" :disabled="isSelected(group)" :binary="true"
                        aria-label="Select all" :input-id="`select_all_${group}`" @change="select(group)">
                    </Checkbox>
                    <label for="`select_all_${group}`" class="my-auto">All {{ group.toUpperCase() }} Controls</label>
                </div>
                <div v-for="option in calculatorStore.filterProperties[group].options" :key="option.id"
                    class="checkbox-group">
                    <Checkbox :model-value="isSelected(group, option.name)" @change="select(group, option.name)"
                        :binary="true" :aria-labelledby="option.id" class="my-auto">
                    </Checkbox>
                    <label :id="option.id" :for="option.name" class="my-auto">{{ option.name }}</label>
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
            return this.calculatorStore.activeFilters
        },
    },
    methods: {
        saveNewFilterValues() {
            this.calculatorStore.updateActiveFilters(this.filters)
        },
        isSelected(group: string, option?: string): boolean {
            if (!option) {
                return this.filters[group].size === 0
            } else {
                return this.filters[group].has(option);
            }
        },
        select(group: string, option?: string) {
            if (group && !option) {
                this.filters[group].clear()
            }
            if (group && option) {
                if (this.filters[group].has(option)) {
                    this.filters[group].delete(option)
                }
                else {
                    this.filters[group].add(option)
                }
                if (this.filters[group].size === this.calculatorStore.filterProperties[group].options.length) {
                    // if all options are selected, empty the set 
                    this.filters[group].clear()
                }
            }
        }
    },
    created() {
        this.calculatorStore.setFilters()
    }
});
</script>

<style scoped></style>