<template>
    <div id="calculator" class="pb-20">
        <div class="w-5/6 mx-auto pt-20">
            <h1 class="text-center uppercase font-bold text-5xl">Your Top 10 Techniques</h1>
            <div class="w-full h-auto lg:border-0 border-[1px] border-ctid-black mt-4 mb-6 py-2 lg:py-0">
                <SystemScoreSection />
            </div>
        </div>
        <top-ten-wrapper :ranked-list="rankedList" :allowDelete="true" @delete-technique="(i) => deleteTechnique(i)" />
    </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from "vue";
import TopTenWrapper from "../components/TopTenWrapper.vue";
import type { Technique } from "@/data/DataTypes";
import { useCalculatorStore, type CalculatorStore } from "../stores/calculator.store";
import SystemScoreSection from "../components/SystemScoreSection.vue"
export default defineComponent({
    components: { SystemScoreSection, TopTenWrapper },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            activeItemId: 0,
            rankedList: Array<Technique>
        };
    },
    computed: {
        filters() {
            return this.calculatorStore.activeFilters;
        },
        scores() {
            return this.calculatorStore.systemScoreObj;
        },
    },
    methods: {
        deleteTechnique(index: number) {
            this.rankedList.splice(index, 1)
        },
        setRankedList() {
            let filteredList = structuredClone(toRaw(this.calculatorStore.techniques));
            filteredList = this.applyScores(filteredList)
            filteredList = this.applyFilters(filteredList)
            filteredList.sort(
                (a, b) => b.adjusted_score - a.adjusted_score
            );
            this.rankedList = filteredList
        },
        applyFilters(filteredList: Array<Technique>): Array<Technique> {
            const newFilterList = []
            // if there are no filters selected, then return full list of techniques
            if (this.filters.nist.size === 0 && this.filters.cis.size === 0 && this.filters.detection.size === 0 && this.filters.os.size === 0) {
                return filteredList;
            }
            for (const technique of filteredList) {
                if (this.checkForNist(technique) && this.checkForCis(technique) && this.checkForDetection(technique) && this.checkForOs(technique)) {
                    newFilterList.push(technique)
                }
            }
            return newFilterList
        },
        checkForCis(technique: Technique): boolean {
            if (this.filters.cis.size === 0) { return true }
            for (const property of this.filters.cis) {
                if (technique.cis_controls && technique.cis_controls.find(n => n === property)) {
                    return true;
                }
            }
            return false;
        },
        checkForNist(technique: Technique): boolean {
            if (this.filters.nist.size === 0) { return true }
            for (const property of this.filters.nist) {
                if (technique.nist_controls && technique.nist_controls.find(n => n === property)) {
                    return true;
                }
            }
            return false;
        },
        checkForOs(technique: Technique): boolean {
            if (this.filters.os.size === 0) { return true }
            for (const property of this.filters.os) {
                if (technique.platforms && technique.platforms.find(n => n === property)) {
                    return true;
                }
            }
            return false;
        },
        checkForDetection(technique: Technique): boolean {
            if (this.filters.detection.size === 0) { return true }
            for (const filterProp of this.filters.detection) {
                const key = this.calculatorStore.filterProperties.detection.options.find(i => i.name === filterProp)
                if (technique[key.id]) {
                    return true;
                }
            }
            return false;
        },
        applyScores(filteredList: Array<Technique>): Array<Technique> {
            type SystemScoreKeys = (keyof CalculatorStore["systemScoreObj"])[];
            filteredList = filteredList.map((technique) => {
                let score_adjustment = 1
                for (const monitoringType of Object.keys(this.scores) as SystemScoreKeys) {
                    if (technique[`${monitoringType}_coverage`]) {
                        score_adjustment += 1 / 5 * this.scores[monitoringType].value;
                    }
                }
                technique.adjusted_score = technique.cumulative_score * score_adjustment
                return technique;
            })
            return filteredList
        }
    },
    beforeMount() {
        this.setRankedList();
    },
});
</script>

<style scoped></style>
