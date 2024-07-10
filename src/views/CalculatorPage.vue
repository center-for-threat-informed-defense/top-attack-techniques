<template>
    <section class="w-5/6 mx-auto py-20 text-center">
        <div class="pt-20">
            <h1 class="uppercase font-bold text-5xl">Top ATT&CK Techniques Calculator</h1>
            <p class="pt-4">Select the filters and/or components below, then click Generate to see a customized ranking
                of ATT&CK techniques.</p>
        </div>

        <div class="container-row">
            <div class="lg:w-2/5 container">
                <div class="container-header">
                    <h2>Filters</h2>
                </div>
                <div class="container-body">
                    <calculator-filters ref="calcFilterSection" />
                </div>
            </div>
            <div class="lg:w-3/5 container">
                <div class="container-header">
                    <h2>Score your system</h2>
                </div>
                <div class="container-body">
                    <calculator-system ref="calcSystemSection" />
                </div>
            </div>
        </div>
        <div class="lg:w-2/3 mx-auto">
            <button @click="generateResults" class="btn-primary">Generate</button>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import CalculatorFilters from "@/components/CalculatorFilters.vue";
import CalculatorSystem from "@/components/CalculatorSystem.vue";
import { router } from "../router";

export default defineComponent({
    components: { CalculatorFilters, CalculatorSystem },
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
        generateResults() {
            this.$refs.calcFilterSection.saveNewFilterValues()
            this.$refs.calcSystemSection.saveNewScores()
            router.push({ path: '/calculator/results' })
        }
    }
});
</script>

<style scoped>
.container-body,
.container-header {
    @apply py-4 px-6
}
</style>