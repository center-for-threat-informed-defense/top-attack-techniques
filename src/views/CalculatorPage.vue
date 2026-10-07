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
        <div class="lg:w-2/3 mx-auto container">
            <div class="container-header">
                <h2>Prevalence Data</h2>
            </div>
            <div class="container-body">

                <p class="mb-5">
                    Opt in to allow the prevalence of specific ATT&CK techniques to affect the ranking.
                    Either use default global prevalence data or upload your own JSON or Excel (.xlsx)
                    prevalence profile.
                </p>
                <div class="flex">
                    <div class="flex-1 p-3 flex justify-center items-center">
                        <div class="flex items-center gap-2">
                            <Checkbox
                                v-model="calculatorStore.useGlobalPrevalence"
                                @change="onChangeUseGlobalPrevalence"
                                input-id="use-global-prevalence-checkbox"
                                binary
                            ></Checkbox>
                            <label
                                for="use-global-prevalence-checkbox"
                            >
                                Use Global Prevalence
                            </label>
                        </div>
                    </div>
                    <div class="flex flex-col items-center justify-center font bold">
                        <div class="dividing-line"></div>
                        OR
                        <div class="dividing-line"></div>
                    </div>
                    <div id="file-upload-option-container" class="p-3" style="flex: 2" :data-using-global-prevalence="calculatorStore.useGlobalPrevalence">
                        
                        <p>
                            <span class="mr-1 font-bold">Templates:</span> 
                            <template v-for="(f, index) in templatePrevalenceFileNames" :key="f">
                                <a
                                    class="text-ctid-blue hover:underline"
                                    :href="getFileUrl(f)"
                                    :download="f"
                                >
                                    {{ f }}
                                </a>
                                <span v-if="index < samplePrevalenceFileNames.length - 1">, </span>
                            </template>
                        </p>
                        <p class="mb-4">
                            <span class="mr-1 font-bold">Global/Sample Prevalence Data:</span> 
                            <template v-for="(f, index) in samplePrevalenceFileNames" :key="f">
                                <a
                                    class="text-ctid-blue hover:underline"
                                    :href="getFileUrl(f)"
                                    :download="f"
                                >
                                    {{ f }}
                                </a>
                                <span v-if="index < samplePrevalenceFileNames.length - 1">, </span>
                            </template>
                            
                        </p>
                        <label
                            for="prevalence-data-upload"
                            class="btn-primary cursor-pointer inline-block"
                        >
                            Upload Prevalence Data
                        </label>
                        <input
                            id="prevalence-data-upload"
                            class="sr-only"
                            type="file"
                            accept=".json,.xlsx,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            @change="selectPrevalenceFile"
                            :disabled="calculatorStore.useGlobalPrevalence"
                        />
                        <p v-if="selectedPrevalenceFileName" class="mt-3 flex items-center">
                            Selected file: {{ selectedPrevalenceFileName }}
                            <button
                                type="button"
                                class="ml-2 text-ctid-blue hover:underline"
                                aria-label="Remove uploaded prevalence file"
                                title="Remove uploaded prevalence file"
                                @click="clearPrevalenceFile"
                            >
                                <i class="pi pi-times flex items-center text-sm"></i>
                            </button>
                        </p>
                        <p v-if="uploadError" class="mt-3 text-red-700" role="alert">
                            {{ uploadError }}
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="lg:w-2/3 mx-auto">
            <button @click="generateResults" class="btn-primary">Generate</button>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useCalculatorStore } from "../stores/calculator.store";
import CalculatorFilters from "@/components/CalculatorFilters.vue";
import CalculatorSystem from "@/components/CalculatorSystem.vue";
import type { UploadedPrevalence } from "@/domain/importPrevalenceWorkbook";
import { router } from "../router";
import Checkbox from "primevue/checkbox";

export default defineComponent({
    components: { CalculatorFilters, CalculatorSystem, Checkbox },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            uploadError: "",
            samplePrevalenceFileNames: [
                'sample_prevalence.json', 'sample_prevalence.xlsx'
            ],
            templatePrevalenceFileNames: [
                'template_prevalence.json', 'template_prevalence.xlsx'
            ]
        };
    },
    computed: {
        filters() {
            return this.calculatorStore.activeFilters
        },
        selectedPrevalenceFileName() {
            return this.calculatorStore.uploadedPrevalenceFileName;
        },
    },
    methods: {
        async selectPrevalenceFile(event: Event) {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];
            this.uploadError = "";

            if (!file) {
                return;
            }

            try {
                const prevalence = await this.parsePrevalenceFile(file);
                this.calculatorStore.updateUploadedPrevalence(prevalence, file.name);
            } catch (error) {
                this.uploadError = error instanceof Error ? error.message : "Unable to read the prevalence file.";
                input.value = "";
            }
        },
        async parsePrevalenceFile(file: File): Promise<Array<UploadedPrevalence>> {
            if (file.name.toLowerCase().endsWith(".xlsx")) {
                const { importPrevalenceWorkbook } = await import("@/domain/importPrevalenceWorkbook");
                return importPrevalenceWorkbook(await file.arrayBuffer());
            }

            if (file.name.toLowerCase().endsWith(".json")) {
                const parsedFile = JSON.parse(await file.text()) as unknown;
                if (!Array.isArray(parsedFile)) {
                    throw new Error("The JSON file must contain an array of prevalence records.");
                }

                return parsedFile as Array<UploadedPrevalence>;
            }

            throw new Error("Upload a JSON or .xlsx prevalence file.");
        },
        clearPrevalenceFile() {
            this.calculatorStore.clearUploadedPrevalence();
            this.uploadError = "";

            const input = document.getElementById("prevalence-data-upload") as HTMLInputElement | null;
            if (input) {
                input.value = "";
            }
        },
        generateResults() {
            router.push({ path: '/calculator/results' })
        },
        getFileUrl(file_name: string) {
            return `${import.meta.env.BASE_URL}${file_name}`;
        },
        async onChangeUseGlobalPrevalence() {
            if (
                this.calculatorStore.useGlobalPrevalence &&
                this.calculatorStore.globalPrevalence.length === 0
            ) {
                await this.calculatorStore.loadGlobalPrevalence();
            }
        }
    }
});
</script>

<style scoped>
.container-body,
.container-header {
    @apply py-4 px-6
}

label[for="prevalence-data-upload"]:has(
  + #prevalence-data-upload:disabled
) {
  @apply opacity-50 pointer-events-none;
}

#file-upload-option-container[data-using-global-prevalence="true"] {
    @apply opacity-50 pointer-events-none;
}

.dividing-line {
    background-color: lightgrey;
    width: 1px;
    flex: 1;
}
</style>
