<template>
    <section class="w-5/6 mx-auto py-20 text-center">
        <h1 class="uppercase text-4xl">Top ATT&CK Techniques Calculator</h1>
        <p>Use the following criteria to score your system and click generate in order to see your personalized list of
            techniques</p>
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
        <button @click="generateResults" class="btn-primary w-1/3">Generate</button>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Checkbox from "primevue/checkbox";
import CalculatorFilters from "@/components/CalculatorFilters.vue";
import CalculatorSystem from "@/components/CalculatorSystem.vue";
import { router } from "../router";

export default defineComponent({
    components: { Accordion, AccordionTab, Checkbox, CalculatorFilters, CalculatorSystem },
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
            router.push({ path: '/calculator-results' })
        }
    }
});
</script>

<style scoped></style>
