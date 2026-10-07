<template>
    <div>
        <div v-for="monitoringType of monitoringTypes" :key="monitoringType"
            class=" 2xl:flex lg:block md:flex my-4">
            <h3 class="uppercase font-semibold text-xl my-auto">{{ monitoringType }} Monitoring Components</h3>
            <select-button v-model="systemScores[monitoringType]" :options="options" optionLabel="label"
                dataKey="value" class="my-auto ml-auto"></select-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import SelectButton from "primevue/selectbutton";
import type { SystemScoreKey } from "@/data/DataTypes";

export default defineComponent({
    components: { SelectButton },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            selectedValue: 0,
            options: [
                { label: "None", value: 1 },
                { label: "Low", value: 0.6666666666667 },
                { label: "Medium", value: 0.33333333333 },
                { label: "High", value: 0 },
            ]
        };
    },
    computed: {
        monitoringTypes(): SystemScoreKey[] {
            return Object.keys(
                this.calculatorStore.systemScore,
            ) as SystemScoreKey[];
        },
        systemScores() {
            return this.calculatorStore.systemScore
        },
    },
});
</script>

<style scoped></style>