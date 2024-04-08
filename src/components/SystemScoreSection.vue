<template>
    <div class="flex w-max gap-6 mx-auto mt-4 system-score-row">
        <div v-for="monitoringType of Object.keys(this.calculatorStore.systemScore)" :key="monitoringType">
            <h2 class="uppercase font-bold text-mitre-black"><span class="highlight">{{
            getScoreText(monitoringType) }}</span>
                {{ monitoringType }} Monitoring </h2>
        </div>
        <button class="flex gap-2" @click="editSelections()">
            <img :src="GearSvg" class="my-auto" />
            <h2 class="xl:block hidden uppercase font-bold text-mitre-black my-auto">Edit Selections</h2>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import GearSvg from "@/assets/gear.svg"
import { router } from "../router";
export default defineComponent({
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            activeItemId: 1,
            GearSvg
        };
    },
    methods: {
        getScoreText(key) {
            if (this.calculatorStore.systemScore[key].label === "None") { return "No" }
            return this.calculatorStore.systemScore[key].label
        },
        editSelections() {
            router.push({ path: '/calculator' })
        }
    }
});
</script>

<style scoped></style>