<template>
    <div>
        <div v-for="monitoringType of Object.keys(this.calculatorStore.systemScore)" :key="monitoringType"
            class=" 2xl:flex lg:block md:flex my-4">
            <h3 class="uppercase font-semibold text-xl my-auto">{{ monitoringType }} Monitoring Components</h3>
            <select-button v-model="this.systemScores[monitoringType]" :options="this.options" optionLabel="label"
                dataKey="value" class="my-auto ml-auto"></select-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import SelectButton from "primevue/selectbutton";

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
        systemScores() {
            return this.calculatorStore.systemScore
        },
    },
    methods: {
        saveNewScores() {
            this.calculatorStore.updateSystemScores(this.systemScores)
        },
    }
});
</script>

<style scoped></style>