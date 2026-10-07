<template>
    <div>
        <template v-for="monitoringType of Object.keys(this.calculatorStore.systemScore)" :key="monitoringType">
            <div
                class=" 2xl:flex lg:block md:flex mt-4">
                <div class="flex items-center gap-2">
                    <h3 class="uppercase font-semibold text-xl my-auto">{{ monitoringType }} Monitoring Components</h3>
                    <button
                        class="text-sm"
                        @click="() => onClickMoreInfo(monitoringType)"
                    >more info
                        <i  v-if="openComponents.has(monitoringType)" class="pi pi-chevron-up text-xs"></i>
                        <i  v-else class="pi pi-chevron-down text-xs"></i>
                    </button>
                </div>
                
                
                <select-button v-model="this.systemScores[monitoringType]" :options="this.options" optionLabel="label"
                    dataKey="value" class="my-auto ml-auto"></select-button>
            </div>
            <p v-if="openComponents.has(monitoringType)" class="ml-2 text-sm mt-1">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur qui quaerat magni voluptates dignissimos ipsum ducimus dicta laborum maxime repellat. Impedit vitae libero at debitis deserunt tenetur, laudantium quasi facilis?</p>

        </template>
        
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
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
    setup() {
        const openComponents = ref(new Set<string>([]));

        return {
            openComponents
        }
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
        onClickMoreInfo(monitoringType: string) {
            if (this.openComponents.has(monitoringType)) {
                this.openComponents.delete(monitoringType);
            } else {
                this.openComponents.add(monitoringType);
            }
            this.openComponents = new Set(this.openComponents);
        }
    }
});
</script>

<style scoped>

details[open] summary .pi-chevron-down {
    transform: rotate(180deg);
}

</style>