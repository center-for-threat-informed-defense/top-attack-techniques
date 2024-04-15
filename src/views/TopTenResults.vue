<template>
    <div id="calculator" class="pb-20">
        <div class="w-5/6 mx-auto pt-20">
            <h1 class="text-center uppercase font-bold text-5xl">Your Top 10 Techniques</h1>
            <div class="w-full h-auto lg:border-0 border-[1px] border-ctid-black mt-4 mb-6 py-2 lg:py-0">
                <SystemScoreSection />
            </div>
        </div>
        <div class="lg:grid hidden grid-cols-3 gap-4 w-5/6 mx-auto calculator-box auto-rows-fr">
            <div class="col-span-1 calculator-list">
                <TopTenSidebar :top-ten="topTen" :activeItemId="activeItemId" />
                <button class="btn-primary mt-4" @click="download()">Download List</button>
            </div>
            <div class="col-span-2 h-full">
                <div class="calculator-details">
                    <div class="container-header">
                        <h2>
                            <span class=" text-ctid-light-purple">
                                {{ topTen[activeItemId].tid }}
                            </span>
                            {{ topTen[activeItemId].name }}
                        </h2>
                    </div>
                    <div>
                        <TopTenDetails :technique="topTen[activeItemId]" />
                    </div>
                </div>
            </div>

        </div>
        <div class="w-5/6 mx-auto lg:hidden block">
            <TopTenAccordion :top-ten="topTen" :activeItemId="activeItemId" />
            <button class="btn-primary mt-10" @click="download()">Download List</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import TopTenSidebar from "../components/TopTenSidebar.vue"
import TopTenDetails from "../components/TopTenDetails.vue"
import TopTenAccordion from "../components/TopTenAccordion.vue"
import SystemScoreSection from "../components/SystemScoreSection.vue"
import downloadjs from "downloadjs";

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
        deleteTechnique(index) {
            this.calculatorStore.removeTechnique(index)
            if (index < this.activeItemId) {
                this.setActiveIndex(this.activeItemId - 1)
            }
        },
        download() {
            downloadjs(JSON.stringify(this.topTen.slice(0, 10)), "TopTenTechniques.json", JSON)
        }
    }
});
</script>

<style scoped></style>
