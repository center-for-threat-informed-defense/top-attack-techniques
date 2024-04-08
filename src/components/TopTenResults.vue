<template>
    <div id="calculator">
        <div class="w-5/6 mx-auto pt-20 pb-10">
            <h1 class="text-center uppercase font-bold text-5xl">Your Top 10 Techniques</h1>
            <SystemScoreSection />
        </div>
        <div class="lg:grid hidden grid-cols-3 gap-4 w-5/6 mx-auto calculator-box auto-rows-fr">
            <div class="col-span-1 calculator-list">
                <TopTenSidebar :top-ten="topTen" :activeItemId="activeItemId" />
                <button class="btn-primary mt-4">Download List</button>
            </div>
            <div class="col-span-2 h-full">
                <div class="calculator-details">
                    <div class="container-header">
                        <h2>
                            <span class=" text-mitre-light-purple">
                                {{ topTen[activeItemId].tid }}
                            </span>
                            {{ topTen[activeItemId].name }}
                        </h2>
                    </div>
                    <div class="container-body">
                        <TopTenDetails :technique="topTen[activeItemId]" />
                    </div>
                </div>
            </div>

        </div>
        <div class="w-5/6 mx-auto lg:hidden block">
            <TopTenAccordion :top-ten="topTen" :activeItemId="activeItemId" />
            <button class="btn-primary mt-4">Download List</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import TopTenSidebar from "./TopTenSidebar.vue"
import TopTenDetails from "./TopTenDetails.vue"
import TopTenAccordion from "./TopTenAccordion.vue"
import SystemScoreSection from "../components/SystemScoreSection.vue"

export default defineComponent({
    components: { TopTenSidebar, TopTenDetails, TopTenAccordion, SystemScoreSection },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            activeItemId: 0,
        };
    },
    computed: {
        topTen() {
            this.calculatorStore.setTechniques()
            return this.calculatorStore.techniques
        }
    },
    methods: {
        setActiveIndex(index) {
            this.activeItemId = index
        },
        accordionName(technique) {
            return technique.tid + " " + technique.name
        },
        deleteTechnique(index) {
            this.calculatorStore.removeTechnique(index)
            if (index < this.activeItemId) {
                this.setActiveIndex(this.activeItemId - 1)
            }
        }
    }
});
</script>

<style scoped></style>
