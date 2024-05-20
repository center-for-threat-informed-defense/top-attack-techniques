<template>
    <div id="calculator" class="pb-20">
        <div class="w-5/6 mx-auto pt-20">
            <h1 class="text-center uppercase font-bold text-5xl">Your Top 10 Techniques</h1>
            <div class="w-full h-auto lg:border-0 border-[1px] border-ctid-black mt-4 mb-6 py-2 lg:py-0">
                <SystemScoreSection />
            </div>
        </div>
        <top-ten-wrapper :ranked-list="rankedList" :allowDelete="true" />
    </div>
</template>

<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import SystemScoreSection from "../components/SystemScoreSection.vue"
import downloadjs from "downloadjs";
import { type Technique } from "../data/DataTypes"
import TopTenWrapper from "../components/TopTenWrapper.vue";

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
        setActiveIndex(index: number) {
            this.activeItemId = index
        },
        deleteTechnique(index: number) {
            this.rankedList.splice(index, 1)
            if (index < this.activeItemId) {
                this.setActiveIndex(this.activeItemId - 1)
            }
        },
        download() {
            downloadjs(JSON.stringify(this.rankedList.slice(0, 10)), "TopTenTechniques.json", JSON)
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
        applyFilters(filteredList: Array<Technique>) {
            const newFilterList = []
            // if there are no filters selected, then return full list of techniques
            if (this.filters.nist.size === 0 && this.filters.cis.size === 0 && this.filters.detection.size === 0 && this.filters.os.size === 0) {
                return filteredList;
            }
            for (const technique of filteredList) {
                if (this.addTechniqueToList(technique)) {
                    newFilterList.push(technique)
                }
            }
            return newFilterList
        },
        addTechniqueToList(technique: Technique): boolean {
            for (const property of this.filters.cis) {
                if (technique.cis_controls && technique.cis_controls.find(c => c === property)) {
                    return true;
                }
            }

            for (const property of this.filters.nist) {
                if (technique.nist_controls && technique.nist_controls.find(n => n === property)) {
                    return true;
                }
            }
            for (const property of this.filters.os) {
                if (technique.platforms && technique.platforms.find(n => n === property)) {
                    return true;
                }
            }
            for (const filterProp of this.filters.detection) {
                const key = this.calculatorStore.filterProperties.detection.options.find(i => i.name === filterProp)
                if (technique[key.id]) {
                    return true;
                }
            }
            return false;
        },
        applyScores(filteredList: Array<Technique>) {
            for (const monitoringType of Object.keys(this.scores)) {
                const adjustment = this.scores[monitoringType].value;
                filteredList = filteredList.map((technique) => {
                    if (technique[`${monitoringType}_coverage`]) {
                        const score_adjustment = ((1 / Object.keys(this.scores).length) * adjustment)
                        technique.adjusted_score += score_adjustment;
                        technique[`${monitoringType}_score`] = score_adjustment;
                    }
                    return technique
                })
            }
            return filteredList
        }
    },
    beforeMount() {
        this.setRankedList();
    },
});
</script>

<style scoped></style>
