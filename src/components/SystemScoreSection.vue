<template>
    <div class="lg:hidden flex px-4 py-2">
        <h2 class="uppercase font-bold text-xl">Your System:</h2>
        <button class=" ml-auto" @click="editSelections()">
            <i class="pi pi-cog"
                v-tooltip="'Edit your filters and components to fine tune your top ten techniques'"></i>
        </button>
    </div>
    <div class="system-score-row">
        <div class="filters-scores inline">
            <div v-for="monitoringType of Object.keys(calculatorStore.systemScore)" :key="monitoringType"
                class="inline mr-2 w-max">
                <span class="highlight mr-1">{{ getScoreText(monitoringType) }}</span>
                <span>{{ monitoringType }} Monitoring</span>
            </div>
            <div v-for="filter of Object.keys(calculatorStore.activeFilters)" :key="filter" class="inline mr-2 w-max">
                {{ filter }}:
                <span class="highlight">{{ getFilterText(filter) }}</span>
            </div>
        </div>
        <div class="lg:inline hidden cursor-pointer" @click="editSelections()"
            v-tooltip.top="'Edit your filters and components to fine tune your top ten techniques'">
            <i class="pi pi-cog mr-2 mt-auto"></i>
            <span class="my-auto xl:inline xl:w-0 lg:hidden ">Edit Selection</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import { router } from "../router";
import Tooltip from 'primevue/tooltip';

export default defineComponent({
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            activeItemId: 1,
        };
    },
    methods: {
        getScoreText(key: string) {
            if (this.calculatorStore.systemScore[key].label === "None") { return "No" }
            return this.calculatorStore.systemScore[key].label
        },
        getFilterText(key: string) {
            if (this.calculatorStore.activeFiltersObj[key].size < 1) {
                return `All ${key} Controls`
            }
            return Array.from(this.calculatorStore.activeFilters[key]).join(", ")
        },
        editSelections() {
            router.push({ path: '/calculator' })
        },
    },
    directives: {
        Tooltip
    }
});
</script>

<style scoped>
.system-score-row {
    font-family: "Fira Sans Extra Condensed", sans-serif;
    @apply lg:max-w-max lg:mx-auto mx-4 uppercase font-bold lg:text-center;
}

.system-score-row .highlight {
    @apply text-ctid-blue
}

.filters-scores div {
    @apply lg:after:content-["|"] lg:after:text-ctid-light-gray lg:after:ml-2 after:content-[","] ml-[1px] last:after:content-[unset]
}
</style>