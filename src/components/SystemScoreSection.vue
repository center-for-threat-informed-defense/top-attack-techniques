<template>
    <div class="lg:hidden flex px-4 py-2">
        <h2 class="uppercase font-bold text-xl">Your System:</h2>
        <button class=" ml-auto" @click="editSelections()">
            <i class="pi pi-cog"
                v-tooltip="'Edit your filters and components to fine tune your top ten techniques'"></i>
        </button>
    </div>
    <div class="system-score-row">
        <div v-for="monitoringType of Object.keys(this.calculatorStore.systemScore)" :key="monitoringType"
            class="w-max inline-block mr-4">
            <span class="highlight">{{ getScoreText(monitoringType) }}</span>
            {{ monitoringType }} Monitoring
        </div>
        <div v-for="filter of Object.keys(this.calculatorStore.activeFilters)" :key="filter" class="inline-block">
            <span class="mr-4 w-max inline-block" v-if="this.calculatorStore.activeFilters[filter].length > 0">
                {{ filter }}:
                <span class="highlight">{{ this.calculatorStore.activeFilters[filter].join(", ") }}</span>
            </span>
        </div>
        <div class="lg:inline-block hidden cursor-pointer" @click="editSelections()"
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
        getScoreText(key) {
            if (this.calculatorStore.systemScore[key].label === "None") { return "No" }
            return this.calculatorStore.systemScore[key].label
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
    @apply lg:max-w-max lg:mx-auto mx-4 uppercase font-bold;
}

.system-score-row .highlight {
    @apply text-ctid-primary-purple
}
</style>