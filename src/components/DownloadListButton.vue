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
            const gradient = ["#ffe766", "#ffaf66"]
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
                    "maxValue": 1
                },
            }
            for (const technique of this.rankedList.slice(0, 10)) {
                const t = {
                    "techniqueID": technique.tid,
                    "score": technique.adjusted_score,
                    "comment": "",
                    "metadata": [],
                }
                layer.techniques.push(t)
            }
            layer.gradient.minValue = Math.min(...layer.techniques.map(o => o.score));
            layer.gradient.maxValue = Math.max(...layer.techniques.map(o => o.score));
            downloadjs(JSON.stringify(layer, null, 4), "TopTenTechniquesNavigatorLayer.json", JSON)
        }
    },
});
</script>

<style scoped></style>