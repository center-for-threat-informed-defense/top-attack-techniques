<template>
    <div>
        <p>Score options go here</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "@/stores/calculator.store";

export default defineComponent({
    data() {
        return {
            calculatorStore: useCalculatorStore(),
        };
    },
    computed: {
        systemScores() {
            return this.calculatorStore.systemScores
        }
    }
});
</script>

<style scoped></style>