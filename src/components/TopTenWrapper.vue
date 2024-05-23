<template>
    <div id="calculator" class="pb-20">
        <div v-if="rankedList.length > 1"
            class="lg:grid hidden grid-cols-3 gap-4 w-5/6 mx-auto calculator-box auto-rows-fr">

            <div class="col-span-1 calculator-list">
                <TopTenSidebar :ranked-list="rankedList" :activeItemId="activeItemId" :allowDelete="allowDelete" />
                <button class="btn-primary mt-4" @click="download()">Download List</button>
            </div>
            <div class="col-span-2 h-full">
                <div class="calculator-details">
                    <div class="container-header">
                        <h2>
                            <span class=" text-ctid-light-purple">
                                {{ rankedList[activeItemId].tid }}
                            </span>
                            {{ rankedList[activeItemId].name }}
                        </h2>
                    </div>
                    <div>
                        <TopTenDetails :technique="rankedList[activeItemId]" />
                    </div>
                </div>
            </div>

        </div>
        <div v-if="rankedList.length > 1" class="w-5/6 mx-auto lg:hidden block">
            <TopTenAccordion :ranked-list="rankedList" :activeItemId="activeItemId" :allowDelete="allowDelete" />
            <button class="btn-primary mt-10" @click="download()">Download List</button>
        </div>
        <div v-if="rankedList.length <= 1" class="mx-auto italic w-max">
            No techniques found for the given criteria.
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import TopTenSidebar from "../components/TopTenSidebar.vue"
import TopTenDetails from "../components/TopTenDetails.vue"
import TopTenAccordion from "../components/TopTenAccordion.vue"
import downloadjs from "downloadjs";
import { type Technique } from "../data/DataTypes"

export default defineComponent({
    components: { TopTenSidebar, TopTenDetails, TopTenAccordion },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            activeItemId: 0,
        };
    },
    props: {
        rankedList: {
            type: Array<Technique>,
            required: true,
        },
        allowDelete: {
            type: Boolean,
            default: true,
        }
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
            this.$parent.deleteTechnique(index)
        },
        download() {
            downloadjs(JSON.stringify(this.rankedList.slice(0, 10)), "TopTenTechniques.json", JSON)
        },
    },
});
</script>

<style scoped></style>
