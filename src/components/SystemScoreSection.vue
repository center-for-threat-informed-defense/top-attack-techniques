<template>
    <div class="lg:hidden flex px-4 py-2">
        <h2 class="uppercase font-bold text-xl">Your System:</h2>
        <button class=" ml-auto" @click="editSelections()">
            <i class="pi pi-cog"
                v-tooltip="'Click here to edit your system selections and recalibrate the top ten list'"></i>
        </button>
    </div>
    <div>
        <p class="system-score-row px-4 w-max max-w-full mx-auto my-auto uppercase font-bold text-ctid-black">
            <span v-for="monitoringType of Object.keys(this.calculatorStore.systemScore)" :key="monitoringType"
                class=" mr-4 "><span class="highlight">{{
            getScoreText(monitoringType) }}</span>
                {{ monitoringType }} Monitoring </span>
            <span v-for="filter of Object.keys(this.calculatorStore.activeFilters)" :key="filter">
                <span class="mr-4" v-if="this.calculatorStore.activeFilters[filter].length > 0">
                    {{ filter }}:
                    <span class="highlight">{{ this.calculatorStore.activeFilters[filter].join(", ") }}</span>
                </span>
            </span>
            <span class="lg:inline hidden cursor-pointer" @click="editSelections()"
                v-tooltip.top="'Click here to edit your system selections and recalibrate the top ten list'">
                <i class="pi pi-cog mr-2 mt-auto"></i>
                <span class="my-auto">Edit Selection</span>
            </span>
        </p>


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

}

.system-score-row .highlight {
    @apply text-ctid-primary-purple
}
</style>