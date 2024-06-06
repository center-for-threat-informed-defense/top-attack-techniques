<template>
    <div>
        <SplitButton label="Download" @click="downloadAsJson" :model="items" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ArrowRight from "@/assets/arrow-right.svg";
import { type Technique, type ExportedTechnique } from "@/data/DataTypes";
import SplitButton from "primevue/splitbutton";
import downloadjs from "downloadjs";
import { useCalculatorStore } from "@/stores/calculator.store";

export default defineComponent({
    components: {
        SplitButton
    },
    props: {
        rankedList: {
            type: Array<Technique>,
            required: true
        },
    },
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            ArrowRight,
            items: [
                {
                    label: 'Download as JSON',
                    command: () => {
                        this.downloadAsJson()
                    }
                },
                {
                    label: 'Download as Navigator Layer',
                    command: () => {
                        this.downloadAsNavigatorLayer()
                    }
                }
            ]
        };
    },
    methods: {
        downloadAsJson() {
            const parsedList = [] as Array<ExportedTechnique>;

            this.rankedList.slice(0, 10).forEach((technique, i) => {
                const t = {
                    rank: i + 1,
                    tid: technique.tid,
                    name: technique.name,
                    description: technique.description,
                    url: technique.url,
                    detection: technique.detection,
                    score: technique.adjusted_score,
                    network_score: technique.network_score,
                    process_score: technique.process_score,
                    file_score: technique.file_score,
                    cloud_score: technique.cloud_score,
                    hardware_score: technique.hardware_score,
                    mitigations: technique.mitigations,
                    subtechniques: technique.subtechniques,
                    actionability_score: technique.actionability_score,
                    choke_point_score: technique.choke_point_score,
                    prevalence_score: technique.prevalence_score,
                }
                parsedList.push(t);
            })
            downloadjs(JSON.stringify(parsedList, null, 4), "TopTenTechniques.json", JSON)
        },
        downloadAsNavigatorLayer() {
            const gradient = ["#FFDDBD", "#ffaf66"]
            const layer = {
                "name": "Top 10 ATT&CK Techniques",
                "versions": {
                    "navigator": "4.8.0",
                    "layer": "4.5",
                    "attack": 10.1,
                },
                "sorting": 3,
                "description": "Top ATT&CK Techniques heatmap overview of ATT&CK",
                "domain": "enterprise-attack",
                "techniques": [] as Array<{
                    techniqueID: string;
                    score: number;
                    comment: string;
                    metadata: never[];
                }>,
                "gradient": {
                    "colors": gradient,
                    "minValue": 0,
                    "maxValue": 3
                },
            }
            this.rankedList.forEach((technique, i) => {
                let description = ` Rank: ${i + 1}`;
                for (const monitoringType of Object.keys(this.calculatorStore.systemScore)) {
                    if (technique[`${monitoringType}_score`]) {
                        description += `\n ${monitoringType.charAt(0).toUpperCase() + monitoringType.slice(1)} Score: ${parseFloat(technique[`${monitoringType}_score`]).toFixed(2)}`
                    }
                }
                description += `\n Actionability Score: ${technique.actionability_score?.toFixed(2)}\n Choke Point Score: ${technique.choke_point_score?.toFixed(2)}\n Prevalence Score: ${technique.prevalence_score?.toFixed(2)}`

                const t = {
                    "techniqueID": technique.tid,
                    "score": technique.adjusted_score,
                    "comment": description,
                    "metadata": [],
                }
                if (i > 9) {
                    t.color = "#FFFFFF"
                }
                layer.techniques.push(t)
            })

            layer.gradient.minValue = layer.techniques[9].score
            layer.gradient.maxValue = layer.techniques[0].score
            downloadjs(JSON.stringify(layer, null, 4), "TopTechniquesNavigatorLayer.json", JSON)
        }
    },
});
</script>

<style scoped></style>